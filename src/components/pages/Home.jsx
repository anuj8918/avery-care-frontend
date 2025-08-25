import React from 'react'
import Hero from '../pages/home/Hero'
import FeatureSection from '../pages/home/FeatureSection'
import Testimonials from '../pages/home/Testimonials'
import CTA from '../pages/home/CTA'


const Home = () => {
  return (
    <div>
        <Hero/>
        <FeatureSection/>
        <Testimonials/>
        <CTA/>
    </div>
  )
}

export default Home