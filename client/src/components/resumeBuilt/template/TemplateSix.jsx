import { LucideMail, LucideMapPinHouse, LucidePhone, LucideUser } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatYearMonth } from '../../../helper';
import { Certifications1 } from '../template-section/Certifications';
import ContactInfo from '../template-section/ContactInfo';
import EducationInfo from '../template-section/EducationInfo';
import { LanguageSection1 } from '../template-section/LanguageSection';
import Projects from '../template-section/Projects';
import References from '../template-section/References';
import { SkillSection1 } from '../template-section/SkillSection';
import { ToolsSection2 } from '../template-section/ToolsSection';
import { WorkExperience } from '../template-section/WorkExperience';

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#22D3EE" , "#07222c"];
const Title = ({text, color}) => {
  return (
    <div className='relative w-fit mb-2'>
      <span className="absolute bottom-[2px] -left-2 w-[2px] h-5" style={{backgroundColor : color}}></span>
      <h2 className={`relative font-bold`}>{text}</h2>
    </div>
  )
}

const TemplateSix = ({resumeData, colorPalette, containerWidth}) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

  const resumeRef = useRef(null)
  const [baseWidth, setBaseWidth] = useState(800) 
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const actualBasedWidth = resumeRef.current.offsetWidth;
    setBaseWidth(actualBasedWidth);
    setScale(containerWidth / baseWidth);
  }, [containerWidth, baseWidth, scale ])
  

  return (
    <div 
    ref={resumeRef} 
    className='p-12 bg-white' 
    style={{
      transform: containerWidth > 0 ? `scale ${scale}` : "none" ,
      transformOrigin: "top left",
      width : containerWidth > 0 ? ` ${baseWidth}px` : "auto",
      height : "auto"
    }}
    >
    <div className="flex items-center justify-between mb-16"  style={{color: themeColors[4]}}>
      <div className="flex gap-8 items-center">
        <div 
        className="w-[100px] h-[100px] max-w-[105px] max-h-[105px] rounded-2xl flex items-center justify-center" 
        style={{backgroundColor : themeColors[1]}}>
            {resumeData.profileInfo.profilePreviewUrl ? (
                <img src={resumeData.profileInfo.profilePreviewUrl} 
                className='w-[100px] h-[100px] rounded-2xl' />
            ) : (
                <div 
                    className="w-[100px] h-[100px] rounded-2xl  flex items-center justify-center text-5xl" 
                    style={{color: themeColors[3]}}><LucideUser size={28}/>
                </div>
            )}
        </div>
        <div>
            <h2 className="text-3xl font-semibold ">{resumeData.profileInfo.fullName}</h2>
            <p className="text-lg  mb-2 ">{resumeData.profileInfo.designation}</p>
            <ContactInfo 
              icon={<LucidePhone />}
              iconBG={themeColors[1]}
              iconColor={themeColors[3]}
              value={resumeData?.contactInfo?.phone}
            />
        </div>
      </div>
      <div className=" flex flex-col justify-between gap-3 ">
          <ContactInfo 
              icon={<LucideMail />}
              iconBG={themeColors[1]}
              iconColor={themeColors[3]}
              value={resumeData?.contactInfo?.email}
          />
          <ContactInfo 
              icon={<LucideMapPinHouse />}
              iconBG={themeColors[1]}
              iconColor={themeColors[3]}
              value={resumeData?.contactInfo?.location}
          />
      </div>
    </div>

     <div className="grid grid-cols-12 gap-16" style={{color: themeColors[4]}}>
        <div className="space-y-8 col-span-4">
        <div>
        <Title text="Education" color={themeColors[3]}/>
        <div className="flex flex-col gap-4">
        {resumeData?.education?.map((data, index) => (
            <EducationInfo key={` education ${index}`} degree={data.degree} institution={data.institution} duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}/>
        ))}
        </div>
        </div>
        {/* Languages */}
        { resumeData?.languages?.length > 0 && resumeData?.languages[0] != "" && (
        <div className="">
        <Title text="Language" color={themeColors[3]}/>
            <LanguageSection1 
            languages={resumeData?.languages} 
            accentColor={themeColors[3]} 
            bgColor={themeColors[1]}
            />
        </div>
        )}
        {/* interests */}
        { resumeData?.interests?.length > 0 && resumeData.interests[0] != "" && (
          <div className=''>
            <Title text="Interests" color={themeColors[3]} />
            <div className='flex items-center flex-wrap gap-3 mt-4'>
            {resumeData?.interests?.map((interest, index) => {
              if (!interest ) return null
              return (
                <div className="text-[13px] font-medium px-3 py-0.5 rounded" key={`interest_${index}`} style={{backgroundColor : themeColors[1]}}>{interest}</div>
              )})}
          </div>
          </div>
        )}
        {/* Tools Section */}
        {resumeData?.tools?.length > 0 && resumeData.tools.some(t => t.name?.trim()) && (
          <div>
            <Title text="Tools" color={themeColors[3]} />
              <ToolsSection2
                  tools={resumeData.tools}
                  accentColor={themeColors[4]}
                  bgColor={themeColors[1]}
                />
          </div>
        )}
        {/* Certifications */}
        { resumeData?.certifications?.length > 0 && resumeData?.certifications[0] != "" && (
        <div className=''>
          <Title text="Achievements" color={themeColors[3]} />
          <div className='grid grid-cols-1 gap-2'>
          {resumeData?.certifications?.map((data, index) => {
            return (
              <Certifications1
                key={`certificate_${index}`}
                title={data.title}
                issuer={data.issuer}
                year={data.year}
                bgColor={themeColors[3]}
              />
            );
          })}
          </div>
        </div>
        )}
        </div>
        <div className="col-span-8  space-y-8">
          <div>
            <Title text="Professional Summary" color={themeColors[3]} />
            <p className='text-sm font-medium'>{resumeData?.profileInfo?.summary}</p>
          </div>
          {/* Work Experience */}
          { resumeData?.workExperience?.length > 0 && resumeData?.workExperience[0] != "" && (
          <div >
            <Title text="Work Experience" color={themeColors[3]} />
            {resumeData?.workExperience?.map((data, index) => {
              return (
                <WorkExperience
                  key={`work_${index}`}
                  company={data.company}
                  role={data.role}
                  duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                  durationColor={themeColors[3]}
                  description={data.description}
                />
              );
            })}
          </div>
          )}
          {/* Projects */}
          { resumeData?.projects?.length > 0 && resumeData?.projects[0] != "" && (
          <div >
            <Title text="Projects" color={themeColors[3]} />
            {resumeData?.projects.map((data, index) => {
              return (
                <Projects
                  key={`project_${index}`}
                  title={data.title}
                  description={data.description}
                  githubLink={data.github}
                  liveDemoUrl={data.liveDemo}
                  bgColor={themeColors[1]}
                  iconColor={themeColors[3]}
                />
              );
            })}
          </div>
          )}
          {/* Skills */}
          { resumeData?.skills?.length > 0 && resumeData?.skills[0] != "" && (
          <div >
            <Title text="Skills" color={themeColors[3]} />
            <div className="">
            <SkillSection1 
            skills={resumeData?.skills} 
            accentColor={themeColors[3]} 
            bgColor={themeColors[1]}
            />
            </div>
          </div>
          )}
          {/* reference */}
          { resumeData?.references?.length > 0 && resumeData?.references[0] != "" && (
          <div className=''>
            <Title text="References" color={themeColors[3]} />
            <div className='grid grid-cols-2 gap-2'>
            {resumeData?.references?.map((data, index) => {
              return (
                <References
                  key={`reference_${index}`}
                  title={data.name}
                  designation={data.designation}
                  company={data.company}
                  phone={data.phone}
                  email={data.email}
                  bgColor={themeColors[1]}
                  iconColor={themeColors[3]}
                />
              );
            })}
            </div>
          </div>
          )}
        </div>  
     </div>   
    </div>
  )
}

export default TemplateSix
