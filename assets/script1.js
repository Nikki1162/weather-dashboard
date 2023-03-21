// API key for OpenWeatherMap

const APIKey = "aec9049ed82d9e41abe95c26c0050c22"

// Store input value

let present = moment().format("(DD/MM/YYYY)");
let previousSearchHistory = [];

// Set a function for current location and weather conditions

function atPresent(city){

  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
    $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(presentReturn){
    console.log(presentReturn);
        
    $("#weather-result").css("display", "block");
    $("#location-item").empty();
        
    let weatherSymbol = presentReturn.weather[0].icon;
    let symbolURL = `https://openweathermap.org/img/w/${weatherSymbol}.png`;

    // Display info

    let presentLocation = $(`
      <h2 id="present-location">
        ${presentReturn.name} ${today} <img src="${iconURL}" alt="${presentReturn.weather[0].description}" /> </h2>
      <p>Temperature: ${presentReturn.main.temp} °c</p>
      <p>Humidity: ${presentReturn.main.humidity} %</p>
      <p>Wind Speed: ${presentReturn.wind.speed} mph</p>
   `);
    let lat = presentReturn.coord.lat;
    let lon = presentReturn.coord.lon;

    $("#location-item").append(presentLocation);
    inFuture(lat, lon);
  });
}

// Function for upcoming forecast

function inFuture(lat, lon){

  // For loop

  let forecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=current,minutely,hourly,alerts&appid=${APIKey}`;

  $.ajax({
    url: futureURL,
    method: "GET"
  }).then(function(futureReturn){
    console.log(futureReturn);

    $("#future-forecast").empty();
        
    for(let i = 1; i < 6; i++){
      let atPresent = {
        date: futureReturn.daily[i].dt,
        icon: futureReturn.daily[i].weather[0].icon,
        temp: futureReturn.daily[i].temp.day,
        humidity: futureReturn.daily[i].humidity
      };

      // Moment Unix tracks time passed

      let upcomingDay = moment.unix(atPresent.date).format("DD/MM/YYYY");
      let iconURL = `<img src="https://openweathermap.org/img/w/${atPresent.icon}.png" alt="${futureReturn.daily[i].weather[0].main}" />`;

      //displays info below in future card
      let forecastCard = $(`
        <div class="pl-3">
          <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem";>
            <div class="card-body">
              <h5>${upcomingDay}</h5>
              <p>${iconURL}</p>
              <p>Temp: ${atPresent.temp} °C</p>
              <p>Humidity: ${atPresent.humidity}%</p>                           
            </div>
          </div>
        </div>
      `);

      $("#forecast").append(forecastCard);
    }
  }); 
}

// Event listener upon any key press

$("#input-location").keypress(function(e){
  //keyCode 13 is the "Enter" key
  if(e.keyCode === 13){
    e.preventDefault();
    $("#search-button").click();
  }
});

// Event listener upon clicking button

$("#search-button").on("click", function(e){
  e.preventDefault();

  let place = $("#input-location").val().trim();
  
  // Clear search bar

  $("#input-location").val("");

  currentConditions(city);
  if (!previousSearchHistory.includes(city)){
    previousSearchHistory.push(city);
    let searchCity = $(`
      <li class="list-group-item">${city}</li>
      `);
    $("#search-history").prepend(searchCity);
  };

  // Use local storage to allow user to access search history
  
  localStorage.setItem("city", JSON.stringify(searchHistoryList));
  console.log(searchHistoryList);
});

// Render current weather and future forecast for searched location

$(document).on("click", ".list-group-item", function(){
  let listCity = $(this).text();
  currentConditions(listCity);
});

// Previous location or search can be accessed on page reload
$(document).ready(function(){
  let previousSearchHistory = JSON.parse(localStorage.getItem("city"));

  if (searchHistoryArr !== null) {
    let lastIndex = searchHistoryArr.length - 1;
    let lastSearch = searchHistoryArr[lastIndex];
    currentConditions(lastSearch);
    console.log(`Search history: ${lastSearch}`);
  }
});