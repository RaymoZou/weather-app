import * as weatherAPI from "./weatherAPI.js";
import { add, format } from 'date-fns';

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
    var day = new Date();
    console.log(day);
    header.textContent = weatherData[0].weatherDay.name;
    for (let i=0; i<weatherData.length; i++) {
        const weatherDay = weatherData[i].weatherDay;
        createCard(weatherDay.temp_main, weatherDay.desc, weatherDay.icon_code, format(day, 'ccc'));
        day = add(day, {days: 1});
    }
}

function createCard(temperature, description, iconCode, dayofWeek) {
    const weatherCard = document.createElement('div');
    const temp = document.createElement('div');
    const desc = document.createElement('div');
    const icon = document.createElement('img');
    const date = document.createElement('div');
    weatherCard.classList.add('weather-card')
    temp.classList.add('card-temp');
    desc.classList.add('card-desc');
    icon.classList.add('card-icon');
    date.classList.add('card-date');
    temp.textContent = `${temperature}°C`;
    desc.textContent = description;
    icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    date.textContent = dayofWeek;
    weatherCard.append(date);
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