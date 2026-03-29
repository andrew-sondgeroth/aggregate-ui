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
    <section style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="text-center mb-[64px]">
        <p className="text-[13px] font-semibold tracking-[0.25em] uppercase text-[var(--color-gold)] mb-[16px]">
          Integration
        </p>
        <h2 className="font-[var(--font-display)] text-[34px] sm:text-[40px] lg:text-[48px] text-[var(--color-text)] leading-[1.15]">
          Integrate in minutes
        </h2>
        <p className="mt-[20px] text-[16px] text-[var(--color-text-sub)] leading-[1.7]">
          A single REST call returns data from every source.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
        <div className="flex border-b border-[var(--color-border)]">
          {LANGS.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`relative px-[28px] py-[16px] text-[14px] font-medium transition-colors ${
                activeLang === lang
                  ? 'text-[var(--color-gold)]'
                  : 'text-[var(--color-text-dim)] hover:text-[var(--color-text-sub)]'
              }`}
            >
              {langLabels[lang]}
              {activeLang === lang && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[var(--color-gold)]" />
              )}
            </button>
          ))}
        </div>
        <pre className="p-[28px] sm:p-[36px] overflow-x-auto text-[14px] leading-[1.8] font-[var(--font-mono)] text-[var(--color-text-sub)]">
          <code>{examples[activeLang]}</code>
        </pre>
      </div>
    </section>
  )
}
