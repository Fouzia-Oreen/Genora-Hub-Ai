import AiTools from "../components/home/AiTools"
import BuiltYourResume from "../components/home/BuiltYourResume"
import Footer from "../components/home/Footer"
import Hero from "../components/home/Hero"
import Navbar from "../components/home/Navbar"
import PricePlan from "../components/home/PricePlan"
import Testimonial from "../components/home/Testimonial"

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <AiTools />
      <BuiltYourResume />
      <Testimonial />
      <PricePlan />
      <Footer />
    </>
  )
}

export default Home
