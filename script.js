document.addEventListener("DOMContentLoaded", function () {
    const cityInput = document.querySelector(".city-input");
    const searchButton = document.querySelector(".search-btn");
    const locationButton = document.querySelector(".location-btn");
    const currentWeatherDiv = document.querySelector(".current-weather");
    const weatherCardsDiv = document.querySelector(".weather-cards");
    const weatherDataDiv = document.querySelector(".weather-data"); 

    const API_KEY = "d07378c9d60749f5b51155148242909"; 

    
    weatherDataDiv.style.display = "none";

    const createWeatherCard = (cityName, weatherItem, index) => {
        if (index === 0) { 
            return `<div class="details">
                        <h2>${cityName} (${weatherItem.date})</h2>
                        <h6>Temperature: ${weatherItem.day.avgtemp_c}°C</h6>
                        <h6>Wind: ${weatherItem.day.maxwind_kph} KPH</h6>
                        <h6>Humidity: ${weatherItem.day.avghumidity}%</h6>
                    </div>
                    <div class="icon">
                        <img src="https:${weatherItem.day.condition.icon}" alt="weather-icon">
                        <h6>${weatherItem.day.condition.text}</h6>
                    </div>`;
        } else { 
            return `<li class="card">
                        <h3>(${weatherItem.date})</h3>
                        <img src="https:${weatherItem.day.condition.icon}" alt="weather-icon">
                        <h6>Temp: ${weatherItem.day.avgtemp_c}°C</h6>
                        <h6>Wind: ${weatherItem.day.maxwind_kph} KPH</h6>
                        <h6>Humidity: ${weatherItem.day.avghumidity}%</h6>
                    </li>`;
        }
    }

    const getWeatherDetails = (cityName, latitude, longitude) => {
        const WEATHER_API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=5`;

        fetch(WEATHER_API_URL)
            .then(response => response.json())
            .then(data => {
                const fiveDaysForecast = data.forecast.forecastday;

                
                cityInput.value = "";
                currentWeatherDiv.innerHTML = "";
                weatherCardsDiv.innerHTML = "";

                
                fiveDaysForecast.forEach((weatherItem, index) => {
                    const html = createWeatherCard(cityName, weatherItem, index);
                    if (index === 0) {
                        currentWeatherDiv.insertAdjacentHTML("beforeend", html);
                    } else {
                        weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                    }
                });

                
                weatherDataDiv.style.display = "block";
            })
            .catch(() => {
                alert("An error occurred while fetching the weather forecast!");
            });
    }

    const getCityCoordinates = () => {
        const cityName = cityInput.value.trim();
        if (cityName === "") return;
        const API_URL = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${cityName}`;
        
        
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (!data.length) return alert(`No coordinates found for ${cityName}`);
                const { lat, lon, name } = data[0];
                getWeatherDetails(name, lat, lon);
            })
            .catch(() => {
                alert("An error occurred while fetching the coordinates!");
            });
    }

    const getUserCoordinates = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                   
                    getWeatherDetails("Your Location", latitude, longitude);
                },
                error => {
                    if (error.code === error.PERMISSION_DENIED) {
                        alert("Geolocation request denied. Please enable location access.");
                    } else {
                        alert("An error occurred while fetching your location.");
                    }
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }

    locationButton.addEventListener("click", getUserCoordinates);
    searchButton.addEventListener("click", getCityCoordinates);
    cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
});
