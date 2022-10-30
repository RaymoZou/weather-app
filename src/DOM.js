import * as weatherAPI from "./weatherAPI.js";

const form = document.getElementById("submit-form");
const locationInput = document.querySelector('#submit-form input');
const cardContainer = document.querySelector('.card-container')
const header = document.getElementById("header");

form.onsubmit = function(event) {
    event.preventDefault();
    renderWeather();
}

async function renderWeather() {
    clearCards();
    const weatherData = await weatherAPI.getWeeklyForecast(locationInput.value);
    console.log({weatherData});
    header.textContent = weatherData[0].weatherDay.name;
    for (let i=0; i<weatherData.length; i++) {
        const weatherDay = weatherData[i].weatherDay;
        createCard(weatherDay.temp_main, weatherDay.desc, weatherDay.icon_code);
    }
}

function createCard(temperature, description, iconCode) {
    const weatherCard = document.createElement('div');
    const temp = document.createElement('div');
    const desc = document.createElement('div');
    const icon = document.createElement('img');
    weatherCard.classList.add('weather-card')
    temp.classList.add('card-temp');
    desc.classList.add('card-desc');
    icon.classList.add('card-icon');
    temp.textContent = `${temperature}°C`;
    desc.textContent = description;
    icon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherCard.append(icon);
    weatherCard.append(temp);
    weatherCard.append(desc);
    cardContainer.append(weatherCard);
}

function clearCards() {
    while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.lastChild);
    }
}