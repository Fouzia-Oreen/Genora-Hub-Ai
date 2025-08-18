
const ContactInfo = ({icon,iconBG,value, iconColor}) => {
  return (
    <div className='flex items-center gap-3'>
        <div className="w-[20px] h-[20px]  flex items-center p-[3px] rounded-full" style={{backgroundColor : iconBG , color: iconColor}}>{icon}</div>
        <p className='flex-1 font-medium text-[12px] break-all'>{value}</p>
    </div>
  )
}

export default ContactInfo
