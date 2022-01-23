var now = moment();
var date;
var currentTemperature = document.getElementById("currentTemperature");
var weatherIcon = document.getElementById("weatherIcon");
var currentWind = document.getElementById("currentWind");
var currentHumidity = document.getElementById("currentHumidity");
var UVIndex = document.getElementById("UVIndex");
var UVcolor = "green";
var forecastdiv = document.getElementById("forecasts");
var latitude;
var longitude;
var forecast;
var body = document.getElementsByTagName("body")[0];
var searchCity = document.getElementById("searchCity");
var PastSearchesDiv = document.getElementById("pastSearches");
var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
if (searchHistory == undefined) {
  searchHistory = [];
} else {
  for (let i = searchHistory.length - 1; i > -1; i--) {
    city = searchHistory[i];
    addToPastSearches();
  }
}

var cityName = document.getElementById("cityName");
var city = JSON.parse(localStorage.getItem("city"));

if (city == undefined) {
  city = "Perth";
}
searchCity.value = city;
cityName.innerText = city;

var AddSearchHistory = false;
getCurrentWeather(city);
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
        throw new Error();
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
function getUVIndex(lat, lon) {
  // get current UV index
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
      forecast = data;
      fillforecasts();
    });
}

// fillforecasts();
function fillforecasts() {
  for (let i = 0; i < 5; i++) {
    date = moment().add(i + 1, "days");
    forecastdiv.children[i].children[0].innerText = date.format("MM/DD/YYYY");
    forecastdiv.children[i].children[1].setAttribute(
      "src",
      "http://openweathermap.org/img/w/" +
        forecast.daily[i].weather[0].icon +
        ".png"
    );

    forecastdiv.children[i].children[2].innerText =
      "Temp: " + forecast.daily[i].temp.day + "9\xB0" + "F";
    forecastdiv.children[i].children[3].innerText =
      "Wind: " + forecast.daily[i].wind_speed + " MPH";
    forecastdiv.children[i].children[4].innerText =
      "Humidity: " + forecast.daily[i].humidity + "%";
  }
}

function getWeatherForecast(city) {
  // get current weather
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=6b8908d00c6960527601cc8bcce1648d";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      currentTemperature.innerText = "Temp: " + data.main.temp + "9\xB0" + "F";
      currentWind.innerText = "Wind: " + data.wind.speed + " MPH";
      currentHumidity.innerText = "Humidity: " + data.main.humidity + "%";
      getUVIndex(data.coord.lat, data.coord.lon);
    });
}

body.addEventListener("click", Search);

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
