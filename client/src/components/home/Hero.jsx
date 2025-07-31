import { useNavigate } from 'react-router-dom';
import bg from "../../assets/bg-2.jpg";
import Marquee from './Marquee';
import { SparklesIcon } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative bg-cover bg-no-repeat bg-center h-[80vh]  md:h-screen lg:h-screen"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-color_9 bg-opacity-60 z-10 pointer-events-none" />

      {/* Centered Content */}
      <div className="absolute z-20 flex flex-col justify-center items-center text-center h-full w-full px-4  xl:px-32 pointer-events-auto">
        <div className='mb-6'>
          <p className="text-color_6 font-semibold text-sm mb-3  items-center justify-center gap-2 hidden md:flex">
            <SparklesIcon className="w-5 h-5 text-color_11 animate-sparkle" />
            Explore a powerful suite of AI features crafted for writers, marketers, designers, and job seekers.
          </p>

          <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-bold text-color_4 leading-[1.5]  my-5 mx-auto text-center flex flex-col items-center">
            Supercharge Your  Workflow 
            <div className='flex  items-center'>
            <span className="text-center">with</span>
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
            </div>
          </h1>

          <p className="md:text-lg text-center text-sm text-color_3 max-w-2xl mb-4 mt-10 mx-auto">
            Instantly generate content, design visuals, clean backgrounds, fix objects, and enhance resumes — all powered by AI in one platform.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center md:gap-4 gap-2 z-30">
          <div className="rainbow relative z-0 bg-gradient-1 overflow-hidden p-0.5 flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100">
            <button className="px-8 py-[7px] text-color_10 rounded-full font-semibold bg-color_9 backdrop-blur">
              Watch Demo
            </button>
          </div>

          {/* Navigation Button */}
          <button
            className="btn2-grad z-[9999]"
            onClick={() => {
              navigate("/ai");
            }}
          >
            Start Creating Now
          </button>
        </div>

        {/* Social Proof */}
        <div className="flex items-center divide-x divide-gray-300 mt-8">
            <div className="flex -space-x-3 pr-3">
                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="image" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-1" />
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="image" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-[2]" />
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop" alt="image" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-[3]" />
                <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="image" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-[4]" />
            </div>
            <div className='h-6 bg-color_3/50 w-[2px]'></div>
            <div className="pl-3">
              <p className="text-sm text-color_3/50">
                Trusted by <span className="font-medium text-color_6">10K+</span> people
              </p>
            </div>
        </div>
      </div>

      {/* Bottom Marquee */}
      <div className="absolute z-20 flex flex-col justify-end items-center text-center h-full w-full px-4 sm:px-20 xl:px-32 pointer-events-none">
        <Marquee />
      </div>
    </div>
  );
};

export default Hero;
