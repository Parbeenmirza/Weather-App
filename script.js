if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((error) =>
      console.error("Service Worker Registration Failed:", error)
    );
}
const apiKey = "ef6328d657a9e4523387e9f27b789cb2";
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const cityInput = document.getElementById("city");
const unitSelector = document.getElementById("unit-selector");

const currentWeatherSection = document.getElementById("current-weather");
const hourlyForecastGrid = document.getElementById("hourly-grid");
const dailyForecastGrid = document.getElementById("daily-grid");
const aqiSection = document.getElementById("aqi-data");

let units = "metric"; // Default to Celsius

unitSelector.addEventListener("change", (e) => {
  units = e.target.value;
});

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  updateCurrentWeather(data);
  fetchAdditionalData(data.coord.lat, data.coord.lon);
}

async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  updateCurrentWeather(data);
  fetchAdditionalData(lat, lon);
}

function updateCurrentWeather(data) {
  const { name, main, weather, wind, sys } = data;
  document.getElementById("current-city").textContent = name;
  document.getElementById("current-temp").textContent = `Temperature: ${main.temp}°`;
  document.getElementById("current-condition").textContent = `Condition: ${weather[0].description}`;
  document.getElementById("current-humidity").textContent = `Humidity: ${main.humidity}%`;
  document.getElementById("current-wind").textContent = `Wind Speed: ${wind.speed} m/s`;
  document.getElementById("sunrise").textContent = `Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}`;
  document.getElementById("sunset").textContent = `Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}`;
  document.getElementById("current-icon").src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
}

async function fetchAdditionalData(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  const response = await fetch(forecastUrl);
  const data = await response.json();
  updateForecast(data);
  updateAQI(lat, lon);
}

function updateForecast(data) {
  // Hourly Forecast
  hourlyForecastGrid.innerHTML = "";
  data.hourly.slice(0, 12).forEach((hour) => {
    const box = document.createElement("div");
    box.className = "forecast-box";
    box.innerHTML = `
      <p>${new Date(hour.dt * 1000).getHours()}:00</p>
      <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" alt="Icon" />
      <p>${hour.temp}°</p>`;
    hourlyForecastGrid.appendChild(box);
  });

  // Daily Forecast
  dailyForecastGrid.innerHTML = "";
  data.daily.slice(0, 7).forEach((day) => {
    const box = document.createElement("div");
    box.className = "forecast-box";
    box.innerHTML = `
      <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Icon" />
      <p>H: ${day.temp.max}° L: ${day.temp.min}°</p>`;
    dailyForecastGrid.appendChild(box);
  });
}

async function updateAQI(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  const aqi = data.list[0].main.aqi;
  const aqiText = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
  aqiSection.innerHTML = `<p>AQI: ${aqi} (${aqiText[aqi - 1]})</p>`;
}


