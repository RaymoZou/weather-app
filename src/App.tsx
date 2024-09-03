import { useState } from "react"

// weather data structure for a given City
type City = {
    name: string, // name of the city
    temperature: number, // in Kelvin
    humidity: number, // in 
    description: string
}

// placeholder for weather data
// const Vancouver: City = {
//     name: "Vancouver",
//     temperature: 12,
//     humidity: 13,
//     description: "always raining..."
// }

function App() {

    const [city, setCity] = useState<City | null>(null)
    const [query, setQuery] = useState<string>("");

    // make API call for 1-day weather forecast for city using Current Weather Data API
    async function fetchData() {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${import.meta.env.VITE_API_KEY}`)

        if (!response.ok) {
            // TODO: handle error
            return
        }

        var data = await response.json();
        setCity({
            name: data.name,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            description: data.weather[0].description
        })
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value);
    }

    return (
        <>
            <h1>name: {city?.name}</h1>
            <p>temp: {city?.temperature}</p>
            <p>humidity: {city?.humidity}</p>
            <p>desc: {city?.description}</p>
            <input
                onChange={handleChange}
                placeholder="City Name"
            />
            <button
                onClick={fetchData}
                className="btn btn-primary">
                Get Weather
            </button>
        </>
    )
}

export default App
