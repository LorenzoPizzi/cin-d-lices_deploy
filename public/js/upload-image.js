// Ouvre le sélecteur de fichier si clic bouton
document
    .getElementById("select-file-btn")
    .addEventListener("click", function () {
        document.getElementById("file-input").click();
    });

// Drag & drop
const dragDropArea = document.getElementById("drag-drop-area");
const fileInput = document.getElementById("file-input");

dragDropArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    dragDropArea.style.background = "#f2f2f2";
});
dragDropArea.addEventListener("dragleave", function (e) {
    e.preventDefault();
    dragDropArea.style.background = "";
});
dragDropArea.addEventListener("drop", function (e) {
    e.preventDefault();
    dragDropArea.style.background = "";
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
    }
});

const imagePreview = document.getElementById("image-preview");

fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "";
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
});
