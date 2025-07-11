document.addEventListener('DOMContentLoaded', () => {

    const showMoreBtn = document.getElementById('showMoreBtn');
    const cardsSection = document.getElementById('cards');
    const paginationSection = document.getElementById('pagination');
    const template = document.getElementById('recipe-template');
    const filterBtn = document.getElementById('filterBtn');
    const filterDropdown = document.getElementById('filterDropdown');
    const applyFilterBtn = document.getElementById('applyFilter');
    const categoryFilter = document.getElementById('category-filter');
    const movieFilter = document.getElementById('movie-filter');
    const noResult = document.getElementById('noResult');
    
    // Ici, il faut que tu initialises cette variable dans ta page EJS avant d'inclure ce script externe
    // Par exemple : <script>const allRecipes = <%- JSON.stringify(recipes) %>;</script>
    // Dans ce fichier, on suppose que allRecipes est déjà défini globalement
    const recipesPerPage = 6;
  
    function createRecipeCard(recipe) {
      const clone = template.content.cloneNode(true);
      const link = clone.querySelector('.card-link');
      const img = clone.querySelector('img');
      const filmTitle = clone.querySelector('.film-title em');
      const filmType = clone.querySelector('.film-title-type'); // ta classe
    
      link.href = `/recipes/${recipe.id_recipe}`;
      img.src = recipe.image_url || '/images/default-recipe.png';
      img.alt = `Photo de ${recipe.name}`;
      clone.querySelector('.recipe-title').textContent = recipe.name;
    
      if (recipe.movie) {
        filmTitle.textContent = recipe.movie.title;
    
        // Vérifie si le titre contient déjà le type (insensible à la casse)
        const typeInTitle = recipe.movie.title.toLowerCase().includes(recipe.movie.type.toLowerCase());
    
        filmType.textContent = typeInTitle ? '' : ` (${recipe.movie.type})`;
      } else {
        filmTitle.textContent = "Aucun film associé";
        filmType.textContent = "";
      }
    
      return clone;
    }
    
    
 
    function displayRecipes(recipes) {
      cardsSection.innerHTML = '';
      if (recipes.length === 0) {
        noResult.style.display = 'block';
      } else {
        noResult.style.display = 'none';
        recipes.forEach(recipe => {
          cardsSection.appendChild(createRecipeCard(recipe));
        });
      }

    }
  }

  function applyFilters() {
    const selectedCategoryId = categoryFilter.value;
    const selectedMovieTitle = movieFilterInput.value.trim().toLowerCase();

    filteredRecipes = [...allRecipes];

    if (selectedCategoryId) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.categories?.some(cat => cat.id_category == selectedCategoryId)
      );
    }

    if (selectedMovieTitle) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.movie?.title?.toLowerCase().includes(selectedMovieTitle)
      );
    }

    displayRecipes(filteredRecipes.slice(0, recipesPerPage));
    setupPagination(filteredRecipes);
    filterDropdown.classList.remove('active');
  }

  showMoreBtn.addEventListener('click', e => {
    e.preventDefault();
    displayRecipes(allRecipes.slice(0, recipesPerPage));
    showMoreBtn.style.display = 'none';
    setupPagination(allRecipes);
  });

  filterBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    filterDropdown.classList.toggle('active');
  });

  applyFilterBtn.addEventListener('click', applyFilters);

  // On ferme le filtre seulement si on clique en dehors du bouton, du filtre, de l'input ou des suggestions
  document.addEventListener('click', (event) => {
    const clickedInsideDropdown = filterDropdown.contains(event.target);
    const clickedOnFilterBtn = filterBtn.contains(event.target);
    const clickedOnSuggestions = movieSuggestions.contains(event.target);
    const clickedOnMovieInput = movieFilterInput.contains(event.target);

    if (!clickedInsideDropdown && !clickedOnFilterBtn && !clickedOnSuggestions && !clickedOnMovieInput) {
      filterDropdown.classList.remove('active');
      movieSuggestions.innerHTML = '';
    }
  });

  // ------------------------------------
  // 🎬 Autocomplétion film (locale, sans fetch)
  // ------------------------------------
  movieFilterInput.addEventListener('input', () => {
    const query = movieFilterInput.value.trim().toLowerCase();
    movieSuggestions.innerHTML = '';

    if (!query) return;

    const suggestions = allMovies.filter(movie =>
      movie.title.toLowerCase().includes(query)
    ).slice(0, 10); // max 10 suggestions

    suggestions.forEach(movie => {
      const li = document.createElement('li');
      li.textContent = movie.title;
      li.classList.add('suggestion-item');
      li.addEventListener('click', (event) => {
        event.stopPropagation(); // empêche la fermeture du menu
        movieFilterInput.value = movie.title;
        movieSuggestions.innerHTML = '';
      });
      movieSuggestions.appendChild(li);
    });
  });

  displayRecipes(allRecipes.slice(0, 3));
});
