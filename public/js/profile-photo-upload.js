document.getElementById("select-file-btn").addEventListener("click", () => {
    document.getElementById("file-input").click();
  });
  
  const dragDropArea = document.getElementById("drag-drop-area");
  const fileInput = document.getElementById("file-input");
  const imagePreview = document.getElementById("image-preview");
  const uploadForm = document.getElementById("upload-form");
  
  function updateImagePreviewAndSubmit() {
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(fileInput.files[0]);
  
      // On soumet automatiquement après le chargement du fichier
      uploadForm.submit();
    }
  }
  
  fileInput.addEventListener("change", updateImagePreviewAndSubmit);
  
  dragDropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragDropArea.classList.add("dragging");
  });
  
  dragDropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dragDropArea.classList.remove("dragging");
  });
  
  dragDropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDropArea.classList.remove("dragging");
  
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      updateImagePreviewAndSubmit();
    }
  });