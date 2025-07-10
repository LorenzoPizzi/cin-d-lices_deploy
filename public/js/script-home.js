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
      link.href = `/recipes/${recipe.id_recipe}`;
      img.src = recipe.image_url || '/images/default-recipe.png';
      img.alt = `Photo de ${recipe.name}`;
      clone.querySelector('.recipe-title').textContent = recipe.name;
      clone.querySelector('.film-title em').textContent = recipe.movie?.title || "Aucun film associé";
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
      const totalPages = Math.ceil(recipes.length / recipesPerPage);
      paginationSection.innerHTML = '';
      paginationSection.style.display = totalPages > 1 ? 'block' : 'none';
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.addEventListener('click', () => {
          const start = (i - 1) * recipesPerPage;
          const end = start + recipesPerPage;
          displayRecipes(recipes.slice(start, end));
        });
        paginationSection.appendChild(btn);
      }
    }
  
    displayRecipes(allRecipes.slice(0, 3));
  
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
  
    applyFilterBtn.addEventListener('click', () => {
      const selectedCategoryId = categoryFilter.value;
      const selectedMovieTitle = movieFilter.value;
      let filteredRecipes = allRecipes;
  
      if (selectedCategoryId) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.categories && recipe.categories.some(cat => cat.id_category == selectedCategoryId)
        );
      }
  
      if (selectedMovieTitle) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.movie?.title === selectedMovieTitle
        );
      }
  
      displayRecipes(filteredRecipes.slice(0, recipesPerPage));
      setupPagination(filteredRecipes);
      filterDropdown.classList.remove('active');
    });
  
    document.addEventListener('click', (event) => {
      if (!filterBtn.contains(event.target) && !filterDropdown.contains(event.target)) {
        filterDropdown.classList.remove('active');
      }
    });
  });
  