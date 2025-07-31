import { useNavigate } from 'react-router-dom'
import builtResume from '../../assets/built-resume.png'

const BuiltYourResume = () => {
    const navigate = useNavigate()
  return (
    <div className="max-w-[100rem] mx-auto px-4 sm:px-10 xl:px-20 py-20 flex flex-col lg:flex-row items-center justify-between gap-12 mt-20">
    {/* Text Content */}
    <div className="w-full lg:w-1/2 space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-color_4 leading-tight text-center lg:text-left">
        Build Your <br />
        <span className="bg-gradient-3 text-transparent bg-clip-text">Resume Effortlessly</span>
        </h2>
        <p className="text-color_2/70 font-medium text-center lg:text-left max-w-2xl">
        Create a professional resume in minutes with our AI-powered builder. Pick modern templates and customize content to impress employers.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
        <div className=" border border-color_6/30 backdrop-blur-sm p-4 rounded-xl shadow-sm text-left">
            <h3 className="text-lg font-semibold text-color_4">Easy Editing</h3>
            <p className="text-sm text-color_2/60 font-medium">Update your resume with live preview and clean formatting tools.</p>
        </div>
        <div className=" border border-color_6/30 backdrop-blur-sm p-4 rounded-xl shadow-sm text-left">
            <h3 className="text-lg font-semibold text-color_4">Beautiful Templates</h3>
            <p className="text-sm text-color_2/60 font-medium">Choose from modern, professional designs that are fully customizable.</p>
        </div>
        <div className=" border border-color_6/30 backdrop-blur-sm p-4 rounded-xl shadow-sm text-left">
            <h3 className="text-lg font-semibold text-color_4">One-Click Export</h3>
            <p className="text-sm text-color_2/60 font-medium">Download a high-quality PDF version of your resume instantly.</p>
        </div>
        </div>

        <button
        className="btn2-grad px-6 py-2 mt-6 rounded-lg font-semibold flex justify-center items-center mx-auto lg:mx-0"
        onClick={() => navigate('/ai/resume-builder')}
        >
        Start Building
        </button>
    </div>

    {/* Image Section */}
    <div className="w-full lg:w-1/2">
        <img
        src={builtResume}
        alt="Resume Building"
        className="h-[400px] w-full object-contain rounded-lg shadow-lg"
        />
    </div>
    </div>

  )
}

export default BuiltYourResume
