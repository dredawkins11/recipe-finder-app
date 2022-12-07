var btn = document.getElementById("#btn");
var recipeSearch = document.getElementById("#search");
var result = document.getElementById("#recipe-search-results");
var ingredientList = document.getElementById("#ingredient-list");
var submitBtn = document.getElementById("#recipe-search-button")

// API key and id (should encrypt if possible)

var key = "a48dd9a48442bf50ea647bcc228e83ad";
var id = "1683bca1";

var ingredientArr = [];





// function to accumulate user's desired ingredients to be stored in an array and used to narrow down recipe results

btn.addEventListener("click", function(event) {
    event.preventDefault();
    var ingredient = recipeSearch.value;
    console.log(ingredient);

    //create ingredient buttons

    // CHANGE TO CHECKBOXES

    var ingredientLi = document.createElement("li");
    ingredientLi.textContent = ingredient;
    ingredientList.appendChild(ingredientLi);
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    ingredientLi.appendChild(checkBox);


    // remove buttons on click

    // TO BE REMOVED

    // ingrediBtn.addEventListener("click", function(event) {
    //     var ingr = event.target;

    //     // remove ingredients from array

    //     ingredientArr = ingredientArr.filter(function (buttonItem) {

    //         return buttonItem !== ingr.textContent;
    //     });

    //     ingr.remove();
        
    // });
    
    //push ingredients into array

    ingredientArr.push(ingredient);
    console.log(ingredientArr);
    
    recipeSearch.value = "";

});

function storeRecipe() {
    localStorage.setItem('FaveRecipes', JSON.stringify(ingredientArr));
};



// API call

function fetchRecipe(){   

    storeRecipe();

    let api = `https://api.edamam.com/search?app_id=${id}&app_key=${key}&q=${ingredientArr}`;
    fetch(api)
    .then(function(response){
        let data = response.json();
        console.log(data);
        return data;
    })
    .then(function(data) {

        //for loop grabs 5 recipes to append on the page
        //can change to any other number depending on what we decide on

        for (var i = 0; i < 5; i++) {

            var newRecipe = document.createElement('div');

            //dynamically generated HTML that uses specific information from the API data, in this case the title, url and image.
            //can change which data is used/html is generated once the main page is more complete

            newRecipe.innerHTML  = 
            `<div>
            <h2>${data.hits[i].recipe.label}</h2>
            <a href="${data.hits[i].recipe.url}">
            <img src="${data.hits[i].recipe.image}" /></a>
            </div>`;
            result.appendChild(newRecipe);
        };
    });
};


// Button to make API call

submitBtn.addEventListener("click", fetchRecipe);