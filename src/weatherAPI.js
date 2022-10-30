async function getCurrentWeather(location) {
    try {
        const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&cnt=7&appid=af89899d870ab5f02a09bfa241e01353`);
        const JSONdata = await data.json();
        console.log(JSONdata);
        return getDayWeather(JSONdata.weather[0].description,
            JSONdata.name,
            toCelcius(JSONdata.main.temp),
            toCelcius(JSONdata.main.feels_like),
            JSONdata.weather[0].icon);
    } catch (error) {
        console.log(error);
    }
}

// returns array of 5 weather objects
async function getWeeklyForecast(location) {
    try {
        const cityCoords = await getCoords(location);
        const weatherDays = [];
        const data = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityCoords[0].lat}&lon=${cityCoords[0].lon}&cnt=7&appid=af89899d870ab5f02a09bfa241e01353`);
        const JSONdata = await data.json();
        // console.log(JSONdata);
        for (let i = 0; i < 7; i++) {
            const weatherDay = getDayWeather(JSONdata.list[i].weather[0].description,
                JSONdata.city.name,
                toCelcius(JSONdata.list[i].main.temp),
                toCelcius(JSONdata.list[i].main.feels_like),
                JSONdata.list[i].weather[0].icon);
            weatherDays.push({weatherDay});
        }
        return weatherDays;
    } catch (error) {
        console.log(error);
    }
}

async function getCoords(location) {
    const coords = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=af89899d870ab5f02a09bfa241e01353`);
    const parsedCoords = await coords.json();
    return parsedCoords;
}

function getDayWeather(desc, name, temp_main, temp_feel, icon_code) {
    return {
        desc: desc,
        name: name,
        temp_main: temp_main,
        temp_feel: temp_feel,
        icon_code: icon_code
    }
}

getWeeklyForecast('burnaby');

// convert temperature from kelvin to celcius
function toCelcius(temp) {
    return Math.round(temp - 273.15);
}

export {
    getCurrentWeather,
    getWeeklyForecast,
}
