// ///////////////////////////////////////////////////////////
// // Edamam API key : 1b828216c3b42084c37ecec02a3f2691 -
// // Edamam API id : 8b03c5b1
// ///////////////////////////////////////////////////////////

const searchInput = document.getElementById("searchInput");
var searchOutput = document.getElementById("searchOutput");
const searchBtn = document.getElementById("searchBtn");
const apiKey = "89ddc7542051473886d77da3e9262826";
const APP_ID = "8b03c5b1";
const APP_KEY = "1b828216c3b42084c37ecec02a3f2691";

// ///////////////////////////////////////////////////////////
// Trigger click on enter

searchInput.addEventListener("keyup", function(event) {
  // 13 = "Enter" keycode
  if (event.keyCode === 13) {
    event.preventDefault();
    // Simulate 'click' on searchBtn
    searchBtn.click();
  }

  searchBtn.addEventListener("click", loadRecipe);
});

// ///////////////////////////////////////////////////////////
// Load Recipe Function

function loadRecipe() {
  searchOutput.innerHTML = "";
  let xhr = new XMLHttpRequest();

  // Open Data Connection
  xhr.open(
    "GET",
    `http://api.edamam.com/search?q=${searchInput.value}&app_id=${APP_ID}&app_key=${APP_KEY}`,
    true
  );

  // Load Data
  xhr.onload = function() {
    if (this.status == 200) {
      let data = JSON.parse(this.responseText).hits;

      // only display 4 ingredients
      let recipesArray = data.slice(0, 4);
      console.log(recipesArray);

      // inject produces into DOM
      recipesArray.forEach(recipe => {
        searchOutput.innerHTML += `
        <article class="product">
        <div class="img-container">
     
            <img
                src="${recipe.recipe.image}"
                alt="${recipe.recipe.label}"
                title="${recipe.recipe.labl}"
                class="product-img"
                width="279"
                height="186"
            />
            <h3>${recipe.recipe.label}</h3>
            <a href="${recipe.recipe.url}">View Full Recipe<a/>
        </div>
        
    </article>
        `;
      });
    }
  };

  // send data request
  xhr.send();
}
