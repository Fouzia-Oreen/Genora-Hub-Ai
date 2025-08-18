import React from 'react'

export const WorkExperience = ({ company, role,duration,durationColor,description, titleColor}) => {
  return (
    <div className='mb-5'>
    <div className='flex items-center justify-between'>
      <div className="">
        <h3 className='text-[15px] font-semibold'>{company}</h3>
        <p className='text-[15px] font-semibold' style={{color: titleColor}}>{role}</p>
      </div>
      <p className='text-xs font-bold italic' style={{color: durationColor}}>{duration}</p>
    </div>
    <p className='text-sm mt-[0.5cqw]'>{description}</p>
    </div>
  )
}

export const WorkExperience1 = ({ company, role,duration,durationColor,description, titleColor, lineColor}) => {
  return (
    <div className='mb-5'>
    <div className='flex items-center justify-between'>
      <div className="flex items-center gap-1.5">
        <h3 className='text-[15px] font-semibold'>{company}</h3>
        <div className="w-[2px] h-[18px] " style={{backgroundColor:lineColor}}></div>
        <p className='text-[15px] ' style={{color: titleColor}}>{role}</p>
      </div>
      <p className='text-xs font-bold italic' style={{color: durationColor}}>{duration}</p>
    </div>
    <p className='text-sm mt-[0.5cqw]'>{description}</p>
    </div>
  )
}

export const WorkExperience2 = ({ company, role,duration,durationColor,description}) => {
  return (
    <div className=''>
    <div className='flex items-center justify-between'>
      <div className="flex justify-between items-center">
        <h3 className='text-[15px] font-semibold'>{company}</h3>
        <p className='text-xs font-bold italic' style={{color: durationColor}}>{duration}</p>
      </div>
        <p className='text-[15px] font-semibold'>{role}</p>
    </div>
    <p className='text-sm mt-[0.5cqw]'>{description}</p>
    </div>
  )
}

