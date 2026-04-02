const benefits = [
  {
    emoji: '💵',
    title: 'Increase Profit',
    desc: 'Make data-backed decisions that directly improve your income.'
  },
  {
    emoji: '🛡️',
    title: 'Reduce Risk',
    desc: 'Get early warnings and avoid costly mistakes before they happen.'
  },
  {
    emoji: '📅',
    title: 'Better Planning',
    desc: 'Plan entire seasons confidently with AI-assisted crop calendars.'
  },
  {
    emoji: '⏱️',
    title: 'Save Time',
    desc: 'All your farming intelligence in one place. No more guesswork.'
  }
]

export default function BenefitsSection() {
  return (
    <section id="benefits" className="bg-primary-pale py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark">
          Why Farmers Love AgriSmart
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center text-2xl">
                {b.emoji}
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-dark">{b.title}</h3>
                <p className="mt-2 text-slate-700 font-body">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

