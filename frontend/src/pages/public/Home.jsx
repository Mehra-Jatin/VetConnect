import React from 'react'
import Hero from './components/Hero.jsx';
import PetCareSection from './components/PetCareSection.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Banner from './components/Banner.jsx';
import BenefitSection from './components/BenefitSection.jsx';

function Home() {
  return (
    <div>
      <Hero />
      <PetCareSection />
      <HowItWorks />
      <Banner />
      <BenefitSection />
    </div>
  )
}

export default Home

