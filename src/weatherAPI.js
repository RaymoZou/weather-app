// returns array of 5 weather objects
async function getWeeklyForecast(location) {
    try {
        const cityCoords = await getCoords(location);
        const weatherDays = [];
        const cityName = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${cityCoords[0].lat}&lon=${cityCoords[0].lon}&limit=1&appid=af89899d870ab5f02a09bfa241e01353`)
                                .then(data => data.json()).then(data => data[0].name)
        const data = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityCoords[0].lat}&lon=${cityCoords[0].lon}&cnt=7&appid=af89899d870ab5f02a09bfa241e01353`);
        const JSONdata = await data.json();
        console.log(JSONdata.daily[0].weather[0].description);
        console.log(cityName);
        for (let i = 0; i < 7; i++) {

            const desc = JSONdata.daily[i].weather[0].description;
            const temp = toCelcius(JSONdata.daily[i].temp.day);
            const icon = JSONdata.daily[i].weather[0].icon;

            const weatherDay = getDayWeather(desc, cityName, temp, icon);
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

function getDayWeather(desc, name, temp_main, icon_code) {
    return {
        desc: desc,
        name: name,
        temp_main: temp_main,
        icon_code: icon_code
    }
}

getWeeklyForecast('burnaby');

// convert temperature from kelvin to celcius
function toCelcius(temp) {
    return Math.round(temp - 273.15);
}

export {
    getWeeklyForecast,
}
