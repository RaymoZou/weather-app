import React, { useState } from "react";
import { Button, TextField, Stack, Typography, CircularProgress, Alert } from "@mui/material";

// weather data structure for a given City
type City = {
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
    // populate city on success and
    // TODO: cache result in localStorage
    async function fetchData() {
        setResponse(null);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${import.meta.env.VITE_API_KEY}`)
        setResponse(response);

        // 200 - success
        if (response.status == 200) {
            const data = await response.json();
            setCity({
                name: data.name,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                description: data.weather[0].description
            })
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value);
    }

    // renders weather data if request was successful
    // renders a loading animation if request is pending
    // renders an error text message if request failed
    function renderWeather(): JSX.Element {
        // pending request
        if (!response) {
            return <CircularProgress />
        }

        // successful request
        if (response.ok) {
            return (
                <>
                    <Typography variant="h1">Weather App</Typography>
                    <Typography>City: {city?.name}</Typography>
                    <Typography>Temperature: {city?.temperature}</Typography>
                    <Typography>Humidity: {city?.humidity}</Typography>
                    <Typography>Description: {city?.description}</Typography>
                </>
            )
        }

        if (response.status == 404) {
            return <Alert variant="outlined" severity="error">City not found!</Alert>
        }

        // catch all other errors
        return <Typography>Oops! There was an error...</Typography>
    }

    return (
        <>
            <Stack spacing={2} sx={{ alignItems: "center" }}>
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
            </Stack>
        </>
    )
}

export default App