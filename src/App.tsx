import Hero from './landing/sections/Hero'
import Features from './landing/sections/Features'
import LiveDemo from './landing/sections/LiveDemo'
import CodeExample from './landing/sections/CodeExample'
import Pricing from './landing/sections/Pricing'
import Footer from './landing/sections/Footer'

export default function App() {
  const Divider = () => (
    <div className="mx-auto max-w-xs border-t border-[var(--color-border)]" />
  )

  return (
    <div className="min-h-screen">
      <Hero />
      <Divider />
      <Features />
      <Divider />
      <LiveDemo />
      <CodeExample />
      <Divider />
      <Pricing />
      <Footer />
    </div>
  )
}
