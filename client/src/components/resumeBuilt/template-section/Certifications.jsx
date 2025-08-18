import React from 'react'

const Certifications = ({ title, issuer, year, bgColor,}) => {

  return (
    <div className="flex flex-col  justify-between">
      <h3 className={`text-[14px] font-semibold`}>{title}</h3>
      <div className="flex items-center gap-4">
        {year && (
          <div className="text-[11px] font-bold px-3 py-0.5 inline-block mt-2 rounded" style={{backgroundColor : bgColor}}>{year}</div>
        )}
        <p className='text-sm mt-1 font-medium'>{issuer}</p>
      </div>
    </div>
  )
}

export const Certifications1 = ({ title, issuer, year, bgColor,}) => {

  return (
    <div className="flex flex-col  justify-between">
      <h3 className={`text-[14px] font-semibold`}>{title}</h3>
      <div className="flex items-center justify-between">
        <p className='text-sm mt-1 '>{issuer}</p>
        {year && (
          <div className="text-[12px] font-bold  inline-block mt-2 rounded" style={{color : bgColor}}>{year}</div>
        )}

      </div>
    </div>
  )
}
export default Certifications
