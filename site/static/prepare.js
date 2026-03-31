document.body.classList.remove("no-js");

/**
 * Helper function to handle individual image loading.
 * Thanks to https://wonky.dev/posts/64-simple-fade-effect-img/
 *
 * @param {HTMLImageElement} img
 */
function handleImage(img) {
  if (img.complete) {
    img.classList.add("has-loaded");
  } else {
    img.onload = () => {
      img.classList.add("has-loaded");
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${img.src}`);
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach(handleImage);
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.target.querySelectorAll("img")?.forEach(handleImage);
  });
});

// Start observing the entire document for added nodes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
