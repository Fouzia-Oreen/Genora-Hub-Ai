import { ListCheck, LucidePencil } from 'lucide-react'
import React, { useState } from 'react'

const TitleInput = ({title, setTitle}) => {
  const [showInput, setShowInput] = useState(false)
  
  return (
    <div className='flex items-center gap-3'>
      {
        showInput ? 
        <>
         <input type="text" placeholder='ResumeTitle' className='text-sm md:text-[17px] bg-transparent outline-none text-color_2 font-semibold border-b border-color_2/70' value={title} onChange={({target}) => setTitle(target.value)}/>
         <button onClick={()=>setShowInput((prevState) => !prevState)} className='cursor-pointer'><ListCheck className='btn-small'/></button>
        </> 
        : 
        <>
        <h2 className='text-sm md:text-[17px] font-semibold'>{title}</h2>
        <button onClick={()=>setShowInput((prevState) => !prevState)} className='cursor-pointer'><LucidePencil  className='btn-small'/></button>
        </>
      }
    </div>
  )
}

export default TitleInput
