document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  const resultsContainer = document.getElementById("search-results");

  let timeoutId;

  input.addEventListener("input", () => {
    const query = input.value.trim();

    clearTimeout(timeoutId);

    if (query.length < 2) {
      resultsContainer.innerHTML = "";
      return;
    }

    timeoutId = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data) => {
          resultsContainer.innerHTML = "";
          if (data.results && data.results.length > 0) {
            data.results.forEach((recipe) => {
              const div = document.createElement("div");
              div.textContent = recipe.name;
              div.addEventListener("click", () => {
                window.location.href = `/recipes/${recipe.id}`;
              });
              resultsContainer.appendChild(div);
            });
          } else {
            resultsContainer.innerHTML = "<div>Aucun résultat</div>";
          }
        })
        .catch((err) => {
          console.error("Erreur recherche :", err);
          resultsContainer.innerHTML = "<div>Erreur de recherche</div>";
        });
    }, 300); // délai debounce 300ms
  });

  // Clic en dehors => cache la liste
  document.addEventListener("click", (e) => {
    if (!resultsContainer.contains(e.target) && e.target !== input) {
      resultsContainer.innerHTML = "";
    }
  });
});

