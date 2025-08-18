import { LucideGithub, LucideGlobe } from 'lucide-react'
import ActionLink from '../resumeSections/ActionLink'


const Projects = ({ title, githubLink, liveDemoUrl, description, bgColor, iconColor,isPreview, titleColor}) => {

  return (
    <div className='mb-5'>
    <div className='flex flex-col justify-between'>
      <div className="">
        <h3 className={`${isPreview ? "text-xs" : "text-sm"}  text-[15px] font-semibold`} style={{color: titleColor}}>{title}</h3>
        <p className='text-sm mt-[0.5cqw]'>{description}</p>
      </div>
      <div>
        <div className='flex items-center gap-3 mt-2'>
         {githubLink && <ActionLink icon={<LucideGithub />} link={githubLink} bgColor={bgColor} iconColor={iconColor}/>}
         {liveDemoUrl && <ActionLink icon={<LucideGlobe />} link={liveDemoUrl} bgColor={bgColor} iconColor={iconColor}/>}
        </div>
      </div>
    </div>
    </div>
  )
}

export const Projects1 = ({ title, githubLink, liveDemoUrl, description, bgColor, iconColor,isPreview}) => {

  return (
    <div className='mb-5'>
    <div className='flex flex-col justify-between'>
      <div className="">
        <h3 className={` ${isPreview ? "text-xs" : "text-sm"}  text-[15px] font-semibold`}>{title}</h3>
        <p className='text-sm mt-[0.5cqw]'>{description}</p>
      </div>
      <div>
        <div className='flex flex-wrap items-center gap-3 mt-2'>
         {githubLink && <ActionLink icon={<LucideGithub />} link={githubLink} bgColor={bgColor} iconColor={iconColor}/>}
         {liveDemoUrl && <ActionLink icon={<LucideGlobe />} link={liveDemoUrl} bgColor={bgColor} iconColor={iconColor}/>}
        </div>
      </div>
    </div>
    </div>
  )
}
export default Projects
