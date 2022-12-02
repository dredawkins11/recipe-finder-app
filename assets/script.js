var btn = document.getElementById("#btn");
var recipeSearch = document.getElementById("#search");
var result = document.getElementById("#result-div");


var key = "a48dd9a48442bf50ea647bcc228e83ad";
var id = "1683bca1";



btn.addEventListener("click", function(event) {
    event.preventDefault();
    var ingredient = recipeSearch.value;
    console.log(ingredient);
    
    fetchRecipe(ingredient);
})


function fetchRecipe(ingredient){   
    // let api = `https://api.edamam.com/api/recipes/v2app_id=${id}&app_key=${key}&ingr=${ingredient}`;
    let api = `https://api.edamam.com/search?app_id=${id}&app_key=${key}&q=${ingredient}`;
    fetch(api)
    .then(function(response){
        let data = response.json();
        console.log(data);
        return data;
    })
    .then(function(data) {

        for (var i = 0; i < 5; i++) {

            var newRecipe = document.createElement('div');

            newRecipe.innerHTML  = 
            `<div>
            <h2>${data.hits[i].recipe.label}</h2>
            <a href="${data.hits[i].recipe.url}"><img src="${data.hits[1].recipe.image}" /></a>
            <img src="${data.hits[i].recipe.image}"/>
            </div>`;
            result.appendChild(newRecipe);
        };
    })
};