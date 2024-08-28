// Step 1: Get references to HTML elements
const uploadImage = document.getElementById('uploadImage');
const imagePreview = document.getElementById('imagePreview');
const qualityRange = document.getElementById('qualityRange');
const compressBtn = document.getElementById('compressBtn');
const downloadLink = document.getElementById('downloadLink');

// Step 2: Handle the image file upload
uploadImage.addEventListener('change', function () {
    const file = uploadImage.files[0]; // Get the selected file

    if (file) {
        const reader = new FileReader(); // Create a FileReader to read the file

        // When the file is fully read
        reader.onload = function (e) {
            const img = new Image(); // Create a new image element
            img.src = e.target.result; // Set the image source to the file's data

            // When the image is loaded, show a preview
            img.onload = function () {
                imagePreview.innerHTML = ''; // Clear any previous image
                imagePreview.appendChild(img); // Show the image preview
            };
        };

        reader.readAsDataURL(file); // Read the file as a Data URL
    }
});

// Step 3: Compress the image and prepare it for download
compressBtn.addEventListener('click', function () {
    const img = imagePreview.querySelector('img'); // Get the image from the preview
    const quality = qualityRange.value / 100; // Get the compression quality from the slider

    if (img) {
        const canvas = document.createElement('canvas'); // Create a canvas to draw the image
        const ctx = canvas.getContext('2d');

        canvas.width = img.width; // Set canvas size to match the image
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0); // Draw the image onto the canvas

        // Convert the canvas to a Blob with the specified quality
        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob); // Create a URL for the Blob
            downloadLink.href = url; // Set the download link's href to the Blob URL
            downloadLink.style.display = 'inline'; // Show the download link
        }, 'image/jpeg', quality);
    } else {
        alert("Please upload an image first!"); // Alert if no image is uploaded
    }
});

// Polyfill for older browsers that don't support toBlob
if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
            var binStr = atob(this.toDataURL(type, quality).split(',')[1]);
            var len = binStr.length;
            var arr = new Uint8Array(len);

            for (var i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob([arr], { type: type || 'image/png' }));
        }
    });
}
