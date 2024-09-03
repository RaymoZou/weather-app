import React, { useState } from "react";
import { Button, TextField, Stack, Typography, CircularProgress, Alert } from "@mui/material";

// weather data structure for a given City
type City = {
    expiration: number, // expiration time of 1 hour from when request was made
    name: string, // name of the city
    temperature: number, // in Kelvin
    humidity: number,
    description: string
}

function App() {

    const [city, setCity] = useState<City | null>(null) // weather data for city
    const [query, setQuery] = useState<string>(""); // city name to be queried
    const [response, setResponse] = useState<Response | null>(null); // current status of request

    // make API call for 1-day weather forecast for city using Current Weather Data API
    // populate city on success and cache result in localStorage
    async function fetchData() {
        // attempt localStorage retrieval
        setCity(null);
        const data = localStorage.getItem(query);
        if (data) {
            const parsedCity: City = JSON.parse(data);

            if (new Date().getTime() < parsedCity.expiration) {
                setCity(parsedCity);
                return
            }
        }

        // api request if localStorage retrieval fails
        setResponse(null);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${import.meta.env.VITE_API_KEY}`)
        setResponse(response);

        // 200 - success
        if (response.status == 200) {
            const data = await response.json();
            const city: City = {
                expiration: new Date().getTime() + 60 * 60 * 1000, // 1 hour expiration
                name: data.name,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                description: data.weather[0].description
            }
            setCity(city)
            // cache data in local storage
            cacheCity(query, JSON.stringify(city))
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value.toLowerCase());
    }

    // caches weather data in string format for a city in brower's localStorage
    function cacheCity(key: string, data: string) {
        localStorage.setItem(key, data);
    }

    // clears the browser localStorage
    function clearCache() {
        localStorage.clear();
    }

    // renders weather data if request was successful
    // renders a loading animation if request is pending
    // renders an error text message if request failed
    function renderWeather(): JSX.Element {

        // success (either through localStorage or API request)
        if (city) {
            return (
                <>
                    <Typography>City: {city?.name}</Typography>
                    <Typography>Temperature: {city?.temperature}</Typography>
                    <Typography>Humidity: {city?.humidity}</Typography>
                    <Typography>Description: {city?.description}</Typography>
                </>
            )
        }

        // pending
        if (!response) {
            return <CircularProgress />
        }

        // invalid city query
        if (response.status == 404) {
            return <Alert variant="outlined" severity="error">City not found!</Alert>
        }

        // catch all other errors
        return <Typography>Oops! There was an error...</Typography>
    }

    return (
        <>
            <Stack spacing={2} sx={{ alignItems: "center" }}>
                <Typography variant="h1">Weather App</Typography>
                {renderWeather()}
                <TextField
                    variant="outlined"
                    onChange={handleChange}
                    placeholder="City Name"
                />
                <Button
                    variant="contained"
                    onClick={fetchData}
                    className="btn btn-primary">
                    Get Weather
                </Button>
                <Button
                    variant="outlined"
                    onClick={clearCache}
                    className="btn btn-primary">
                    Clear Cache
                </Button>
            </Stack>
        </>
    )
}

export default App