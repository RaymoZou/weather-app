import * as weatherAPI from "./weatherAPI.js";

const form = document.getElementById("submit-form");
const header = document.getElementById("header");
const locationInput = document.querySelector('#submit-form input');

form.onsubmit = function(event) {
    event.preventDefault();
    printWeather();
    renderWeather();
}

async function printWeather() {
    const weatherData = await weatherAPI.getWeather(locationInput.value);
    console.log(weatherData);
}

async function renderWeather() {
    const weatherData = await weatherAPI.getWeather(locationInput.value);
    header.textContent = weatherData.name;
}