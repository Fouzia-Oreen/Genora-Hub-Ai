import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { AiToolsData } from '../assets/assets'

const AiTools = () => {
    const navigate =useNavigate()
    const {user} = useUser()
  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24 max-w-[85rem] mx-auto'>
      <div className="text-center">
        <h2 className='text-[42px] font-semibold text-color_4'>Powerful Ai Tools</h2>
        <p className='mx-auto max-w-lg text-color_2/60 font-medium'>Everything tou need to create, enhance and optimize your content with cutting-edge AI technology</p>
      </div>
      <div className="flex flex-wrap mt-10 justify-center ">
        {
            AiToolsData.map((tool, index) => (
              <div className="p-8 m-4 max-w-xs rounded-lg bg-color_9 shadow-lg border border-color_7/30 hover:translate-y-1 transition-all duration-300 cursor-pointer" key={index} onClick={() => user && navigate(tool.path)}>
                <tool.Icon className='w-12 h-12 p-3 rounded-xl text-color_9' style={{ background:`linear-gradient(to bottom left, ${tool.bg.from}, ${tool.bg.to})`}}/>
                <h3 className='mt-6 mb-3 text-lg font-bold text-color_4'>{tool.title}</h3>
                <p className='max-w-[95%] text-sm text-color_2/60'>{tool.description}</p>

              </div>
            ))
        }
      </div>
    </div>
  )
}

export default AiTools
