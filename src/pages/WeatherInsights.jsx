import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar.jsx'
import { getWeatherInsights, getFarmData } from '../services/api.js'

const cropOptions = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Groundnut', 'Soybean', 'Millets']

const parseAiInsights = (text) => {
  const lines = String(text || '')
    .split('\n')
    .map((line) =>
      line
        .replace(/\*\*/g, '')
        .replace(/^\s*[*-]+\s*/, '')
        .replace(/^\s*\d+\)\s*/, '')
        .trim()
    )
    .filter(Boolean)

  const result = {
    bestCrop: '',
    risks: [],
    advice: [],
    fallback: ''
  }

  let section = ''

  lines.forEach((line) => {
    const lower = line.toLowerCase()

    if (lower.includes('best crop')) {
      section = 'best'
      const value = line.split(':').slice(1).join(':').trim()
      if (value) {
        result.bestCrop = value
      }
      return
    }

    if (lower.includes('risks')) {
      section = 'risks'
      const value = line.split(':').slice(1).join(':').trim()
      if (value) {
        result.risks.push(value)
      }
      return
    }

    if (lower.includes('actionable') || lower.includes('advice')) {
      section = 'advice'
      const value = line.split(':').slice(1).join(':').trim()
      if (value) {
        result.advice.push(value)
      }
      return
    }

    if (section === 'best' && !result.bestCrop) {
      result.bestCrop = line
      return
    }

    if (section === 'risks') {
      result.risks.push(line)
      return
    }

    if (section === 'advice') {
      result.advice.push(line)
      return
    }
  })

  if (!result.bestCrop && result.risks.length === 0 && result.advice.length === 0) {
    result.fallback = lines.join(' ')
  }

  return result
}

