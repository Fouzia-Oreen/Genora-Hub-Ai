import { SparklesIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bg from "../assets/bg-2.jpg";
import Marquee from './Marquee';

const Hero = () => {
    const navigate = useNavigate()
  return (
    <div
      className="relative bg-cover bg-no-repeat bg-center min-h-screen"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-color_9 bg-opacity-60 z-10" />

      {/* Centered Content */}
      <div className="absolute z-20 flex flex-col justify-center items-center text-center h-full w-full px-4 sm:px-20 xl:px-32 ">
        <div className='mb-6'>
        <p className="text-color_6 font-semibold text-sm mb-3 flex items-center justify-center  gap-2">
        <SparklesIcon className="w-5 h-5 text-color_11 animate-sparkle" />
         Explore a powerful suite of AI features crafted for writers, marketers, designers, and job seekers.
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-bold text-color_4 leading-[1.5] sm:text-left my-5 mx-auto text-center flex flex-col items-center ">
          Supercharge Your Workflow
          <span className="text-center">
            with
            <span className="relative bg-gradient-1 text-transparent bg-clip-text font-bold px-2 rounded-lg inline-block text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl">
              Genora's AI Tools
              <img
                alt="brush"
                draggable="false"
                loading="lazy"
                width="370"
                height="26"
                decoding="async"
                className="absolute -bottom-4 md:-bottom-6 -right-5 min-w-52"
                style={{ color: "transparent" }}
                src="https://prebuiltui.com/_next/static/media/brush_line.324e4867.svg"
              />
            </span>
          </span>
        </h1>
        <p className="md:text-lg text-center text-sm text-color_3 max-w-2xl mb-4 mt-10 mx-auto">
        Instantly generate content, design visuals, clean backgrounds, fix objects, and enhance resumes — all powered by AI in one platform.
        </p>
        </div>
        <div className="flex flex-wrap justify-center  md:gap-4 gap-2">
        <button className='border-2 border-color_11 text-color_11 font-semibold rounded-full px-6 hover:btn2-grad'>Watch Demo</button>
        <button className='btn2-grad' onClick={() => navigate("/ai")}>Start Creating Now</button>
        {/* <button className="btn2-grad " >Get Started </button> */}
        </div>
        <div className=' mt-8 gap-4 text-sm'>
            <div className="flex items-center divide-x divide-color_2/50">
            <div className="flex -space-x-3 pr-3">
                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="image" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-1" />
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="image" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-[2]" />
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop" alt="image" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-[3]" />
                <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="image" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-[4]" />
            </div>
            <div className="pl-3">
                <p className="text-sm text-color_3/50">Trusted by  <span className="font-medium text-color_6">10K+</span> people </p>
            </div>
        </div>
        </div>
      </div>
      {/* Bottom Content */}
      <div className="absolute z-20 flex flex-col justify-end items-center text-center h-full w-full px-4 sm:px-20 xl:px-32 ">
      <Marquee />
      </div>

    </div>
  )
}

export default Hero
