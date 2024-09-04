import { Typography, Card, CardContent, CardMedia } from "@mui/material";

export default function DayWeather({ props }: any): JSX.Element {
    return (
        <Card
            variant="outlined"
        >
            <CardContent>
                <Typography variant="h3" align="center">{props.temperature}°F</Typography>
                <Typography align="center">Humidiity: {props.humidity}%</Typography>
                <CardMedia component="img" image={`https://openweathermap.org/img/wn/${props.icon}@2x.png`}/>
                <Typography align="center">{props.description}</Typography>
        </CardContent>
        </Card >
    )
}
