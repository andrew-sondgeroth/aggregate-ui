import { useState } from 'react'

const LANGS = ['curl', 'JavaScript', 'Python'] as const
type Lang = (typeof LANGS)[number]

const langLabels: Record<Lang, string> = {
  curl: 'cURL',
  JavaScript: 'JavaScript',
  Python: 'Python',
}

const examples: Record<Lang, string> = {
  curl: `curl -s "https://aggregate-api.up.railway.app/api/v1/location-profile?zip=90210" \\
  -H "X-API-Key: YOUR_API_KEY" | jq .`,

  JavaScript: `const response = await fetch(
  "https://aggregate-api.up.railway.app/api/v1/location-profile?zip=90210",
  { headers: { "X-API-Key": "YOUR_API_KEY" } }
);
const profile = await response.json();
console.log(profile.area.economic.median_household_income);`,

  Python: `import requests

response = requests.get(
    "https://aggregate-api.up.railway.app/api/v1/location-profile",
    params={"zip": "90210"},
    headers={"X-API-Key": "YOUR_API_KEY"}
)
profile = response.json()
print(profile["area"]["economic"]["median_household_income"])`,
}

export default function CodeExample() {
  const [activeLang, setActiveLang] = useState<Lang>('curl')

  return (
    <section className="py-28 sm:py-40">
      <div className="mb-16 animate-fade-up">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-accent-gold)] mb-3">Integration</p>
        <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-[var(--color-text-primary)]">
          Integrate in minutes
        </h2>
        <p className="mt-4 text-base text-[var(--color-text-secondary)]">
          A single REST call returns data from every source.
        </p>
      </div>

      <div className="animate-fade-up delay-200 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
        <div className="flex gap-0 border-b border-[var(--color-border)]">
          {LANGS.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-6 py-3.5 text-sm font-medium transition-colors relative ${
                activeLang === lang
                  ? 'text-[var(--color-accent-gold)] bg-[var(--color-bg-card)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              {langLabels[lang]}
              {activeLang === lang && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-accent-gold)]" />
              )}
            </button>
          ))}
        </div>
        <pre className="p-6 sm:p-8 overflow-x-auto text-sm leading-relaxed font-[var(--font-mono)] text-[var(--color-text-secondary)]">
          <code>{examples[activeLang]}</code>
        </pre>
      </div>
    </section>
  )
}
