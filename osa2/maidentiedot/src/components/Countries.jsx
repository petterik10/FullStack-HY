import { useEffect, useState } from "react";
import weatherService from "../services/weather";

const Countries = ({ countries, showCountry }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (countries.length === 1) {
      const capital = countries[0].capital[0];
      
      weatherService
        .getWeather(capital)
        .then((weatherData) => {
          setWeather(weatherData);
        })
    } else {
      setWeather(null);
    }
  }, [countries]);

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length === 1) {
    const country = countries[0];
    return (
      <div>
        <div>
          <h2>{country.name.common}</h2>
          <p>Capital: {country.capital}</p>
          <p>Area: {country.area}</p>
        </div>

        <div>
          <h2>Languages</h2>
          <ul>
            {Object.keys(country.languages).map((lang) => (
              <li key={lang}>{country.languages[lang]}</li>
            ))}
          </ul>
          <img src={country.flags.png} alt={country.flags.alt} />
        </div>

        {weather && (
          <div>
            <h2>Weather in {country.capital}</h2>
            <p>Temperature: {weather.main.temp} Celsius</p>
            <p>Wind: {weather.wind.speed} m/s</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
          </div>
        )}
      </div>
    );
  }

  return countries.map((country) => (
    <div key={country.cca3}>
      {country.name.common}
      <button onClick={() => showCountry(country.name.common)}>show</button>
    </div>
  ));
};

export default Countries;

