// select the input element and image preview element
const inputFile = document.getElementById('input-file');
const imagePreview = document.querySelector('.image-preview');

// select the buttons
const btnResize = document.getElementById('btn-resize');
const btnRotate = document.getElementById('btn-rotate');
const btnReset = document.getElementById('btn-reset');
const btnDownload = document.getElementById('btn-download');

// set up canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// resize function
function resize() {
  const width = Number(prompt('Enter new width:'));
  const height = Number(prompt('Enter new height:'));
  
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(imagePreview, 0, 0, width, height);
  imagePreview.src = canvas.toDataURL();
}

// rotate function
function rotate() {
  canvas.width = imagePreview.height;
  canvas.height = imagePreview.width;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(imagePreview, -imagePreview.width / 2, -imagePreview.height / 2);
  imagePreview.src = canvas.toDataURL();
}

// reset function
function reset() {
  imagePreview.src = '';
  inputFile.value = '';
}

// download function
function download() {
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('download', 'edited-image.png');
  downloadLink.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
  downloadLink.click();
}

// add event listeners to buttons
btnResize.addEventListener('click', resize);
btnRotate.addEventListener('click', rotate);
btnReset.addEventListener('click', reset);
btnDownload.addEventListener('click', download);

// display selected image
inputFile.addEventListener('change', function() {
  const file = this.files[0];
  const reader = new FileReader();

  reader.addEventListener('load', function() {
    imagePreview.src = reader.result;
  });

  reader.readAsDataURL(file);
});
