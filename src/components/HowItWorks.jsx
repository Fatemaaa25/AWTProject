import { ClipboardList, Cpu, Lightbulb } from 'lucide-react'

const steps = [
  {
    num: '01',
    Icon: ClipboardList,
    title: 'Enter Farm Details',
    desc: 'Add your location, soil type, and crops you plan to grow.'
  },
  {
    num: '02',
    Icon: Cpu,
    title: 'AI Analyzes Your Data',
    desc: 'Our engine processes weather, soil, and market data in real-time.'
  },
  {
    num: '03',
    Icon: Lightbulb,
    title: 'Get Insights & Recommendations',
    desc: 'Receive personalized crop plans, alerts, and price forecasts.'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark">
          How AgriSmart Works
        </h2>

        <div className="mt-12 relative">
          <div className="hidden md:block absolute left-[16%] right-[16%] top-6 border-t-2 border-dashed border-primary-light" />

          <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-6">
            {steps.map((s) => (
              <div key={s.num} className="flex flex-col items-start md:items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-white font-bold w-12 h-12 rounded-full flex items-center justify-center">
                    {s.num}
                  </div>
                  <div className="hidden md:flex w-10 justify-center">
                    <s.Icon size={22} className="text-primary" />
                  </div>
                </div>

                <div className="mt-4 flex md:hidden items-center gap-3">
                  <s.Icon size={20} className="text-primary" />
                  <p className="font-display font-bold text-xl text-dark">{s.title}</p>
                </div>

                <h3 className="mt-2 md:mt-0 font-display font-bold text-xl text-dark">
                  {s.title}
                </h3>
                <p className="mt-3 text-slate-700 font-body max-w-sm">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

