import { LucideGithub, LucidePhone } from 'lucide-react';
import ActionLink from '../resumeSections/ActionLink';

const References = ({ title, designation, company, phone, email, bgColor,iconColor }) => {
  return (
    <div className={`flex flex-col justify-between border-r-[1px] pr-2  `}>
      <div className="">
        <h3 className={`text-[15px] font-semibold`}>{title}</h3>
        <p className='text-[13px] '><strong className='font-medium'>{designation}</strong>, {company}</p>
      </div>
      <div>
        <div className='flex flex-col gap-1 mt-2'>
          {email && <ActionLink icon={<LucideGithub />} link={email} bgColor={bgColor} iconColor={iconColor}/>}
          {phone && <ActionLink icon={<LucidePhone />} link={phone} bgColor={bgColor} iconColor={iconColor}/>}
        </div>
      </div>
    </div>
  );
}
export const References1 = ({ title, designation, company, phone, email, bgColor,iconColor, lineColor }) => {
  return (
    <div className={`flex flex-col justify-between border-r-[1px] pr-2  `}>
      <div className="flex items-center gap-1.5">
        <h3 className="text-[15px] font-semibold">{title}</h3>
        <div className="w-[2px] h-[18px] " style={{backgroundColor:lineColor}}></div>
        <p className='text-[13px] '><strong className='font-medium'>{designation}</strong>, {company}</p>
      </div>
      <div>
        <div className='flex gap-6 mt-2'>
          {email && <ActionLink icon={<LucideGithub />} link={email} bgColor={bgColor} iconColor={iconColor}/>}
          {phone && <ActionLink icon={<LucidePhone />} link={phone} bgColor={bgColor} iconColor={iconColor}/>}
        </div>
      </div>
    </div>
  );
}
export default References;