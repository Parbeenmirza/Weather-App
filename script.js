const apiKey = "ef6328d657a9e4523387e9f27b789cb2";
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city");
const cityName = document.getElementById("city_name");
const temperature = document.getElementById("temperature");
const weather = document.getElementById("weather");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    fetchWeather(city);
  } else {
    alert("Please enter a city name");
  }
});

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();

    if (data.cod === 200) {
      cityName.textContent = data.name;
      temperature.textContent = `Temperature: ${data.main.temp}°C`;
      weather.textContent = `Condition: ${data.weather[0].description}`;
    } else {
      alert("City not found!");
    }
  } catch (error) {
    alert("Failed to fetch weather data. Please try again later.");
    console.error(error);
  }
}
