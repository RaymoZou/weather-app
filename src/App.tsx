import React, { useState } from "react";
import { Button, TextField, Stack, Typography, CircularProgress } from "@mui/material";

// weather data structure for a given City
type City = {
    name: string, // name of the city
    temperature: number, // in Kelvin
    humidity: number, // in 
    description: string
}

function App() {

    const [city, setCity] = useState<City | null>(null) // weather data for city
    const [query, setQuery] = useState<string>(""); // city name to be queried
    const [status, setStatus] = useState<number | null>(null); // current status of request, null is pending

    // make API call for 1-day weather forecast for city using Current Weather Data API
    async function fetchData() {
        setStatus(null);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${import.meta.env.VITE_API_KEY}`)
        setStatus(response.status);

        // 404 - not found
        if (response.status == 404) {
            console.error("City not found!")
            return;
        }

        // 200 - success
        const data = await response.json();
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
            <Stack spacing={2} sx={{ alignItems: "center" }}>
                {status ? (
                    <>
                        <Typography variant="h1">Weather App</Typography>
                        <Typography>City: {city?.name}</Typography>
                        <Typography>Temperature: {city?.temperature}</Typography>
                        <Typography>Humidity: {city?.humidity}</Typography>
                        <Typography>Description: {city?.description}</Typography>
                    </>
                ) : (
                    <CircularProgress />
                )}
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
