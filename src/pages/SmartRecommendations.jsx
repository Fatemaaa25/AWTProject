import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar.jsx'
import { getSmartRecommendations } from '../services/api.js'

const seasonOptions = ['Kharif', 'Rabi', 'Summer', 'Year-round']
const soilTypeOptions = [
  'Black soil',
  'Red soil',
  'Sandy soil',
  'Clay soil',
  'Loamy soil',
  'Alluvial soil'
]
const waterOptions = [
  'Low',
  'Medium',
  'High',
  'Rainfed only',
  'Borewell',
  'Canal irrigation',
  'Drip irrigation'
]
const budgetOptions = ['Low', 'Medium', 'High']
const goalOptions = ['High profit', 'Low risk', 'Fast harvest', 'Household use', 'Fodder']
const preferenceOptions = ['Organic', 'Chemical', 'Mixed']
const rainfallOptions = ['Low rainfall', 'Moderate', 'Heavy rainfall']
const temperatureOptions = ['Hot', 'Moderate', 'Cold']

const monthName = new Date().toLocaleString('en-IN', { month: 'long' })

const initialForm = {
  farmerName: '',
  location: '',
  landSize: '',
  season: 'Kharif',
  soilType: 'Loamy soil',
  waterAvailability: 'Medium',
  previousCrop: '',
  budget: 'Medium',
  farmingPreference: 'Mixed',
  expectedGoal: 'High profit',
  currentMonth: monthName,
  rainfall: 'Moderate',
  temperature: 'Moderate',
  pestProblems: 'No',
  soilPh: '',
  marketNearby: 'Yes'
}

export default function SmartRecommendations() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const payload = useMemo(() => ({ ...form }), [form])

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const { data } = await getSmartRecommendations(payload)
      setResult(data)
      toast.success('Recommendations generated successfully')
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        'Could not generate recommendations. Please check your inputs and try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-pale/60 via-white to-soil/20">
      <Navbar />

      <main className="container py-10 md:py-14">
        <section className="mb-10 text-center">
          <span className="badge-primary">AI Crop Planner</span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-display font-extrabold text-dark">
            Get Smart Recommendations
          </h1>
          <p className="mt-3 text-slate-700 max-w-3xl mx-auto">
            Enter your farm details and receive crop suggestions with practical reasoning tailored
            to your location, season, soil, water, and budget.
          </p>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-6 xl:gap-8">
          <form
            onSubmit={handleSubmit}
            className="xl:col-span-3 card space-y-5 border-slate-200/80"
            aria-label="Smart crop recommendation form"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Farmer Name</span>
                <input
                  required
                  type="text"
                  value={form.farmerName}
                  onChange={(e) => updateField('farmerName', e.target.value)}
                  className="input-field"
                  placeholder="e.g. Rakesh Kumar"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Location</span>
                <input
                  required
                  type="text"
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="input-field"
                  placeholder="District / State / Village"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Land Size</span>
                <input
                  required
                  type="text"
                  value={form.landSize}
                  onChange={(e) => updateField('landSize', e.target.value)}
                  className="input-field"
                  placeholder="e.g. 2 acres"
                />
              </label>

              <SelectField
                label="Season"
                value={form.season}
                onChange={(value) => updateField('season', value)}
                options={seasonOptions}
              />

              <SelectField
                label="Soil Type"
                value={form.soilType}
                onChange={(value) => updateField('soilType', value)}
                options={soilTypeOptions}
              />

              <SelectField
                label="Water Availability"
                value={form.waterAvailability}
                onChange={(value) => updateField('waterAvailability', value)}
                options={waterOptions}
              />

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Previous Crop</span>
                <input
                  type="text"
                  value={form.previousCrop}
                  onChange={(e) => updateField('previousCrop', e.target.value)}
                  className="input-field"
                  placeholder="e.g. Wheat"
                />
              </label>

              <SelectField
                label="Budget"
                value={form.budget}
                onChange={(value) => updateField('budget', value)}
                options={budgetOptions}
              />

              <SelectField
                label="Farming Preference"
                value={form.farmingPreference}
                onChange={(value) => updateField('farmingPreference', value)}
                options={preferenceOptions}
              />

              <SelectField
                label="Expected Goal"
                value={form.expectedGoal}
                onChange={(value) => updateField('expectedGoal', value)}
                options={goalOptions}
              />
            </div>

            <div className="pt-2 border-t border-slate-200">
              <h2 className="text-lg font-display font-bold text-dark mb-3">Optional Smart Inputs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Current Month</span>
                  <input
                    type="text"
                    value={form.currentMonth}
                    onChange={(e) => updateField('currentMonth', e.target.value)}
                    className="input-field"
                  />
                </label>

                <SelectField
                  label="Rainfall"
                  value={form.rainfall}
                  onChange={(value) => updateField('rainfall', value)}
                  options={rainfallOptions}
                />

                <SelectField
                  label="Temperature"
                  value={form.temperature}
                  onChange={(value) => updateField('temperature', value)}
                  options={temperatureOptions}
                />

                <SelectField
                  label="Pest Problems Last Season"
                  value={form.pestProblems}
                  onChange={(value) => updateField('pestProblems', value)}
                  options={['Yes', 'No']}
                />

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Soil pH (if known)</span>
                  <input
                    type="text"
                    value={form.soilPh}
                    onChange={(e) => updateField('soilPh', e.target.value)}
                    className="input-field"
                    placeholder="e.g. 6.8"
                  />
                </label>

                <SelectField
                  label="Market Nearby"
                  value={form.marketNearby}
                  onChange={(value) => updateField('marketNearby', value)}
                  options={['Yes', 'No']}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base sm:text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Recommendations...' : 'Recommend Crop'}
            </button>
          </form>

          <aside className="xl:col-span-2 card border-slate-200/80 h-fit xl:sticky xl:top-24">
            {!result ? (
              <div className="space-y-3">
                <h3 className="text-xl font-display font-bold text-dark">Results will appear here</h3>
                <p className="text-slate-600">
                  After submitting, you will see recommended crops with explanations on why each one
                  suits your farm profile.
                </p>
                <div className="rounded-xl bg-primary-pale/60 p-4">
                  <p className="font-semibold text-primary">Example Output</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
                    <li>Maize - Suitable for loamy soil with medium water in Kharif</li>
                    <li>Groundnut - Great for low budget and sandy soil</li>
                    <li>Cotton - Good high-profit option in black soil</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-display font-bold text-dark">Recommended Crops</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {result.summary || 'Best-fit crops based on your details:'}
                </p>

                <div className="space-y-3">
                  {result.recommendations?.map((item, index) => (
                    <article key={`${item.crop}-${index}`} className="rounded-xl border border-slate-200 p-4">
                      <h4 className="text-base font-display font-bold text-primary">{item.crop}</h4>
                      <p className="mt-1 text-sm text-slate-700">{item.reason}</p>
                      {Array.isArray(item.tips) && item.tips.length > 0 && (
                        <ul className="mt-2 list-disc pl-5 text-xs text-slate-600 space-y-1">
                          {item.tips.slice(0, 3).map((tip) => (
                            <li key={tip}>{tip}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>
      </main>
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input-field">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
