document.addEventListener("DOMContentLoaded", () => {
    const selectFileBtn = document.getElementById("select-file-btn");
    const dragDropArea = document.getElementById("drag-drop-area");
    const fileInput = document.getElementById("file-input");
    const imagePreview = document.getElementById("image-preview");
  
    // Ouvre le sélecteur de fichier au clic du bouton
    selectFileBtn.addEventListener("click", () => {
      fileInput.click();
    });
  
    // Met à jour la preview d'image
    function updateImagePreview(file) {
      if (!file) {
        imagePreview.style.display = "none";
        imagePreview.src = "";
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  
    // Lorsqu'on sélectionne un fichier via input
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        updateImagePreview(fileInput.files[0]);
      } else {
        updateImagePreview(null);
      }
    });
  
    // Gestion du drag over (pour autoriser le drop)
    dragDropArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      dragDropArea.style.background = "#f2f2f2";
    });
  
    // Gestion du drag leave
    dragDropArea.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dragDropArea.style.background = "";
    });
  
    // Gestion du drop
    dragDropArea.addEventListener("drop", (e) => {
      e.preventDefault();
      dragDropArea.style.background = "";
  
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        // Crée un DataTransfer pour pouvoir assigner les fichiers à fileInput.files
        const dataTransfer = new DataTransfer();
        for (let i = 0; i < files.length; i++) {
          dataTransfer.items.add(files[i]);
        }
        fileInput.files = dataTransfer.files;
  
        updateImagePreview(fileInput.files[0]);
      }
    });
  });
  