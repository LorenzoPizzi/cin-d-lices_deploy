(() => {
    const modal = document.getElementById("categoryModal");
    const closeModal = document.getElementById("closeModal");
    const categoryForm = document.getElementById("categoryForm");
    const categoryNameInput = document.getElementById("categoryName");
  
    let currentCategoryId = null;
  
    document.querySelectorAll("#categories .modify-button").forEach(button => {
      button.addEventListener("click", () => {
        currentCategoryId = button.getAttribute("data-id");
        categoryNameInput.value = button.getAttribute("data-name");
        modal.style.display = "block";
      });
    });
  
    closeModal.onclick = () => {
      modal.style.display = "none";
    };
  
    window.onclick = event => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  
    categoryForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const newName = categoryNameInput.value.trim();
      if (!newName) {
        alert("Le nom de la catégorie est obligatoire");
        return;
      }
  
      try {
        const response = await fetch(`/categories/${currentCategoryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName }),
        });
  
        if (response.ok) {
          alert("Catégorie mise à jour !");
          modal.style.display = "none";
          location.reload();
        } else {
          alert("Erreur lors de la mise à jour");
        }
      } catch (error) {
        alert("Erreur réseau");
      }
    });
  })();
  