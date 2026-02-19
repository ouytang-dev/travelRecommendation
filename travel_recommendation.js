const btnSearch = document.getElementById("btnSearch");
const btnReset = document.getElementById("btnReset");

function searchLocation() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = ""; // Clear the results before displaying new search results

  // Display all city level results for found input, eg. if user searches for "paris", we want to show all cities that match "paris" in the data structure, even if they are nested under different categories (e.g. "Europe", "Romantic Destinations", etc.)

  console.log("Searching for:", input);

  // NOTE: we want to display all bottom levels that match the search term, so we need
  // to loop through all levels of the data structure
  fetch("travel_recommendation_api.json")
    .then((response) => response.json())
    .then((data) => {

      // Check if input matches variation of top level key for beach or temple
      // If it does then display all cities of that category
      let beachVariations = ["beach", "beaches", "coast", "coastal"];
      let templeVariations = ["temple", "temples", "shrine", "shrines"];
      let foundCities = [];
      if (beachVariations.includes(input)) {
        console.log(`keyword matches beach category...`);
        foundCities.push(...data.beaches);
      }
      if (templeVariations.includes(input)) {
        console.log(`keyword matches temple category...`);
        foundCities.push(...data.temples);
      }
      // if not temple or beach then search country section       
      for (const key in data) {
        if (Array.isArray(data[key])) {
          console.log(`Searching ${key}...`);

          // First make sure there is not lower level, if there is, we want to search in that
          // level instead of the top level

          if (data[key].some((item) => item.cities)) {
            data[key].forEach((item) => {
              if (item.cities && Array.isArray(item.cities)) {
                console.log(`Searching ${item.name}...`);
                const matches = item.cities.filter((city) =>
                  city.name.toLowerCase().includes(input)
                );
                foundCities.push(...matches);
              }})
          } else { // if there is no lower level, we want to search in the top level 
            const matches = data[key].filter((city) =>
              city.name.toLowerCase().includes(input)
            )
            foundCities.push(...matches);
          }
        }
      }
      if (foundCities.length > 0) {
        // Display all found cities
        let resultsHTML = "";
        foundCities.forEach((city) => {
          resultsHTML += `
            <div style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.1);">
              <h3>${city.name}</h3>
              <img src="${city.imageUrl}" alt="${city.name}" style="width:100%; max-width:500px; border-radius:8px; margin: 10px 0;">
              <p><strong>Description:</strong> ${city.description}</p>
            </div>
          `;
        });
        resultDiv.innerHTML = resultsHTML;
      } else {
        resultDiv.innerHTML =
          "<p>Destination not found. Please try another destination.</p>";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      resultDiv.innerHTML = "<p>An error occurred while fetching data.</p>";
    });
}

btnSearch.addEventListener("click", searchLocation);

function resetSearch() {
  document.getElementById("searchInput").value = "";
  document.getElementById("results").innerHTML = "";
}   

btnReset.addEventListener("click", resetSearch);