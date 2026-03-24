import { useState } from 'react'

const LANGS = ['curl', 'JavaScript', 'Python'] as const
type Lang = (typeof LANGS)[number]

const examples: Record<Lang, string> = {
  curl: `curl -s "https://aggregate-api.up.railway.app/api/v1/location-profile?zip=90210" \\
  -H "X-API-Key: YOUR_API_KEY" | jq .`,

  JavaScript: `const response = await fetch(
  "https://aggregate-api.up.railway.app/api/v1/location-profile?zip=90210",
  {
    headers: { "X-API-Key": "YOUR_API_KEY" }
  }
);

const profile = await response.json();

console.log(profile.area.economic.median_household_income);
console.log(profile.climate.annual_summary.avg_temp);
console.log(profile.tax.sales_tax.combined_rate);
console.log(profile.crime.violent_crime.violent_crime_rate);`,

  Python: `import requests

response = requests.get(
    "https://aggregate-api.up.railway.app/api/v1/location-profile",
    params={"zip": "90210"},
    headers={"X-API-Key": "YOUR_API_KEY"}
)

profile = response.json()

print(profile["area"]["economic"]["median_household_income"])
print(profile["climate"]["annual_summary"]["avg_temp"])
print(profile["tax"]["sales_tax"]["combined_rate"])
print(profile["crime"]["violent_crime"]["violent_crime_rate"])`,
}

export default function CodeExample() {
  const [activeLang, setActiveLang] = useState<Lang>('curl')

  return (
    <section className="py-32 sm:py-40">
      <div>
        <h2 className="text-center text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
          Integrate in Minutes
        </h2>
        <p className="text-center text-lg text-[var(--color-text-secondary)] mb-16 leading-relaxed">
          A single REST call returns data from all five sources. No SDKs required.
        </p>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] overflow-hidden">
          {/* Language tabs */}
          <div className="flex border-b border-[var(--color-border)]">
            {LANGS.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-8 py-4 text-sm font-medium transition ${
                  activeLang === lang
                    ? 'text-[var(--color-accent-blue)] border-b-2 border-[var(--color-accent-blue)] bg-[var(--color-bg-secondary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Code block */}
          <pre className="p-8 sm:p-10 overflow-x-auto text-sm leading-loose font-['JetBrains_Mono',monospace] text-[var(--color-text-secondary)]">
            <code>{examples[activeLang]}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
