import { useState } from 'react'

const LANGS = ['curl', 'JavaScript', 'Python'] as const
type Lang = (typeof LANGS)[number]

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
    <section className="py-24 sm:py-32 border-t border-[var(--color-border)]">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)]">
          Integrate in Minutes
        </h2>
        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
          A single REST call returns data from all six sources.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
        <div className="flex border-b border-[var(--color-border)]">
          {LANGS.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-6 py-3.5 text-sm font-medium transition ${
                activeLang === lang
                  ? 'text-[var(--color-accent-blue)] border-b-2 border-[var(--color-accent-blue)] bg-[var(--color-bg-card)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <pre className="p-6 sm:p-8 overflow-x-auto text-sm leading-relaxed font-['JetBrains_Mono',monospace] text-[var(--color-text-secondary)]">
          <code>{examples[activeLang]}</code>
        </pre>
      </div>
    </section>
  )
}
