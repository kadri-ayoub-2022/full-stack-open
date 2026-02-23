import { useState, useEffect } from 'react'
import axios from 'axios'
const apiKey = import.meta.env.VITE_WEATHER_API_KEY

const App = () => {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!selectedCountry) return

    const capital = selectedCountry.capital?.[0]

    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: capital,
          appid: apiKey,
          units: 'metric',
        },
      })
      .then((response) => {
        setWeather(response.data)
      })
  }, [selectedCountry])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response?.data)
      })
  }, [])

  const handlefilterCountries = (event) => {
    const filter = event?.target?.value
    const lowercasedFilter = filter?.toLowerCase()
    const filtered = countries?.filter((country) =>
      country?.name?.common?.toLowerCase()?.includes(lowercasedFilter)
    )
    setQuery(filter || '')
    setFilteredCountries(filtered)
    if (filtered?.length === 1) {
      setSelectedCountry(filtered[0])
    } else {
      setSelectedCountry(null)
    }
  }

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__content">
          <p className="eyebrow">World Explorer</p>
          <h1>Country Finder</h1>
          <p className="subhead">
            Search for a country to see key facts, languages, and live weather for its capital.
          </p>
        </div>
        <div className="hero__accent" aria-hidden="true" />
      </header>

      <section className="search">
        <label className="search__label">
          <span>Find countries</span>
          <input
            className="search__input"
            onChange={handlefilterCountries}
            placeholder="Start typing a country name..."
          />
        </label>
        <p className="search__note">Tip: try "Finland", "Japan", or "Brazil".</p>
      </section>

      <section className="results">
        {selectedCountry ? (
          <article className="card card--detail">
            <div className="card__header">
              <div>
                <h2>{selectedCountry.name.common}</h2>
                <p className="muted">
                  Capital: {selectedCountry.capital?.[0] || 'N/A'} - Area:{' '}
                  {selectedCountry.area?.toLocaleString()} km^2
                </p>
              </div>
              <img
                className="flag"
                src={selectedCountry.flags.png}
                alt={`Flag of ${selectedCountry.name.common}`}
              />
            </div>

            <div className="card__body">
              <div className="info-block">
                <h3>Languages</h3>
                <ul className="pill-list">
                  {Object.values(selectedCountry.languages || {}).map((lang) => (
                    <li key={lang} className="pill">
                      {lang}
                    </li>
                  ))}
                </ul>
              </div>

              {weather && (
                <div className="info-block weather-card">
                  <h3>Weather in {selectedCountry.capital?.[0]}</h3>
                  <div className="weather-row">
                    <div>
                      <p className="temp">{Math.round(weather.main.temp)} deg C</p>
                      <p className="muted">
                        Wind {Math.round(weather.wind.speed)} km/h - {weather.wind.deg}deg
                      </p>
                    </div>
                    <img
                      className="weather-icon"
                      src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                    />
                  </div>
                </div>
              )}
            </div>
          </article>
        ) : filteredCountries.length > 10 ? (
          <div className="notice">Too many matches, specify another filter.</div>
        ) : filteredCountries.length === 0 && query ? (
          <div className="notice">No matches found. Try another spelling.</div>
        ) : (
          <ul className="list">
            {filteredCountries.map((country, index) => (
              <li
                key={country.cca3}
                className="list__item"
                style={{ '--i': index }}
              >
                <span className="list__name">{country.name.common}</span>
                <button className="btn" onClick={() => handleShowCountry(country)}>
                  Show
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default App