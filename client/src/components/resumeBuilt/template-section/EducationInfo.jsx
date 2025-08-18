
const EducationInfo = ({degree, institution, duration, durationColor}) => {
  return (
    <div>
      <h3 className="text-[15px] font-semibold">{degree}</h3>
      <p className="text-sm font-medium">{institution}</p>
      <p className='text-xs font-bold italic mt-2.5'style={{color: durationColor}}>{duration}</p>
    </div>
  )
}

export const EducationInfo2 = ({degree, institution, duration, durationColor, titleColor}) => {
  return (
    <div>
      <div className='flex items-center justify-between'>
      <h3 className="text-[15px] font-semibold" style={{color:titleColor}}>{degree}</h3>
      <p className='text-xs italic font-bold mt-0.5' style={{color: durationColor}}>{duration}</p>
      </div>
      <p className="text-sm font-medium">{institution}</p>
    </div>
  )
}

export const EducationInfo3 = ({degree, institution, duration, durationColor}) => {
  return (
    <div>
      <div className='flex items-center gap-20'>
      <h3 className="text-[15px] font-semibold">{degree}</h3>
      <p className='text-xs italic font-semibold mt-0.5' style={{color: durationColor}}>{duration}</p>
      </div>
      <p className="text-sm font-medium">{institution}</p>
    </div>
  )
}

export default EducationInfo
