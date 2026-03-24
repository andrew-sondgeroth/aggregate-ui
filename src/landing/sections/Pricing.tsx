import PricingCard from '../components/PricingCard'

const tiers = [
  {
    tier: 'Free',
    price: '$0',
    limit: '100 requests / day',
    features: [
      'All endpoints',
      'Location profiles',
      'Location search',
      'Community support',
    ],
  },
  {
    tier: 'Basic',
    price: '$29',
    limit: '1,000 requests / day',
    features: [
      'Everything in Free',
      'Higher rate limits',
      'Priority support',
      'Usage analytics',
    ],
    highlighted: true,
  },
  {
    tier: 'Pro',
    price: '$99',
    limit: '10,000 requests / day',
    features: [
      'Everything in Basic',
      'Highest rate limits',
      'Dedicated support',
      'SLA guarantee',
    ],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="px-6 sm:px-8 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-6">
          Simple Pricing
        </h2>
        <p className="text-center text-lg text-[var(--color-text-secondary)] mb-20 max-w-xl mx-auto leading-relaxed">
          Start free. Scale as you grow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto items-stretch">
          {tiers.map((t) => (
            <PricingCard key={t.tier} {...t} />
          ))}
        </div>
      </div>
    </section>
  )
}
