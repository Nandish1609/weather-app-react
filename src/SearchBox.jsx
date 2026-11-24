import { useState } from "react";
import "./SearchBox.css";

const GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = import.meta.env.VITE_API_KEY;

function formatLocalTime(timestamp, timezoneOffset) {
    return new Date((timestamp + timezoneOffset) * 1000).toLocaleTimeString(
        "en-US",
        { timeZone: "UTC", hour: "numeric", minute: "2-digit" },
    );
}

export default function SearchBox() {
    const [location, setLocation] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const searchLocation = location.trim();
        if (!searchLocation) return;

        if (!API_KEY) {
            setError("Weather API key is missing. Add VITE_API_KEY to your .env.local file.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const coordinatesUrl = new URL(GEOCODING_URL);
            coordinatesUrl.search = new URLSearchParams({
                q: searchLocation,
                limit: "1",
                appid: API_KEY,
            });
            const coordinatesResponse = await fetch(coordinatesUrl);
            const places = await coordinatesResponse.json();

            if (!coordinatesResponse.ok) {
                throw new Error(places.message || "Unable to search for that location.");
            }
            if (!places.length) {
                throw new Error("Location not found. Try another city name.");
            }

            const weatherUrl = new URL(WEATHER_URL);
            weatherUrl.search = new URLSearchParams({
                lat: places[0].lat,
                lon: places[0].lon,
                units: "metric",
                appid: API_KEY,
            });
            const weatherResponse = await fetch(weatherUrl);
            const data = await weatherResponse.json();

            if (!weatherResponse.ok) {
                throw new Error(data.message || "Unable to load the weather right now.");
            }

            setWeather({
                name: data.name,
                country: places[0].country,
                timezone: data.timezone,
                sunrise: data.sys.sunrise,
                sunset: data.sys.sunset,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                windSpeed: data.wind.speed,
                temperature: data.main.temp,
                minTemperature: data.main.temp_min,
                maxTemperature: data.main.temp_max,
                humidity: data.main.humidity,
                feelsLike: data.main.feels_like,
            });
        } catch (requestError) {
            setError(requestError.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="weather-app">
            <header className="app-header">
                <a className="brand" href="#" aria-label="Weatherly home">
                    <span className="brand-icon" aria-hidden="true">✳</span>
                    <span>weatherly</span>
                </a>
                <span className="header-note">A little closer to the elements</span>
            </header>

            <main className="dashboard">
                <section className="intro" aria-labelledby="page-title">
                    <p className="eyebrow">YOUR DAILY FORECAST</p>
                    <h1 id="page-title">Weather, <span>where you are.</span></h1>
                    <p className="intro-copy">
                        A fresh look at the skies. Search any city to see what the day has in store.
                    </p>

                    <form className="search-form" onSubmit={handleSubmit}>
                        <label className="visually-hidden" htmlFor="location">Search a city</label>
                        <input
                            className="location-input"
                            id="location"
                            type="search"
                            placeholder="Search a city, e.g. Ranebennur"
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                            required
                        />
                        <button className="search-button" type="submit" disabled={loading}>
                            {loading ? "Searching..." : "Get weather"}
                        </button>
                    </form>

                    {error && <p className="search-error" role="alert">{error}</p>}
                </section>

                {weather ? (
                    <article className="weather-card" aria-live="polite">
                        <div className="weather-card-header">
                            <div>
                                <p className="card-kicker">CURRENT WEATHER</p>
                                <h2>{weather.name}<span>, {weather.country}</span></h2>
                            </div>
                            <span className="weather-tag">Right now</span>
                        </div>

                        <div className="weather-overview">
                            <div className="temperature">
                                <span>{Math.round(weather.temperature)}</span>
                                <sup>°C</sup>
                            </div>
                            <div className="condition">
                                <img
                                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                                    alt=""
                                    width="88"
                                    height="88"
                                />
                                <p>{weather.description}</p>
                            </div>
                        </div>

                        <div className="temperature-range">
                            <span>H {Math.round(weather.maxTemperature)}°</span>
                            <span className="range-divider" />
                            <span>L {Math.round(weather.minTemperature)}°</span>
                            <span className="feels-like">Feels like {Math.round(weather.feelsLike)}°</span>
                        </div>

                        <div className="weather-details">
                            <div className="weather-detail">
                                <span className="detail-icon" aria-hidden="true">◌</span>
                                <div><span className="detail-label">Humidity</span><strong>{weather.humidity}%</strong></div>
                            </div>
                            <div className="weather-detail">
                                <span className="detail-icon" aria-hidden="true">↗</span>
                                <div><span className="detail-label">Wind</span><strong>{weather.windSpeed} m/s</strong></div>
                            </div>
                            <div className="weather-detail">
                                <span className="detail-icon" aria-hidden="true">↑</span>
                                <div><span className="detail-label">Sunrise</span><strong>{formatLocalTime(weather.sunrise, weather.timezone)}</strong></div>
                            </div>
                            <div className="weather-detail">
                                <span className="detail-icon" aria-hidden="true">↓</span>
                                <div><span className="detail-label">Sunset</span><strong>{formatLocalTime(weather.sunset, weather.timezone)}</strong></div>
                            </div>
                        </div>
                    </article>
                ) : (
                    <div className="forecast-prompt" aria-live="polite">
                        <span className="prompt-sun" aria-hidden="true">☼</span>
                        <p>Your forecast is just around the corner.</p>
                        <span>Enter a city above to get started</span>
                    </div>
                )}
            </main>

            <footer className="app-footer">
                <span>Made for wherever the day takes you.</span>
                <span>Weather data by OpenWeather</span>
            </footer>
        </div>
    );
}
