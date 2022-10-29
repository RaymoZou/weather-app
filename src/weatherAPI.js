async function getWeather(location) {
    try {
        const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=af89899d870ab5f02a09bfa241e01353`);
        const JSONdata = await data.json();
        return {
            name: JSONdata.name,
            weather: JSONdata.weather,
            temp_main: JSONdata.main.temp,
            temp_feel: JSONdata.main.feels_like
        }
    } catch(error) {
        console.log(error);
    }
}

export {
    getWeather,
}
