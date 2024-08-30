document.addEventListener("DOMContentLoaded", function () {
    const textInput = document.getElementById("text-input");
    const generateButton = document.getElementById("generate-button");
    const qrcodeDiv = document.getElementById("qrcode");
    const downloadLink = document.getElementById("download-link");

    generateButton.addEventListener("click", () => {
        const text = textInput.value;

        if (text.trim() === "") {
            alert("Please enter text or URL.");
            return;
        }

        // Generate the QR code and add it to the qrcodeDiv
        const qrcode = new QRCode(qrcodeDiv, {
            text: text,
            width: 128,
            height: 128,
        });

        // Convert the QR code to a data URL (JPEG)
        const canvas = qrcodeDiv.querySelector("canvas");
        const qrcodeDataUrl = canvas.toDataURL("image/jpeg");

        // Update the download link with the data URL and make it visible
        downloadLink.href = qrcodeDataUrl;
        downloadLink.style.display = "block";
    });
});
