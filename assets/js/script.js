var now = moment();
var date;
var currentTemperature = document.getElementById("currentTemperature");
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
var cityName = document.getElementById("cityName");
var city = "Perth";

getCurrentWeather(city);
function getCurrentWeather(city) {
  // get current weather
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=6b8908d00c6960527601cc8bcce1648d";

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
    })
    .catch(function (error) {
      searchCity.value = "Couldn't find " + searchCity.value + ", try again";
    });
}
function getUVIndex(lat, lon) {
  // get current UV index
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude={part}&appid=6b8908d00c6960527601cc8bcce1648d";

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
      forecast = data;
      fillforecasts();
    });
}

// fillforecasts();
function fillforecasts() {
  for (let i = 0; i < 5; i++) {
    date = moment().add(i + 1, "days");
    forecastdiv.children[i].children[0].innerText = date.format("MM/DD/YYYY");
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
  if (event.target.innerText === "Search") {
    city = searchCity.value;
    getCurrentWeather(city);
  }
}
