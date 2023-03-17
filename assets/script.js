// API key for OpenWeatherMap

const APIKey = "aec9049ed82d9e41abe95c26c0050c22"

// Store input value
let today = moment().format("(DD/MM/YY)");
let previousSearchHistory = [];

// Set a function for current location and weather
function atPresent(city){

    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
  
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(presentReturn){
      console.log(presentReturn);
          
      $("#weather-result").css("display", "block");
      $("#location-item").empty(); //remove all child nodes of the set of matched elements from the DOM
          
      let weatherSymbol = presentReturn.weather[0].icon;
      let symbolURL = `https://openweathermap.org/img/w/${weatherSymbol}.png`;

// Display info
let presentLocation = $(`
<h4 id="present-location">
    ${presentReturn.name} ${today} //image here// </h4>
    <div>Temp: ${presentReturn.main.temp} °c</div>
    <div>Wind: ${presentReturn.wind.speed} mph</div>
    `);

    let lat = presentReturn.coord.lat;
    let lon = presentReturn.coord.lon;

    $("#location-item").append(presentLocation);
    inFuture(lat, lon);
    });
}

// Function for upcoming forecast
function inFuture(lat, lon);

// For loop
let forecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=current,minutely,hourly,alerts&appid=${APIKey}`;

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(futureReturn){
  console.log(futureReturn);

  $("#forecast").empty();

  for(let i = 1; i < 3; i++){
    let atPresent = {
      date: futureReturn.daily[i].dt,
        icon: futureReturn.daily[i].weather[0].icon,
        temp: futureReturn.daily[i].temp.day,
        wind: futureReturn.daily[i].wind
    }
  };

// Display info again

// Add event listener

// User local storage to allow user to access search history

// Current weather and future forecast for searched location

// Previous location or search can be accessed on page reload

