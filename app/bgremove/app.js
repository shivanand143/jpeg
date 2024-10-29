const originalCanvas = document.getElementById("originalCanvas");
const outputCanvas = document.getElementById("outputCanvas");
const ctxOriginal = originalCanvas.getContext("2d");
const ctxOutput = outputCanvas.getContext("2d");

const upload = document.getElementById("upload");
const removeBgBtn = document.getElementById("removeBgBtn");
const downloadBtn = document.getElementById("downloadBtn");
const loader = document.getElementById("loader");
const dropArea = document.getElementById("drop-area");
const messageWidget = document.getElementById("messageWidget");

let uploadedImage;
let captchaVerified = false;

// Initialize MediaPipe Selfie Segmentation
const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
});
selfieSegmentation.setOptions({ modelSelection: 1 });
selfieSegmentation.onResults(onResults);

// reCAPTCHA callback function to set verified status
function onCaptchaSuccess() {
  captchaVerified = true;
  processBackgroundRemoval(); // Automatically call the function to process background removal
}

// Handle Remove button click
function handleRemove() {
  if (!captchaVerified) {
    messageWidget.textContent = "Please complete the reCAPTCHA to proceed.";
    messageWidget.classList.remove("d-none");
    grecaptcha.execute();  // Programmatically trigger reCAPTCHA if not verified
  } else {
    processBackgroundRemoval(); // If verified, directly process the removal
  }
}

function processBackgroundRemoval() {
  if (!uploadedImage) {
    alert("Please upload an image first.");
    return;
  }
  loader.classList.remove("d-none");
  selfieSegmentation.send({ image: uploadedImage });
}

function onResults(results) {
  if (results.segmentationMask) {
    const { width, height } = uploadedImage;

    outputCanvas.width = width;
    outputCanvas.height = height;

    ctxOutput.clearRect(0, 0, width, height);
    ctxOutput.drawImage(results.segmentationMask, 0, 0, width, height);

    ctxOutput.globalCompositeOperation = "source-in";
    ctxOutput.drawImage(uploadedImage, 0, 0, width, height);

    ctxOutput.globalCompositeOperation = "source-over";
  }
  loader.classList.add("d-none");
  downloadBtn.classList.remove("d-none");
}

function loadImageToCanvas(file) {
  uploadedImage = new Image();
  uploadedImage.src = URL.createObjectURL(file);
  uploadedImage.onload = () => {
    const { width, height } = uploadedImage;

    originalCanvas.width = width;
    originalCanvas.height = height;

    ctxOriginal.drawImage(uploadedImage, 0, 0, width, height);
  };
}

upload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) loadImageToCanvas(file);
});

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("active");
});

dropArea.addEventListener("dragleave", () => dropArea.classList.remove("active"));

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dropArea.classList.remove("active");
  const file = event.dataTransfer.files[0];
  if (file) loadImageToCanvas(file);
});

// Ensure the Remove button triggers a message if reCAPTCHA is not completed
removeBgBtn.addEventListener("click", handleRemove);

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = outputCanvas.toDataURL("image/png");
  link.download = "background-removed.png";
  link.click();
});
