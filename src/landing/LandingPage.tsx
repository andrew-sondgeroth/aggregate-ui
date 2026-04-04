import Hero from './sections/Hero'
import Features from './sections/Features'
import LiveDemo from './sections/LiveDemo'
import CodeExample from './sections/CodeExample'
import Pricing from './sections/Pricing'
import Footer from './sections/Footer'

function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{ width: '100%' }}>
      <div style={{ maxWidth: '1080px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '64px', paddingRight: '64px' }}>
        {children}
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <>
      <Container><Hero /></Container>
      <Container className="bg-[var(--color-bg-alt)]"><Features /></Container>
      <Container><LiveDemo /></Container>
      <Container className="bg-[var(--color-bg-alt)]"><CodeExample /></Container>
      <Container><Pricing /></Container>
      <Container className="bg-[var(--color-bg-alt)]"><Footer /></Container>
    </>
  )
}
