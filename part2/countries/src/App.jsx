import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;


const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null); 

  useEffect(() => {
    if (!selectedCountry) return;

    const capital = selectedCountry.capital?.[0];
    console.log("Fetching weather for capital:", apiKey);

    axios
      .get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          q: capital,
          appid: apiKey,
          units: "metric",
        },
      })
      .then((response) => {
        console.log("Weather data fetched:", response.data);
        setWeather(response.data);
      });
  }, [selectedCountry]);

  
  
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response?.data)
      })
  }, [])

  const handlefilterCountries = (event) => {
    const filter = event?.target?.value;
    const lowercasedFilter = filter?.toLowerCase();
    const filtered = countries?.filter(country =>
      country?.name?.common?.toLowerCase()?.includes(lowercasedFilter)
    );
    setFilteredCountries(filtered);
    if (filtered?.length === 1) {
      setSelectedCountry(filtered[0]);
    } else {
      setSelectedCountry(null);
    }
  }

  

  

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
  }

  return (
    <div>
      <div>
        find countries <input onChange={handlefilterCountries} />
      </div>
      
      {selectedCountry ? (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital?.[0]}</p>
          <p>Area: {selectedCountry.area}</p>

          <h3>Languages:</h3>
          <ul>
            {Object.values(selectedCountry.languages || {}).map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>

          <img
            src={selectedCountry.flags.png}
            alt={`Flag of ${selectedCountry.name.common}`}
            width="150"
          />
          {weather  && ( 
            <div>
              <h3>Weather in {selectedCountry.capital?.[0]}</h3>
              <p>Temperature: {weather.main.temp} °C</p>
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <p>Wind: {weather.wind.speed} km/h direction {weather.wind.deg}</p>
            </div>
          )}
        </div>
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => handleShowCountry(country)}>show</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App
