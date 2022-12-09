var submitIngredientBtn = document.getElementById("submit-ingredient");
var searchIngredientInput = document.getElementById("search-ingredient");
var recipeResultsElement = document.getElementById("recipe-search-results");
var ingredientsList = document.getElementById("ingredients-list");
var recipeSearchBtn = document.getElementById("recipe-search-button");

// API keys and ids (should encrypt if possible)
var SEARCH_API_KEY = "a48dd9a48442bf50ea647bcc228e83ad";
var SEARCH_API_ID = "1683bca1";
var NUTRITION_API_ID = "e55f6963";
var NUTRITION_API_KEY = "0f03456fb540fbd931fac4ac808d49ba";

// Store list of all ingredients and one of only the active, checked ingredients
var allIngredients = [];
var activeIngredients = [];

// Array containing data about the currently displayed recipes
var displayedRecipes = [];

// Get locally stored ingredients and add the to allIngredients, if present
const storedIngredients = JSON.parse(localStorage.getItem("ingredients"));
console.log(storedIngredients);
if (storedIngredients) {
    allIngredients = [...storedIngredients];
    allIngredients.forEach((ingredient) => {
        renderIngredient(ingredient);
    });
}

// Handles adding a new ingredient to users list, and updating DOM
submitIngredientBtn.addEventListener("click", function (event) {
    event.preventDefault();

    // Trim user input and check for validity
    var ingredientText = searchIngredientInput.value.trim().toLowerCase();
    if (!ingredientText || allIngredients.includes(ingredientText)) {
        window.alert("Invalid ingredient!");
        return;
    }

    renderIngredient(ingredientText);

    // Push ingredients into array and save them to local storage
    allIngredients.push(ingredientText);
    storeIngredients();
    console.log(allIngredients);

    searchIngredientInput.value = "";
});

// Handles click events on ingredient items for removing and toggling
ingredientsList.addEventListener("click", function (event) {
    const ingredientText = event.target.parentElement.childNodes[1].innerText;

    // Case for handling clicking of the 'remove' button
    if (event.target.tagName === "BUTTON") {
        event.target.parentElement.remove();
        allIngredients = allIngredients.filter((e) => e != ingredientText);
        activeIngredients = activeIngredients.filter(
            (e) => e != ingredientText
        );
        storeIngredients();
    }

    // Case for handling clicking of the checkbox
    if (event.target.tagName === "INPUT") {
        if (activeIngredients.includes(ingredientText)) {
            activeIngredients = activeIngredients.filter(
                (e) => e != ingredientText
            );
            console.log(activeIngredients);
            return;
        }
        activeIngredients.push(ingredientText);
        console.log(activeIngredients);
    }
});

recipeResultsElement.addEventListener("click", async function (event) {
    if (!event.target.classList.contains("nutrition-details"))
        return event.stopPropagation();
    const resultIndex = Array.from(recipeResultsElement.children).indexOf(
        event.target.parentElement.parentElement
    );
    console.log(resultIndex);
    const data = await fetchNutrition(resultIndex);
});

// Creates and appends an ingredient item to ingredient list
function renderIngredient(text) {
    const checkboxElement = document.createElement("input");
    const ingredientLabel = document.createElement("label");
    const removeBtn = document.createElement("button");

    checkboxElement.setAttribute("type", "checkbox");
    ingredientLabel.innerText = text;
    removeBtn.innerText = "Remove";

    const ingredientContainer = document.createElement("div");
    ingredientContainer.classList.add("ingredient");

    ingredientContainer.appendChild(checkboxElement);
    ingredientContainer.appendChild(ingredientLabel);
    ingredientContainer.appendChild(removeBtn);

    ingredientsList.appendChild(ingredientContainer);
}

// Stores a recipe in local storage
function storeRecipe(recipe) {
    const currentFavorites = JSON.parse(localStorage.getItem("faveRecipes"));
    currentFavorites.push(recipe);
    localStorage.setItem("FaveRecipes", JSON.stringify(currentFavorites));
}

// Stores ingredients in local storage
function storeIngredients() {
    localStorage.setItem("ingredients", JSON.stringify(allIngredients));
}

// API call to search for recipes that include only active ingredients
function fetchRecipe() {
    // Verify there are ingredients selected
    if (activeIngredients.length == 0)
        return window.alert("Select some ingredients to search with first!");

    // Call the Edamam API with the query set to the active ingredients
    let api = `https://api.edamam.com/search?app_id=${SEARCH_API_ID}&app_key=${SEARCH_API_KEY}&q=${activeIngredients}`;
    fetch(api)
    .then(function(response){
        let data = response.json();
        console.log(data);
        return data;
    }).then(function(data) {
        // Set the recipes currently loaded
        displayedRecipes = data.hits;
        renderRecipes(data);
    })

}

// Dynamically generated HTML that uses specific information from the API data, in this case the title, url and image.
// can change which data is used/html is generated once the main page is more complete
function renderRecipes(data) {
    // Removes all previous search results
    while (recipeResultsElement.firstChild) {
        recipeResultsElement.removeChild(recipeResultsElement.firstChild);
    }

    // Iterates through search results and generates elements
    for (var i = 0; i < 5; i++) {
        const recipe = data.hits[i].recipe;

        var newRecipe = document.createElement("div");
        var detailsSection = document.createElement("section");
        var nutritionDetails = document.createElement("div");
        var title = document.createElement("h2");
        var link = document.createElement("a");
        var image = document.createElement("img");

        title.innerText = recipe.label;
        nutritionDetails.innerText = "Show Nutrition Details";
        image.setAttribute("src", recipe.image);
        link.setAttribute("href", recipe.url);
        link.appendChild(image);

        detailsSection.appendChild(title);
        detailsSection.appendChild(nutritionDetails);
        nutritionDetails.classList.add("nutrition-details");

        newRecipe.appendChild(link);
        newRecipe.appendChild(detailsSection);
        newRecipe.classList.add("recipe-search-result");

        recipeResultsElement.appendChild(newRecipe);
    }
}


async function fetchNutrition(recipeIndex) {
    const recipe = displayedRecipes[recipeIndex].recipe
    console.log(recipe);
    const res = await fetch(
        `https://api.edamam.com/api/nutrition-details?app_id=${NUTRITION_API_ID}&app_key=${NUTRITION_API_KEY}`,
        {
            body: JSON.stringify({
                title: recipe.label,
                ingr: recipe.ingredientLines,
                url: recipe.url,
                summary: recipe.label,
                yield: recipe.yield.toString(),
                time: recipe.totalTime.toString(),
                img: recipe.image,
                prep: "string"
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST"
        }
    );
    const data = await res.json()
    console.log(data);
}

function renderNutrition(data) {

}

// Button to make API call
recipeSearchBtn.addEventListener("click", fetchRecipe);