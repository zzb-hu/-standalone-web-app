// Polyfill for HTML5 Fullscreen API in Tauri webview.
// Bridges the standard requestFullscreen / exitFullscreen DOM API to Tauri's
// native window fullscreen so video sites (YouTube, Vimeo, Bilibili, etc.) can
// go true fullscreen on their player buttons.
//
// Split out from component.js so a future CLI flag (or custom.js override)
// can short-circuit the polyfill for apps that don't need video fullscreen.
(function () {
  if (window.__PAKE_FULLSCREEN_POLYFILL__) return;
  window.__PAKE_FULLSCREEN_POLYFILL__ = true;

  function initFullscreenPolyfill() {
    if (!window.__TAURI__ || !document.head) {
      setTimeout(initFullscreenPolyfill, 100);
      return;
    }

    const appWindow = window.__TAURI__.window.getCurrentWindow();
    let fullscreenElement = null;
    let actualFullscreenElement = null;
    let originalStyles = null;
    let originalParent = null;
    let originalNextSibling = null;
    let wasInBody = false;
    let monitorId = null;
    // Scroll position captured at fullscreen entry, restored on exit to fix
    // the Douyin/Bilibili "scrollbar after ESC" bug where lazy-loaded content
    // shifts the page and leaves the video below the fold.
    let savedScrollX = 0;
    let savedScrollY = 0;

    if (!document.getElementById("pake-fullscreen-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "pake-fullscreen-style";
      // KEY: we pin the video with position:fixed but do NOT move it in the DOM.
      // Moving the <video> out of its player container breaks React event
      // handlers that hold a reference to the video element's original position
      // (Douyin: like/comment/favorite/share buttons stop working).
      // Keeping it in place means all JS frameworks still see the video where
      // they expect it; only the visual layout changes.
      styleEl.textContent = `
      body.pake-fullscreen-active {
        overflow: hidden !important;
      }
      .pake-fullscreen-element {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
        z-index: 2147483647 !important;
        background: #000 !important;
        object-fit: contain !important;
      }
      .pake-fullscreen-element video {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
      }
      /* When the video itself is pinned (not the player container), we need
         its controls overlay (Douyin xgplayer chrome, Bilibili bpx-player
         controls) to also stack on top of the pinned video. Without this,
         the video's z-index:2147483647 covers its own sibling controls and
         they stop receiving hover/click — the "quality menu invisible" and
         "like button dead" bugs share this root cause. */
      .pake-fullscreen-element [class*="controls"],
      .pake-fullscreen-element [class*="chrome"],
      .pake-fullscreen-element [class*="player-overlay"],
      .pake-fullscreen-element [class*="xg-controls"],
      .pake-fullscreen-element [class*="xgplayer-controls"],
      .pake-fullscreen-element [class*="bpx-controls"] {
        position: fixed !important;
        z-index: 2147483647 !important;
      }
    `;
      document.head.appendChild(styleEl);
    }

    function startFullscreenMonitor() {
      if (monitorId) return;
      monitorId = setInterval(() => {
        appWindow
          .isFullscreen()
          .then((isFullscreen) => {
            if (fullscreenElement && !isFullscreen) {
              exitFullscreen();
            }
          })
          .catch(() => {});
      }, 500);
    }

    function stopFullscreenMonitor() {
      if (!monitorId) return;
      clearInterval(monitorId);
      monitorId = null;
    }

    function findMediaElement() {
      const videos = document.querySelectorAll("video");
      if (videos.length > 0) {
        let largestVideo = videos[0];
        let maxArea = 0;
        videos.forEach((video) => {
          const rect = video.getBoundingClientRect();
          const area = rect.width * rect.height;
          if (area > maxArea || !video.paused) {
            maxArea = area;
            largestVideo = video;
          }
        });
        return largestVideo;
      }
      return null;
    }

    function enterFullscreen(element) {
      fullscreenElement = element;

      // Save scroll position before entering fullscreen so we can restore it
      // on exit. Sites like Douyin/Bilibili lazy-load content while fullscreen
      // is active, which shifts scroll offsets; restoring scrollY prevents the
      // "scrollbar appears after ESC" bug where the video is off-screen.
      savedScrollX = window.scrollX;
      savedScrollY = window.scrollY;

      let targetElement = element;
      if (element === document.documentElement || element === document.body) {
        const mediaElement = findMediaElement();
        if (mediaElement) {
          targetElement = mediaElement;
          actualFullscreenElement = mediaElement;
        } else {
          actualFullscreenElement = element;
        }
      } else {
        actualFullscreenElement = element;
      }

      originalStyles = {
        position: targetElement.style.position,
        top: targetElement.style.top,
        left: targetElement.style.left,
        width: targetElement.style.width,
        height: targetElement.style.height,
        maxWidth: targetElement.style.maxWidth,
        maxHeight: targetElement.style.maxHeight,
        margin: targetElement.style.margin,
        padding: targetElement.style.padding,
        zIndex: targetElement.style.zIndex,
        background: targetElement.style.background,
        objectFit: targetElement.style.objectFit,
      };

      // NOTE: we intentionally do NOT move the target element in the DOM.
      // Previous versions did `document.body.appendChild(targetElement)` to
      // hoist the video above page chrome, but that breaks React's internal
      // references on Douyin: like/comment/favorite/share buttons query the
      // video element via its original DOM position, and moving it severs
      // that link — clicks stop working even though keyboard shortcuts still
      // do (they're bound on document, not on the video's parent).
      // The CSS rule `.pake-fullscreen-element { position: fixed; z-index: max }`
      // alone is enough to visually overlay the video on the whole viewport
      // without disturbing the DOM tree.
      wasInBody = true; // pretend it's already in body so exitFullscreen skips the reparent dance
      originalParent = null;
      originalNextSibling = null;

      targetElement.classList.add("pake-fullscreen-element");
      document.body.classList.add("pake-fullscreen-active");

      appWindow.setFullscreen(true).then(() => {
        startFullscreenMonitor();
        const event = new Event("fullscreenchange", { bubbles: true });
        document.dispatchEvent(event);
        element.dispatchEvent(event);

        const webkitEvent = new Event("webkitfullscreenchange", {
          bubbles: true,
        });
        document.dispatchEvent(webkitEvent);
        element.dispatchEvent(webkitEvent);
      });

      return Promise.resolve();
    }

    function exitFullscreen() {
      if (!fullscreenElement) {
        return Promise.resolve();
      }

      stopFullscreenMonitor();

      const exitingElement = fullscreenElement;
      const targetElement = actualFullscreenElement;

      targetElement.classList.remove("pake-fullscreen-element");
      document.body.classList.remove("pake-fullscreen-active");

      if (originalStyles) {
        Object.keys(originalStyles).forEach((key) => {
          targetElement.style[key] = originalStyles[key];
        });
      }

      if (!wasInBody && originalParent) {
        if (
          originalNextSibling &&
          originalNextSibling.parentNode === originalParent
        ) {
          originalParent.insertBefore(targetElement, originalNextSibling);
        } else if (originalParent.isConnected) {
          originalParent.appendChild(targetElement);
        }
      }

      fullscreenElement = null;
      actualFullscreenElement = null;
      originalStyles = null;
      originalParent = null;
      originalNextSibling = null;
      wasInBody = false;

      return appWindow.setFullscreen(false).then(() => {
        // Restore scroll position AFTER the native fullscreen exits and the
        // layout settles. Use rAF so the browser paints one frame before we
        // jump — otherwise the transition may fight our scrollTo.
        requestAnimationFrame(() => {
          window.scrollTo(savedScrollX, savedScrollY);
        });

        const event = new Event("fullscreenchange", { bubbles: true });
        document.dispatchEvent(event);
        exitingElement.dispatchEvent(event);

        const webkitEvent = new Event("webkitfullscreenchange", {
          bubbles: true,
        });
        document.dispatchEvent(webkitEvent);
        exitingElement.dispatchEvent(webkitEvent);
      });
    }

    Object.defineProperty(document, "fullscreenEnabled", {
      get: () => true,
      configurable: true,
    });
    Object.defineProperty(document, "webkitFullscreenEnabled", {
      get: () => true,
      configurable: true,
    });

    Object.defineProperty(document, "fullscreenElement", {
      get: () => fullscreenElement,
      configurable: true,
    });
    Object.defineProperty(document, "webkitFullscreenElement", {
      get: () => fullscreenElement,
      configurable: true,
    });
    Object.defineProperty(document, "webkitCurrentFullScreenElement", {
      get: () => fullscreenElement,
      configurable: true,
    });

    Element.prototype.requestFullscreen = function () {
      return enterFullscreen(this);
    };
    Element.prototype.webkitRequestFullscreen = function () {
      return enterFullscreen(this);
    };
    Element.prototype.webkitRequestFullScreen = function () {
      return enterFullscreen(this);
    };

    document.exitFullscreen = exitFullscreen;
    document.webkitExitFullscreen = exitFullscreen;
    document.webkitCancelFullScreen = exitFullscreen;

    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape" && fullscreenElement) {
          exitFullscreen();
        }
      },
      true,
    );
  }

  initFullscreenPolyfill();
})();
