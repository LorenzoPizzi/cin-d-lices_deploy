document.addEventListener('DOMContentLoaded', () => {
    const showMoreBtn = document.getElementById('showMoreBtn');
    const cardsSection = document.getElementById('cards');
    const paginationSection = document.getElementById('pagination');
    const template = document.getElementById('recipe-template');
    const filterBtn = document.getElementById('filterBtn');
    const filterDropdown = document.getElementById('filterDropdown');
    const applyFilterBtn = document.getElementById('applyFilter');
    const categoryFilter = document.getElementById('category-filter');
    const movieFilterInput = document.getElementById('movie-filter');
    const movieSuggestions = document.getElementById('film-suggestions');
    const noResult = document.getElementById('noResult');
  
    const recipesPerPage = 6;
    let filteredRecipes = [];
    let currentPage = 1;
  
    function createRecipeCard(recipe) {
      const clone = template.content.cloneNode(true);
      const link = clone.querySelector('.card-link');
      const img = clone.querySelector('img');
      const filmTitle = clone.querySelector('.film-title em');
      const filmType = clone.querySelector('.film-title-type');
  
      link.href = `/recipes/${recipe.id_recipe}`;
      img.src = recipe.image_url || '/images/default-recipe.png';
      img.alt = `Photo de ${recipe.name}`;
      clone.querySelector('.recipe-title').textContent = recipe.name;
  
      if (recipe.movie) {
        filmTitle.textContent = recipe.movie.title;
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
  
    function setupPagination(recipes) {
      paginationSection.innerHTML = '';
      const pageCount = Math.ceil(recipes.length / recipesPerPage);
  
      for (let i = 0; i < pageCount; i++) {
        const button = document.createElement('button');
        button.textContent = i + 1;
  
        if (currentPage === i + 1) {
          button.classList.add('active-page');
        }
  
        button.addEventListener('click', () => {
          currentPage = i + 1;
          const start = i * recipesPerPage;
          const end = start + recipesPerPage;
          displayRecipes(recipes.slice(start, end));
          window.scrollTo({ top: 0, behavior: 'smooth' });
  
          const allButtons = paginationSection.querySelectorAll('button');
          allButtons.forEach(btn => btn.classList.remove('active-page'));
          button.classList.add('active-page');
        });
  
        paginationSection.appendChild(button);
      }
  
      paginationSection.style.display = 'flex';
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
  
      displayRecipes(filteredRecipes.slice(0, 3));
      showMoreBtn.style.display = 'block';
      paginationSection.style.display = 'none';
    }
  
    showMoreBtn.addEventListener('click', e => {
      e.preventDefault();
      currentPage = 1;
      const data = filteredRecipes.length > 0 ? filteredRecipes : allRecipes;
      displayRecipes(data.slice(0, recipesPerPage));
      showMoreBtn.style.display = 'none';
      setupPagination(data);
    });
  
    filterBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      filterDropdown.classList.toggle('active');
    });
  
    applyFilterBtn.addEventListener('click', () => {
      applyFilters();
      filterDropdown.classList.remove('active'); // Ferme le filtre après application
      movieSuggestions.innerHTML = ''; // Optionnel : nettoie les suggestions si encore visibles
    });
  
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
  
    movieFilterInput.addEventListener('input', () => {
      const query = movieFilterInput.value.trim().toLowerCase();
      movieSuggestions.innerHTML = '';
  
      if (!query) return;
  
      const suggestions = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(query)
      ).slice(0, 10);
  
      suggestions.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        li.classList.add('suggestion-item');
        li.addEventListener('click', (event) => {
          event.stopPropagation();
          movieFilterInput.value = movie.title;
          movieSuggestions.innerHTML = '';
        });
        movieSuggestions.appendChild(li);
      });
    });
  
    // Initial display of 3 recipes
    displayRecipes(allRecipes.slice(0, 3));
  });
  