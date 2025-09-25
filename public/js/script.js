const filmInput = document.getElementById("recipe-film"); // Champ de saisie du film
const suggestions = document.getElementById("film-suggestions"); // Conteneur des suggestions affichées
const hiddenId = document.getElementById("tmdbMovieId"); // Champ caché pour stocker l'ID du film/série sélectionné
const hiddenType = document.getElementById("tmdbType"); // Champ caché pour stocker le type (film ou série)

let debounceTimeout; // Variable pour gérer le délai de debounce

// Écoute les saisies dans le champ filmInput
filmInput.addEventListener("input", () => {
    const query = filmInput.value.trim(); // Récupère et nettoie la chaîne saisie
    clearTimeout(debounceTimeout); // Annule la requête précédente en attente

    // Si la recherche contient moins de 2 caractères, vide les suggestions et arrête
    if (query.length < 2) {
        suggestions.innerHTML = "";
        suggestions.style.border = "none"; // Cache la liste des suggestions
        return;
    }

    // Attends 300ms après la dernière frappe avant d'envoyer la requête (debounce)
    debounceTimeout = setTimeout(async () => {
        try {
            // Envoie la requête à l'API backend avec la recherche encodée
            const res = await fetch(
                `/api/search?q=${encodeURIComponent(query)}`
            );
            if (!res.ok) throw new Error("Erreur réseau"); // Gère les erreurs réseau

            const data = await res.json(); // Transforme la réponse en JSON

            // Si résultats trouvés, crée la liste HTML des suggestions, sinon message "Aucun résultat"
            suggestions.innerHTML = data.results.length
                ? data.results
                      .map(
                          (item) => `
    <li 
      data-id="${item.id}" 
      data-type="${item.type}"
      style="cursor:pointer; padding:5px; list-style:none;"
    >
      ${item.title} (${item.type})
    </li>`
                      )
                      .join("")
                : '<li style="list-style:none; padding:5px;">Aucun résultat</li>';

            // ✅ Bordure visible si contenu, sinon cachée
            suggestions.style.border = data.results.length
                ? "1px solid #ccc"
                : "none";
        } catch (err) {
            // En cas d'erreur, affiche un message d'erreur dans la console et dans la liste
            console.error("Recherche API error:", err);
            suggestions.innerHTML =
                '<li style="list-style:none; padding:5px; color:red;">Erreur de recherche</li>';
        }
    }, 600);
});

// Écoute le clic sur une suggestion dans la liste
suggestions.addEventListener("click", (e) => {
    if (e.target.tagName === "LI" && e.target.dataset.id) {
        filmInput.value = e.target.textContent.replace(/\s\(.+?\)$/, "");
        hiddenId.value = e.target.dataset.id;
        hiddenType.value = e.target.dataset.type;

        suggestions.innerHTML = "";
        suggestions.style.border = "none"; // ✅ Cache la bordure après sélection
    }
});

// Si clic en dehors du champ de recherche et des suggestions, vide la liste
document.addEventListener("click", (e) => {
    const isClickInside =
        filmInput.contains(e.target) || suggestions.contains(e.target);

    if (!isClickInside) {
        suggestions.innerHTML = "";
        suggestions.style.border = "none"; // 👉 Bordure disparaît même si champ non vide
    }
});



