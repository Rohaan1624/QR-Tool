(function () {
  "use strict";

  var form = document.getElementById("qr-form");
  var input = document.getElementById("url-input");
  var inputWrap = input.closest(".input-wrap");
  var errorEl = document.getElementById("input-error");
  var emptyState = document.getElementById("preview-empty");
  var resultState = document.getElementById("preview-result");
  var canvas = document.getElementById("qr-canvas");
  var caption = document.getElementById("preview-caption");
  var downloadBtn = document.getElementById("download-btn");

  var EXPORT_SIZE = 1024; // downloaded PNG dimensions
  var QUIET_MODULES = 4;  // standard QR quiet zone, in modules

  var currentUrl = null;

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    inputWrap.classList.remove("is-invalid");
    // restart the shake animation if the class was already applied
    void inputWrap.offsetWidth;
    inputWrap.classList.add("is-invalid");
  }

  function clearError() {
    errorEl.hidden = true;
    inputWrap.classList.remove("is-invalid");
  }

  // Returns a normalized URL string, or null if the input isn't a valid URL.
  function normalizeUrl(raw) {
    var value = raw.trim();
    if (!value) return null;
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) {
      value = "https://" + value;
    }
    var parsed;
    try {
      parsed = new URL(value);
    } catch (e) {
      return null;
    }
    // require a plausible host for web schemes ("https://foo" alone is rejected)
    if (/^https?:$/.test(parsed.protocol) && !parsed.hostname.includes(".")) {
      return null;
    }
    return parsed.href;
  }

  function drawQr(text) {
    var qr = qrcode(0, "M"); // type 0 = auto-size, error correction M
    qr.addData(text);
    qr.make();

    var count = qr.getModuleCount();
    var totalModules = count + QUIET_MODULES * 2;
    var moduleSize = Math.floor(EXPORT_SIZE / totalModules);
    var size = moduleSize * totalModules;

    canvas.width = size;
    canvas.height = size;

    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#16192b";

    for (var row = 0; row < count; row++) {
      for (var col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(
            (col + QUIET_MODULES) * moduleSize,
            (row + QUIET_MODULES) * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }
  }

  function fileNameFor(url) {
    var host;
    try {
      host = new URL(url).hostname;
    } catch (e) {
      host = "";
    }
    var slug = host.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return "qr-" + (slug || "code") + ".png";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var url = normalizeUrl(input.value);
    if (!url) {
      showError(
        input.value.trim()
          ? "That doesn't look like a valid URL. Try something like https://example.com"
          : "Please enter a URL first."
      );
      return;
    }

    clearError();

    try {
      drawQr(url);
    } catch (e) {
      // qrcode-generator throws when the data exceeds QR capacity
      showError("That URL is too long to fit in a QR code.");
      return;
    }

    currentUrl = url;
    input.value = url;

    // retrigger the fade-in on regeneration
    resultState.hidden = true;
    void resultState.offsetWidth;
    emptyState.hidden = true;
    emptyState.style.display = "none";
    resultState.hidden = false;

    caption.textContent = url;
    caption.title = url;
    caption.hidden = false;
    downloadBtn.hidden = false;
  });

  input.addEventListener("input", clearError);

  downloadBtn.addEventListener("click", function () {
    if (!currentUrl) return;
    var link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = fileNameFor(currentUrl);
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
})();
