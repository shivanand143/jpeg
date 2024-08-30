const fileInput = document.getElementById("file-input");
const qualitySlider = document.getElementById("quality-slider");
const qualityValue = document.getElementById("quality-value");
const compressBtn = document.getElementById("compress-btn");

compressBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const maxSize = 600;

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const quality = qualitySlider.value / 100;

      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "compressed.jpg";
          link.click();
          URL.revokeObjectURL(url);
        },
        "image/jpeg",
        quality
      );
    };
  };
});
