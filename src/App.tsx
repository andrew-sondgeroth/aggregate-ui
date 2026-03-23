import Hero from './landing/sections/Hero'
import Features from './landing/sections/Features'
import LiveDemo from './landing/sections/LiveDemo'
import CodeExample from './landing/sections/CodeExample'
import Pricing from './landing/sections/Pricing'
import Footer from './landing/sections/Footer'

export default function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <LiveDemo />
      <CodeExample />
      <Pricing />
      <Footer />
    </div>
  )
}
