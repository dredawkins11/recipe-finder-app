const SEARCH_BASE_URL = "https://api.edamam.com/api/recipes/v2?type=public";
const SEARCH_API_ID = "a7c5aeb9";
const SEARCH_API_KEY = "0270871e31eb12647cef4bfcd5eeeebe";

const NUTRITION_BASE_URL = "https://api.edamam.com/api/nutrition-data";
const NUTRITION_API_ID = "e55f6963";
const NUTRITION_API_KEY = "0f03456fb540fbd931fac4ac808d49ba";

const resultsContainer = document.getElementById("recipe-search-results");
const recipeSearchBarElement = document.getElementById("recipe-search-input");
const recipeSearchButtonElement = document.getElementById(
    "recipe-search-button"
);
recipeSearchButtonElement.addEventListener("click", handleSearchRecipes);

async function handleSearchRecipes() {
    const searchQuery = recipeSearchBarElement.value;
    recipeSearchBarElement.value = "";
    const res = await fetch(
        `${SEARCH_BASE_URL}&q=${searchQuery}&app_id=${SEARCH_API_ID}&app_key=${SEARCH_API_KEY}`
    );
    const data = await res.json();

    while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild);
        console.log("removed");
    }

    data.hits.forEach((hit) => {
        renderRecipe(hit.recipe);
    });
}

function renderRecipe(recipe) {
    const container = document.createElement("div");
    const thumbnail = document.createElement("img");
    const title = document.createElement("h3");
    const nutrients = document.createElement("div");

    thumbnail.setAttribute("src", recipe.images.REGULAR.url);
    thumbnail.setAttribute("alt", recipe.label);

    title.textContent = recipe.label;

    container.appendChild(thumbnail);
    container.appendChild(title);
    container.appendChild(nutrients);
    container.classList.add("recipe-item");

    resultsContainer.appendChild(container);

    console.log(container);
}
