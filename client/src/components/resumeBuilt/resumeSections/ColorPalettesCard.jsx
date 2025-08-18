import React from 'react'

const ColorPalettesCard = ({colors, isSelected, onSelect}) => {
  return (
    <div className={`h-20 bg-color_9 flex rounded overflow-hidden border-2  ${isSelected ? " border-color_4/40" : "border-none"}`}>
      {
        colors.map((color, index) => (
            <div 
            key={`colors_${index}`} 
            className='flex-1 '
            style={{backgroundColor: colors[index]}} 
            onClick={onSelect}/>
        ))
      }
    </div>
  )
}

export default ColorPalettesCard
