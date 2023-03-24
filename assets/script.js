// API Key for OpenWeatherMap

const APIKey = "d89aeb407c99b041045acf5eb4090fe5";

// Create variables to store inputs

let present = moment().format("(DD/MM/YYYY)");
let previousSearchHistory = [];

// Set a function for current location and weather conditions

function atPresent(city){

  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(presentReturn){
    console.log("first API call", presentReturn);
        
    $("#weather-result").css("display", "block");
    $("#location-item").empty()
        
    let weatherSymbol = presentReturn.weather[0].icon;
    let symbolURL = `https://openweathermap.org/img/w/${weatherSymbol}.png`;

    // Display info pulled from API

    let presentLocation = $(`
      <h3 id="present-location">
        ${presentReturn.name} ${present} <img src="${symbolURL}" alt="${presentReturn.weather[0].description}" /> </h3>
      <p>Temp: ${presentReturn.main.temp} °c</p>
      <p>Humidity: ${presentReturn.main.humidity} %</p>
      <p>Wind speeds: ${presentReturn.wind.speed} KmPH</p>
   `);
    let lat = presentReturn.coord.lat;
    let lon = presentReturn.coord.lon;

    console.log("coords", lat, lon);

    $("#location-item").append(presentLocation);
    inFuture(lat, lon);
  });
}

// Function for upcoming forecast

function inFuture(lat, lon){

  // Five day forecast and for loop
  //TODO look into why this won't render onto page

  let futureURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=current,minutely,hourly,alerts&appid=${APIKey}`;

  // let futureURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

  $.ajax({
    url: futureURL,
    method: "GET"
  }).then(function(futureReturn){
    console.log("future API call", futureReturn);

    $("#five-day-forecast").empty();
        
    for(let i = 1; i < 6; i++){
      let locationItem = {
        date: futureReturn.daily[i].dt,
        icon: futureReturn.daily[i].weather[0].icon,
        temp: futureReturn.daily[i].temp.day,
        humidity: futureReturn.daily[i].humidity
      };

      // Moment Unix tracks time passed

      let upcomingDate = moment.unix(locationItem.date).format("dd/mm/yyyy");
      let symbolURL = `<img src="https://openweathermap.org/img/w/${locationItem.icon}.png" alt="${futureReturn.daily[i].weather[0].main}" />`;

      // Displays upcoming forecast in a card

      let forecastCard = $(`
        <div class="pl-3">
          <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 10rem";>
            <div class="card-body">
              <h4>${upcomingDate}</h4>
              <p>${symbolURL}</p>
              <p>Temp: ${locationItem.temp} °c</p>
              <p>Humidity: ${locationItem.humidity} %</p>                           
            </div>
          </div>
        </div>
      `);
      $("#five-day-forecast").append(forecastCard);
    }
  }); 
}

// Event listener upon enter key press

$("#input-location").keypress(function(e){
  if(e.keyCode === 13){
    e.preventDefault();
    $("#search-button").click();
  }
});

// Event listener upon click button

$("#search-button").on("click", function(e){
  e.preventDefault();

  let city = $("#input-location").val().trim();
  console.log("city", city);

  // Clear field

  $("#input-location").val("");

  atPresent(city);
  if (!previousSearchHistory.includes(city)){
    previousSearchHistory.push(city);
    let searchCity = $(`
      <li class="list-group-item">${city}</li>
      `);
    $("#search-history").prepend(searchCity);
  };
  
  localStorage.setItem("city", JSON.stringify(previousSearchHistory));
  console.log(previousSearchHistory);
});

// Presented with current and future conditions for new entry city

$(document).on("click", ".list-group-item", function(){
  let listCity = $(this).text();
  atPresent(listCity);
});

// Displays search history

$(document).ready(function(){
  let searchHistoryArr = JSON.parse(localStorage.getItem("city"));

  if (searchHistoryArr !== null) {
    let previousIndex = searchHistoryArr.length - 1;
    let previousCity = searchHistoryArr[previousIndex];
    atPresent(previousCity);
    console.log(`Previous searched city: ${previousCity}`);
  }
});