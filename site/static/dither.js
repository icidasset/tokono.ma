/**
 * Dither effect.
 *
 * Renders a source image into a 1-bit (two-tone) canvas: the "ink" is drawn in
 * an accent color, the rest is left transparent so the page background shows
 * through. The 1-bit mask is produced with Stucki error diffusion.
 *
 * Usage:
 *
 *   <canvas
 *     data-dither-src="images/me.jpeg"
 *     data-dither-accent="--accent-contact"
 *   ></canvas>
 *
 * Attributes:
 *   data-dither-src     (required) image to dither
 *   data-dither-accent  CSS custom property holding the ink color
 *                       (default: --accent-contact)
 *   data-dither-level   white point as a luminance in 0…1; pixels at or above
 *                       it stay blank, black gets full ink (default: 0.6)
 *   data-dither-scale   renders at 1/scale resolution and lets the browser
 *                       scale it back up, giving larger, chunkier dots
 *                       (default: 1)
 */

// Wrapped in an IIFE: this file and prepare.js are classic scripts sharing the
// global scope, so top-level declarations must not leak between them.
(() => {
  const SOURCE_ATTRIBUTE = "data-dither-src";
  const ACCENT_ATTRIBUTE = "data-dither-accent";
  const LEVEL_ATTRIBUTE = "data-dither-level";
  const SCALE_ATTRIBUTE = "data-dither-scale";
  const RENDERED_ATTRIBUTE = "data-dither-rendered";

  const DEFAULT_ACCENT = "--accent-contact";
  const DEFAULT_LEVEL = 0.6;
  const DEFAULT_SCALE = 1;

  // Stucki error-diffusion kernel. [dx, dy, weight], divisor 42.
  const STUCKI = {
    divisor: 42,
    offsets: [
      [1, 0, 8],
      [2, 0, 4],
      [-2, 1, 2],
      [-1, 1, 4],
      [0, 1, 8],
      [1, 1, 4],
      [2, 1, 2],
      [-2, 2, 1],
      [-1, 2, 2],
      [0, 2, 4],
      [1, 2, 2],
      [2, 2, 1],
    ],
  };

  /** @type {Map<string, Promise<HTMLImageElement>>} */
  const imageCache = new Map();

  const colorContext = document.createElement("canvas").getContext("2d", {
    willReadFrequently: true,
  });

  /**
   * @param {string} src
   * @returns {Promise<HTMLImageElement>}
   */
  function loadImage(src) {
    if (!imageCache.has(src)) {
      imageCache.set(
        src,
        new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
          image.src = src;
        }),
      );
    }
    return imageCache.get(src);
  }

  /**
   * Resolves any CSS color (hex, rgb(), …) to its [r, g, b] channels.
   *
   * @param {string} color
   * @returns {[number, number, number]}
   */
  function parseColor(color) {
    colorContext.fillStyle = "#000";
    colorContext.fillStyle = color;
    colorContext.fillRect(0, 0, 1, 1);
    return colorContext.getImageData(0, 0, 1, 1).data.slice(0, 3);
  }

  /**
   * Stucki error diffusion. `amount` is the desired ink coverage per pixel
   * (0 = blank, 1 = solid ink) and is diffused/quantized in place.
   *
   * @param {Float32Array} amount
   * @param {number} width
   * @param {number} height
   * @returns {Uint8Array} 1 where ink should be placed
   */
  function stucki(amount, width, height) {
    const ink = new Uint8Array(width * height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const old = amount[index];
        const value = old < 0.5 ? 0 : 1;
        ink[index] = value;
        const error = old - value;

        for (const [dx, dy, weight] of STUCKI.offsets) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny < height) {
            amount[ny * width + nx] += (error * weight) / STUCKI.divisor;
          }
        }
      }
    }

    return ink;
  }

  /**
   * @param {HTMLCanvasElement} canvas
   */
  async function render(canvas) {
    const src = canvas.getAttribute(SOURCE_ATTRIBUTE);
    const accentVariable = canvas.getAttribute(ACCENT_ATTRIBUTE) || DEFAULT_ACCENT;
    const level =
      Number.parseFloat(canvas.getAttribute(LEVEL_ATTRIBUTE)) || DEFAULT_LEVEL;
    const scale = Math.max(
      1,
      Number.parseInt(canvas.getAttribute(SCALE_ATTRIBUTE)) || DEFAULT_SCALE,
    );

    if (!src || canvas.getAttribute(RENDERED_ATTRIBUTE) === src) {
      return;
    }

    const accentCss =
      getComputedStyle(canvas).getPropertyValue(accentVariable).trim() || "#000";
    const [red, green, blue] = parseColor(accentCss);

    const image = await loadImage(src);
    const width = Math.max(1, Math.round(image.naturalWidth / scale));
    const height = Math.max(1, Math.round(image.naturalHeight / scale));

    canvas.width = width;
    canvas.height = height;
    canvas.style.imageRendering = scale > 1 ? "pixelated" : "";

    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height);
    const { data } = imageData;

    const amount = new Float32Array(width * height);
    for (let i = 0, p = 0; i < amount.length; i++, p += 4) {
      const luminance =
        (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255;
      amount[i] = Math.min(1, Math.max(0, 1 - luminance / level));
    }

    const ink = stucki(amount, width, height);

    for (let i = 0, p = 0; i < ink.length; i++, p += 4) {
      if (ink[i]) {
        data[p] = red;
        data[p + 1] = green;
        data[p + 2] = blue;
        data[p + 3] = 255;
      } else {
        data[p + 3] = 0;
      }
    }

    context.putImageData(imageData, 0, 0);
    canvas.setAttribute(RENDERED_ATTRIBUTE, src);
  }

  /**
   * @param {ParentNode} [root]
   */
  function renderAll(root) {
    (root || document)
      .querySelectorAll(`canvas[${SOURCE_ATTRIBUTE}]`)
      .forEach((canvas) => {
        render(canvas).catch((error) => {
          console.error("[dither]", error);
        });
      });
  }

  function rerenderAll() {
    document.querySelectorAll(`canvas[${SOURCE_ATTRIBUTE}]`).forEach((canvas) => {
      canvas.removeAttribute(RENDERED_ATTRIBUTE);
    });
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderAll();
  });

  // The Gren app swaps the body on navigation, so watch for new canvases.
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          continue;
        }
        if (node.matches?.(`canvas[${SOURCE_ATTRIBUTE}]`)) {
          render(node).catch((error) => console.error("[dither]", error));
        }
        renderAll(node);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // The accent may resolve differently under another color scheme or contrast.
  for (const query of [
    "(prefers-color-scheme: dark)",
    "(prefers-color-scheme: light)",
    "(prefers-contrast: more)",
  ]) {
    window.matchMedia(query).addEventListener("change", rerenderAll);
  }
})();
