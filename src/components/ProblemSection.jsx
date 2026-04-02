import { CloudLightning, TrendingDown, AlertTriangle } from 'lucide-react'

const problems = [
  {
    Icon: CloudLightning,
    title: 'Unpredictable Weather',
    desc: 'Sudden rains, droughts, and frost destroy crops and planning.'
  },
  {
    Icon: TrendingDown,
    title: 'Uncertain Crop Prices',
    desc: 'Price crashes at harvest time cut deep into farmer profits.'
  },
  {
    Icon: AlertTriangle,
    title: 'Poor Crop Planning',
    desc: 'Wrong crop choices lead to low yield and wasted resources.'
  }
]

export default function ProblemSection() {
  return (
    <section className="bg-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl">
            Farmers Face Real Challenges Every Day
          </h2>
          <p className="mt-4 text-slate-200 text-lg font-body">
            Without the right data, every season is a gamble.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 font-display font-bold text-xl">{title}</h3>
              <p className="mt-3 text-slate-200/90 font-body">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

