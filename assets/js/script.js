var now = moment();
var date;
var currentTemperature = document.getElementById("currentTemperature");
var currentWind = document.getElementById("currentWind");
var currentHumidity = document.getElementById("currentHumidity");
var UVIndex = document.getElementById("UVIndex");
var UVcolor = "green";
var forecastdiv = document.getElementById("forecasts");

var cityName = document.getElementById("cityName");
var city = "Perth";
cityName.innerText = city + " " + moment().format("MM/DD/YYYY");
getCurrentWeather(city);
function getCurrentWeather(city) {
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
      currentTemperature.innerText = "Temp " + data.main.temp + "9\xB0" + "F";
      currentWind.innerText = "Wind " + data.wind.speed + " MPH";
      currentHumidity.innerText = "Humidity " + data.main.humidity + "%";
      getUVIndex(data.coord.lat, data.coord.lon);
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
    });
}

fillforecasts();
function fillforecasts() {
  for (let i = 0; i < 5; i++) {
    date = moment().add(i + 1, "days");
    forecastdiv.children[i].children[0].innerText = date.format("MM/DD/YYYY");
  }
}
