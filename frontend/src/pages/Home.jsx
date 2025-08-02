import React from 'react'
import HowItWorks from '../components/HowItWorks.jsx'
import Hero from '../components/Hero.jsx'
import PetCareSection from '../components/PetCareSection.jsx'
import Banner from '../components/Banner.jsx'
import BenefitSection from '../components/BenefitSection.jsx'
import Footer from '../components/Footer.jsx'

function Home() {
  return (
    <div>
      <Hero />
      <PetCareSection />
      <HowItWorks />
      <Banner />
      <BenefitSection/>
      <Footer />
    
    </div>
  )
}

export default Home

