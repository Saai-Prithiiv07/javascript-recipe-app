(function () {
  // -------------------------
  // DATA
  // -------------------------
  const recipes = [
    {
      id: 1,
      title: "Pastta",
      ingredients: ["pasta", "tomato", "cheese"]
    },
    {
      id: 2,
      title: "Salad",
      ingredients: ["lettuce", "tomato", "cucumber"]
    },
    {
      id: 3,
      title: "Sandwich",
      ingredients: ["bread", "cheese", "butter"]
    }
  ];

  // -------------------------
  // STATE
  // -------------------------
  let searchQuery = "";
  let showFavoritesOnly = false;
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let debounceTimer = null;

  // -------------------------
  // ELEMENTS
  // -------------------------
  const recipeContainer = document.getElementById("recipeContainer");
  const searchInput = document.getElementById("searchInput");
  const favoritesCheckbox = document.getElementById("favoritesOnly");
  const recipeCounter = document.getElementById("recipeCounter");

  // -------------------------
  // EVENT LISTENERS
  // -------------------------
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = e.target.value.toLowerCase();
      applyFilters();
    }, 300);
  });

  favoritesCheckbox.addEventListener("change", (e) => {
    showFavoritesOnly = e.target.checked;
    applyFilters();
  });

  // -------------------------
  // FUNCTIONS
  // -------------------------
  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter(favId => favId !== id);
    } else {
      favorites.push(id);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    applyFilters();
  }

  function applyFilters() {
    let filteredRecipes = [...recipes];

    // Search filter
    if (searchQuery) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery) ||
        recipe.ingredients.some(ing =>
          ing.toLowerCase().includes(searchQuery)
        )
      );
    }

    // Favorites-only filter
    if (showFavoritesOnly) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        favorites.includes(recipe.id)
      );
    }

    renderRecipes(filteredRecipes);
    updateRecipeCounter(filteredRecipes.length, recipes.length);
  }

  function renderRecipes(recipesToRender) {
    recipeContainer.innerHTML = "";

    recipesToRender.forEach(recipe => {
      const card = document.createElement("div");
      card.className = "recipe-card";

      card.innerHTML = `
        <h3>${recipe.title}</h3>
        <p>Ingredients: ${recipe.ingredients.join(", ")}</p>
        <button class="favorite-btn">
          ${favorites.includes(recipe.id) ? "❤️" : "🤍"}
        </button>
      `;

      card.querySelector(".favorite-btn").addEventListener("click", () => {
        toggleFavorite(recipe.id);
      });

      recipeContainer.appendChild(card);
    });
  }

  function updateRecipeCounter(shown, total) {
    recipeCounter.textContent = `Showing ${shown} of ${total} recipes`;
  }

  // -------------------------
  // INIT
  // -------------------------
  applyFilters();

})();

