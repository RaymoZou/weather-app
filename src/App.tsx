import React, { useState } from "react";
import { Button, TextField, Stack, Typography, CircularProgress, Alert, AlertTitle } from "@mui/material";
import DayWeather from "./WeatherData";

interface DayWeather {
    temperature: number, // temperature in Farenheight
    humidity: number, // expressed as a percentage
    description: string // short description of weather
    icon: string // icon weather code
}

interface ForecastData {
    expiration: number, // expiration time of 1 hour from when request was made
    name: string, // name of the city
    forecast: DayWeather[]; // 5 day forecast
}

function App() {

    const [forecast, setForecast] = useState<ForecastData | null>(null) // current forecast
    const [query, setQuery] = useState<string>(""); // city name to be queried
    const [response, setResponse] = useState<Response | null>(null); // current status of request

    // populate forecast state through localStorage or API call
    async function fetchData() {
        // localStorage request
        setForecast(null);
        const data = localStorage.getItem(query);
        if (data) {
            const parsedForecast: ForecastData = JSON.parse(data);

            if (new Date().getTime() < parsedForecast.expiration) {
                setForecast(parsedForecast);
                return
            }
        }

        // API request
        setResponse(null);
        const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${import.meta.env.VITE_API_KEY}&cnt=5&units=imperial`)
        setResponse(response);

        // 200 - success
        if (response.ok) {
            const data = await response.json();
            const forecast: DayWeather[] = [];
            data.list.forEach((weather: any) => {
                forecast.push({
                    temperature: weather.main.temp,
                    humidity: weather.main.humidity,
                    description: weather.weather[0].description,
                    icon: weather.weather[0].icon
                })
            })
            const newForecast: ForecastData = {
                expiration: new Date().getTime() + 60 * 60 * 1000, // 1 hour expiration
                name: data.city.name,
                forecast: forecast
            }
            setForecast(newForecast)
            cacheForecast(query, JSON.stringify(newForecast)) // cache data in local storage
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value.toLowerCase());
    }

    // caches weather data in string format for a city in brower's localStorage
    function cacheForecast(key: string, data: string) {
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
        if (forecast) {
            return (
                <>
                    <Typography variant="h2">{forecast.name}</Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        {forecast.forecast.map((item, key) => (
                            <DayWeather
                                key={key}
                                props={item}
                            />
                        ))}
                    </Stack>
                </>
            )
        }

        // pending
        if (!response) {
            if (!forecast) {
                return <Typography variant="h3">Enter a city</Typography>;
            } else {
                return <CircularProgress />
            }
        }

        // invalid city query
        if (response.status == 404) {
            return (
                <Alert variant="outlined" severity="error">
                    <AlertTitle>Error</AlertTitle>
                    City not found!
                </Alert>
            )
        }

        // catch all other errors
        return (
            <Alert variant="outlined" severity="error">
                <AlertTitle>Error</AlertTitle>
                {response.statusText}
            </Alert>
        )

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
