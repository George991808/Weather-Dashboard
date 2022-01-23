getCurrentWeather();
var currentTemperature = document.getElementById("currentTemperature");
var currentWind = document.getElementById("currentWind");
var currentHumidity = document.getElementById("currentHumidity");
var UVIndex = document.getElementById("UVIndex");

function getCurrentWeather() {
  // get current weather
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=Perth&appid=6b8908d00c6960527601cc8bcce1648d";

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
  // get current weather
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
      UVIndex.innerText = "UV Index " + data.current.uvi;
    });
}