export default function WeatherInsights() {
  const [location, setLocation] = useState('')
  const [coordinates, setCoordinates] = useState(null)
  const [selectedCrops, setSelectedCrops] = useState(['Rice', 'Wheat'])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const insightSections = parseAiInsights(result?.insights)

  useEffect(() => {
    loadFarmData()
  }, [])

  const loadFarmData = async () => {
    try {
      const response = await getFarmData()
      if (response.data.farmData) {
        const farmData = response.data.farmData
        setLocation(farmData.location || '')
        if (farmData.preferredCrop) {
          setSelectedCrops([farmData.preferredCrop])
        }
      }
    } catch (error) {
      console.log('No saved farm data found, using defaults')
    }
  }

  const toggleCrop = (crop) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    )
  }

  const autoDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported in this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        setCoordinates({ latitude: lat, longitude: lon })

        try {
          const reverseUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`
          const reverse = await fetch(reverseUrl)
          const data = await reverse.json()
          const place = data?.results?.[0]
          if (place?.name) {
            const label = `${place.name}${place.admin1 ? `, ${place.admin1}` : ''}`
            setLocation(label)
          } else {
            setLocation('Auto-detected location')
          }
          toast.success('Location detected')
        } catch {
          setLocation('Auto-detected location')
          toast.success('Location detected')
        }
      },
      () => {
        toast.error('Could not detect location. Please enter city name.')
      }
    )
  }

  const submitWeather = async (event) => {
    event.preventDefault()

    if (!location && !coordinates) {
      toast.error('Please enter a location or use auto-detect.')
      return
    }

    if (selectedCrops.length === 0) {
      toast.error('Please select at least one crop.')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const payload = {
        location,
        crops: selectedCrops,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude
      }
      const { data } = await getWeatherInsights(payload)
      setResult(data)
      toast.success('Weather insights generated')
    } catch (error) {
      const message = error?.response?.data?.error || 'Could not fetch weather insights.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-primary-pale/50">
      <Navbar />

      <main className="container py-10 md:py-14">
        <section className="text-center mb-8">
          <span className="badge-primary">Smart Climate Advisor</span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-display font-extrabold text-dark">
            Weather Insights 🌦️
          </h1>
          <p className="mt-3 text-slate-700 max-w-3xl mx-auto">
            Get real-time weather data, forecast visuals, and AI-generated farming advice based on
            your location and crops.
          </p>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-6 xl:gap-8">
          <form
            onSubmit={submitWeather}
            className="xl:col-span-2 card border-slate-200/80 space-y-5 h-fit"
            aria-label="Weather insights form"
          >
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-semibold text-slate-700">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  setCoordinates(null)
                }}
                placeholder="Enter city name"
                className="input-field"
              />
              <button type="button" onClick={autoDetectLocation} className="btn-secondary w-full">
                Auto-detect location
              </button>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Current Crops</p>
              <div className="grid grid-cols-2 gap-2">
                {cropOptions.map((crop) => (
                  <label
                    key={crop}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCrops.includes(crop)}
                      onChange={() => toggleCrop(crop)}
                      className="accent-primary"
                    />
                    <span>{crop}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing Weather...' : 'Get Weather Insights'}
            </button>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                Fetching weather and AI insights...
              </div>
            )}
          </form>

          <section className="xl:col-span-3 space-y-5">
            {!result ? (
              <div className="card border-slate-200/80">
                <h2 className="text-xl font-display font-bold text-dark">Your results will show here</h2>
                <p className="mt-2 text-slate-600">
                  Submit the form to view weather cards, short forecast, and AI farming guidance.
                </p>
              </div>
            ) : (
              <>
                <div className="card border-slate-200/80">
                  <h2 className="text-xl font-display font-bold text-dark">1. Weather Data</h2>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <InfoCard icon="🌡️" label="Temperature" value={`${result.weather.temperature}°C`} />
                    <InfoCard icon="💧" label="Humidity" value={`${result.weather.humidity}%`} />
                    <InfoCard icon="🌧️" label="Rainfall" value={`${result.weather.rainfall} mm`} />
                    <InfoCard icon="☁️" label="Condition" value={result.weather.condition} />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">Location: {result.weather.location}</p>
                </div>

                <div className="card border-slate-200/80">
                  <h2 className="text-xl font-display font-bold text-dark">2. Weather Visualization</h2>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {result.forecast?.map((day) => (
                      <article key={day.date} className="rounded-xl border border-slate-200 p-3 bg-white">
                        <p className="text-sm font-semibold text-slate-700">{day.date}</p>
                        <p className="mt-1 text-sm text-primary font-semibold">{day.condition}</p>
                        <p className="text-sm text-slate-700">Max: {day.tempMax}°C</p>
                        <p className="text-sm text-slate-700">Min: {day.tempMin}°C</p>
                        <p className="text-sm text-slate-700">Rain: {day.precipitation} mm</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="card border-slate-200/80">
                  <h2 className="text-xl font-display font-bold text-dark">3. AI Insights</h2>
                  {Array.isArray(result.warnings) && result.warnings.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.warnings.map((warning) => (
                        <span key={warning} className="badge-accent">
                          {warning}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 space-y-3">
                    {insightSections.bestCrop && (
                      <article className="rounded-xl border border-primary/20 bg-primary-pale/60 p-4">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide">Best Crop Focus</p>
                        <p className="mt-1 text-sm text-slate-800 font-semibold">{insightSections.bestCrop}</p>
                      </article>
                    )}

                    {insightSections.risks.length > 0 && (
                      <article className="rounded-xl border border-accent/20 bg-accent/15 p-4">
                        <p className="text-xs font-semibold text-accent uppercase tracking-wide">Risks</p>
                        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                          {insightSections.risks.map((risk) => (
                            <li key={risk}>{risk}</li>
                          ))}
                        </ul>
                      </article>
                    )}

                    {insightSections.advice.length > 0 && (
                      <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Actionable Advice</p>
                        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                          {insightSections.advice.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </article>
                    )}

                    {insightSections.fallback && (
                      <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-700">{insightSections.fallback}</p>
                      </article>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        </section>
      </main>
    </div>
  )
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-sm text-slate-500">{icon} {label}</p>
      <p className="mt-1 text-lg font-semibold text-dark">{value}</p>
    </div>
  )
}
