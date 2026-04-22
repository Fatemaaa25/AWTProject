import { Link } from 'react-router-dom'

const features = [
  {
    emoji: '🌱',
    title: 'Smart Crop Recommendations',
    desc: 'Suggests best crops based on your soil type, location, and climate patterns.',
    to: '/smart-recommendations'
  },
  {
    emoji: '💰',
    title: 'Price Prediction Engine',
    desc: 'Forecasts crop prices using historical trends and market signals.'
  },
  {
    emoji: '🌦️',
    title: 'Weather Insights',
    desc: 'Real-time weather data with farming-specific alerts and advice.',
    to: '/weather-insights'
  },
  {
    emoji: '📊',
    title: 'Data-Driven Dashboard',
    desc: 'Visual reports to track farm performance and make informed decisions.'
  },
  {
    emoji: '🧠',
    title: 'Intelligent AI Suggestions',
    desc: 'Personalized AI tips to maximize your yield and minimize losses.'
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-soil py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark">
          Everything You Need to Farm Smarter
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const CardComponent = f.to ? Link : 'div'
            return (
              <CardComponent
                key={f.title}
                to={f.to}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block"
              >
                <div className="w-fit rounded-xl bg-primary-pale p-3">
                  <span className="text-3xl" aria-hidden="true">
                    {f.emoji}
                  </span>
                </div>

                <h3 className="mt-5 font-display font-bold text-xl text-dark">
                  {f.title}
                </h3>
                <p className="mt-3 text-slate-700 font-body">{f.desc}</p>
              </CardComponent>
            )
          })}
        </div>
      </div>
    </section>
  )
}

