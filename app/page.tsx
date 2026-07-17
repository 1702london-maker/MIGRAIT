import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Features } from '@/components/sections/Features'
import { StatsBanner } from '@/components/sections/StatsBanner'
import { Comparison } from '@/components/sections/Comparison'
import { BuiltFor } from '@/components/sections/BuiltFor'
import { Testimonials } from '@/components/sections/Testimonials'
import { Faq } from '@/components/sections/Faq'
import { Waitlist } from '@/components/sections/Waitlist'

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <StatsBanner />
      <Comparison />
      <BuiltFor />
      <Testimonials />
      <Faq />
      <Waitlist />
    </>
  )
}
