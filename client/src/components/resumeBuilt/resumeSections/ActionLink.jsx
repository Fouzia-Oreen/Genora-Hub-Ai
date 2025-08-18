import React from 'react'

const ActionLink = ({link, bgColor,iconColor, icon}) => {
  return (
    <div className='flex items-center gap-3'>
      <div className="w-[18px] h-[18px] p-0.5 flex items-center justify-center rounded-full" style={{backgroundColor: bgColor, color: iconColor}}>
        {icon}
      </div>
      <p className='text-xs underline cursor-pointer break-all'>{link}</p>
    </div>
  )
}

export default ActionLink
