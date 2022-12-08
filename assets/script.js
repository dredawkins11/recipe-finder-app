var submitIngredientBtn = document.getElementById("submit-ingredient");
var searchIngredientInput = document.getElementById("search-ingredient");
var recipeResultsElement = document.getElementById("recipe-search-results");
var ingredientsList = document.getElementById("ingredients-list");
var recipeSearchBtn = document.getElementById("recipe-search-button");

// API key and id (should encrypt if possible)

var key = "a48dd9a48442bf50ea647bcc228e83ad";
var id = "1683bca1";

var allIngredients = [];
var activeIngredients = [];

// function to accumulate user's desired ingredients to be stored in an array and used to narrow down recipe results

submitIngredientBtn.addEventListener("click", function (event) {
    event.preventDefault();
    var ingredientText = searchIngredientInput.value.trim().toLowerCase();

    if (!ingredientText || allIngredients.includes(ingredientText)) {
        window.alert("Invalid ingredient!")
        return
    }

    console.log(ingredientText);

    renderIngredient(ingredientText);

    // //create ingredient buttons

    // var ingrediBtn = document.createElement("button");
    // ingrediBtn.textContent = ingredientText;
    // ingredientList.appendChild(ingrediBtn);

    // // remove buttons on click

    // ingrediBtn.addEventListener("click", function (event) {
    //     var ingr = event.target;

    //     // remove ingredients from array

    //     ingredientArr = ingredientArr.filter(function (buttonItem) {
    //         return buttonItem !== ingr.textContent;
    //     });

    //     ingr.remove();
    // });

    //push ingredients into array

    allIngredients.push(ingredientText);
    console.log(allIngredients);

    searchIngredientInput.value = "";
});

ingredientsList.addEventListener("click", function (event) {
    const ingredientText = event.target.parentElement.childNodes[1].innerText;
    if (event.target.tagName === "BUTTON") {
        event.target.parentElement.remove();
        allIngredients = allIngredients.filter((e) => e != ingredientText);
        activeIngredients = activeIngredients.filter(
            (e) => e != ingredientText
        );
    }
    if (event.target.tagName === "INPUT") {
        if (activeIngredients.includes(ingredientText)) {
            activeIngredients = activeIngredients.filter(
                (e) => e != ingredientText
            );
            console.log(activeIngredients);
            return
        }
        activeIngredients.push(ingredientText)
        console.log(activeIngredients);
    }
});

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

function storeRecipe() {
    localStorage.setItem("FaveRecipes", JSON.stringify(allIngredients));
}

// API call

function fetchRecipe() {
    storeRecipe();

    let api = `https://api.edamam.com/search?app_id=${id}&app_key=${key}&q=${allIngredients}`;
    fetch(api)
        .then(function (response) {
            let data = response.json();
            console.log(data);
            return data;
        })
        .then(function (data) {
            //for loop grabs 5 recipes to append on the page
            //can change to any other number depending on what we decide on

            for (var i = 0; i < 5; i++) {
                var newRecipe = document.createElement("div");

                //dynamically generated HTML that uses specific information from the API data, in this case the title, url and image.
                //can change which data is used/html is generated once the main page is more complete

                newRecipe.innerHTML = `<div>
            <h2>${data.hits[i].recipe.label}</h2>
            <a href="${data.hits[i].recipe.url}">
            <img src="${data.hits[i].recipe.image}" /></a>
            </div>`;
                recipeResultsElement.appendChild(newRecipe);
            }
        });
}

// Button to make API call

recipeSearchBtn.addEventListener("click", fetchRecipe);
