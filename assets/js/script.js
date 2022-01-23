var now = moment();
var date;

/// next elements are all from the today weather section in top right
var currentTemperature = document.getElementById("currentTemperature");
var weatherIcon = document.getElementById("weatherIcon");
var currentWind = document.getElementById("currentWind");
var currentHumidity = document.getElementById("currentHumidity");
var UVIndex = document.getElementById("UVIndex");
var UVcolor = "green";

var forecastdiv = document.getElementById("forecasts"); //Section with the 5 future days
var latitude;
var longitude;
var forecastData; //all the forecast weather data from the open weather api

// body used to get an event listener for all the click events
var body = document.getElementsByTagName("body")[0];
var searchCity = document.getElementById("searchCity"); //the Input form
var PastSearchesDiv = document.getElementById("pastSearches");
var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
//Get  the search history from local storage
if (searchHistory == undefined) {
  searchHistory = [];
} else {
  for (let i = searchHistory.length - 1; i > -1; i--) {
    city = searchHistory[i];
    addToPastSearches();
  }
}
//Get  the last searched city from local storage otehrwise start from Perth
var cityName = document.getElementById("cityName");
var city = JSON.parse(localStorage.getItem("city"));

if (city == undefined) {
  city = "Perth";
}
searchCity.value = city;
cityName.innerText = city;

var AddSearchHistory = false; //if false, a  history button was pressed so don't add city to history, if true, search button was pressed so add to history

getCurrentWeather(city); //load last cities weather on refreshing page

function getCurrentWeather(city) {
  // get current weather
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=6b8908d00c6960527601cc8bcce1648d";

  fetch(requestUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(); //catch cities that don't exist in API
      }
    })
    .then(function (data) {
      cityName.innerText = city + " " + moment().format("MM/DD/YYYY");

      console.log(data);
      currentTemperature.innerText = "Temp: " + data.main.temp + "9\xB0" + "F";
      currentWind.innerText = "Wind: " + data.wind.speed + " MPH";
      currentHumidity.innerText = "Humidity: " + data.main.humidity + "%";
      latitude = data.coord.lat;
      longitude = data.coord.lon;
      getUVIndex(latitude, longitude);
      if (AddSearchHistory) {
        addToPastSearches();
        searchHistory.unshift(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      }
      localStorage.setItem("city", JSON.stringify(city));
    })
    .catch(function (error) {
      searchCity.value = "Couldn't find " + searchCity.value + ", try again";
      console.log(error);
    });
}
//This gets data from another API, which is used for UV data and forecast weather data
function getUVIndex(lat, lon) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&exclude={part}&appid=6b8908d00c6960527601cc8bcce1648d";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      UVIndex.innerText = data.current.uvi;
      if (data.current.uvi > 6) {
        UVcolor = "red";
      } else if (data.current.uvi > 3) {
        UVcolor = "orange";
      } else {
        UVcolor = "green";
      }
      UVIndex.setAttribute("style", "background-color:" + UVcolor + ";");
      weatherIcon.setAttribute(
        "src",
        "http://openweathermap.org/img/w/" +
          data.current.weather[0].icon +
          ".png"
      );
      forecastData = data;
      fillforecasts();
    });
}

//sort the data from the api call and put it on the page in forecast section
function fillforecasts() {
  for (let i = 0; i < 5; i++) {
    date = moment().add(i + 1, "days");
    forecastdiv.children[i].children[0].innerText = date.format("MM/DD/YYYY");
    forecastdiv.children[i].children[1].setAttribute(
      "src",
      "http://openweathermap.org/img/w/" +
        forecastData.daily[i].weather[0].icon +
        ".png"
    );

    forecastdiv.children[i].children[2].innerText =
      "Temp: " + forecastData.daily[i].temp.day + "9\xB0" + "F";
    forecastdiv.children[i].children[3].innerText =
      "Wind: " + forecastData.daily[i].wind_speed + " MPH";
    forecastdiv.children[i].children[4].innerText =
      "Humidity: " + forecastData.daily[i].humidity + "%";
  }
}

body.addEventListener("click", Search);

//this is activated from the search button or history button
function Search(event) {
  const isButton = event.target.nodeName === "BUTTON";
  if (event.target.innerText === "Search") {
    city = searchCity.value;
    AddSearchHistory = true;
    getCurrentWeather(city);
  } else if (isButton) {
    AddSearchHistory = false;
    getCurrentWeather(event.target.innerText);
  }
}

//This function decides weather a search is added to the history. won't let user add same city twice in a row.
function addToPastSearches() {
  var SearchHistoryButton = document.createElement("button");
  SearchHistoryButton.innerText = city;
  SearchHistoryButton.setAttribute("class", "btn btn-secondary col-md-12");
  if (
    PastSearchesDiv.hasChildNodes &&
    PastSearchesDiv.children[0] !== undefined
  ) {
    if (city !== PastSearchesDiv.children[0].innerText) {
      PastSearchesDiv.insertBefore(
        SearchHistoryButton,
        PastSearchesDiv.children[0]
      );
    }
  } else {
    PastSearchesDiv.appendChild(SearchHistoryButton);
  }
  localStorage.setItem("PastSearchesDiv", JSON.stringify(PastSearchesDiv));
}
