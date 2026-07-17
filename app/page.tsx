import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Features } from '@/components/sections/Features'
import { Comparison } from '@/components/sections/Comparison'
import { BuiltFor } from '@/components/sections/BuiltFor'
import { Waitlist } from '@/components/sections/Waitlist'

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Comparison />
      <BuiltFor />
      <Waitlist />
    </>
  )
}
