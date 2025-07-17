import React from 'react'
import Navbar from '../components/Navbar'
import { RocketIcon, SparklesIcon } from 'lucide-react';
import Hero from '../components/Hero';
import AiTools from '../components/AiTools';
import Testimonial from '../components/Testimonial';
import PricePlan from '../components/PricePlan';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <AiTools />
      <Testimonial />
      <PricePlan />
      <Footer />
    </div>
  )
}

export default Home
