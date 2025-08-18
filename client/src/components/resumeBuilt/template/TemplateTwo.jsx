import { LucideMail, LucideMapPinHouse, LucidePhone, LucideUser } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatYearMonth } from '../../../helper';
import ContactInfo from '../template-section/ContactInfo';
import { EducationInfo2 } from '../template-section/EducationInfo';
import { LanguageSection } from '../template-section/LanguageSection';
import Projects from '../template-section/Projects';
import { References1 } from '../template-section/References';
import SkillSection from '../template-section/SkillSection';
import { ToolsSection2 } from '../template-section/ToolsSection';
import { WorkExperience1 } from '../template-section/WorkExperience';

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#22D3EE" , "#07222c"];
const DEFAULT_THEME2 = ["#E0E7FF", "#A3B3FF", "#8C9FCF ", "#456FD9" , "#4B4B5C"];

const Title = ({text}) => {
  return (
    <h2 className="w-fit mb-2.5 font-semibold text-[17px] uppercase">{text}</h2>
  )
}

const TemplateTwo = ({resumeData, colorPalette, containerWidth}) => {


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
    className='p-12 bg-white ' 
    style={{
      transform: containerWidth > 0 ? `scale ${scale}` : "none" ,
      transformOrigin: "top left",
      width : containerWidth > 0 ? ` ${baseWidth}px` : "auto",
      height : "auto"
    }}
    >
    <div className="flex items-start justify-between  mb-12"  style={{color: themeColors[4]}}>
      <div className='flex gap-6 items-center'>
        <div 
        className="w-[100px] h-[100px] max-w-[110px] max-h-[110px] rounded-2xl flex items-center justify-center" 
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
        <div className="">
          <h2 className="text-3xl font-semibold ">{resumeData.profileInfo.fullName}</h2>
          <p className="text-lg  mb-2 ">{resumeData.profileInfo.designation}</p>
        </div>
        </div>
        <div className=" flex flex-col my-2 justify-between  gap-3">
            <ContactInfo 
                icon={<LucideMail />}
                iconBG={themeColors[1]}
                iconColor={themeColors[3]}
                value={resumeData?.contactInfo?.email}
            />
            <ContactInfo 
                icon={<LucidePhone />}
                iconBG={themeColors[1]}
                iconColor={themeColors[3]}
                value={resumeData?.contactInfo?.phone}
            />
            <ContactInfo 
                icon={<LucideMapPinHouse />}
                iconBG={themeColors[1]}
                iconColor={themeColors[3]}
                value={resumeData?.contactInfo?.location}
            />
        </div>
    </div>

     <div className="grid grid-cols-7 " style={{color: themeColors[4]}}>
      <div className=' col-span-2 space-y-8'>
          {/* summary */}
          <div className="">
            <Title text="Meet Me" color={themeColors[1]}/>
            <h1 className='text-sm '>{resumeData.profileInfo.summary}</h1>
          </div>
          {/* Conditional Skills Section */}
          {resumeData?.skills?.length > 0 && resumeData.skills.some(item => item.name?.trim()) && (
            <div className=''>
              <Title text="Skills" color={themeColors[1]} />
              <div className='pl-1'>
              <SkillSection
                skills={resumeData?.skills}
                accentColor={themeColors[3]}
                bgColor={themeColors[1]}
              />
              </div>
            </div>
          )}
          {/* Conditional Tools Section */}
          {resumeData?.tools?.length > 0 && resumeData.tools.some(item => item.name?.trim()) && (
            <div >
              <Title text="Tools" color={themeColors[1]}/>
              <div className='pl-1'>
              <ToolsSection2
                tools={resumeData?.tools}
                accentColor={themeColors[4]}
                bgColor={themeColors[1]}
              />
              </div>
            </div>
          )}
          {/* Language Section */}
          <div >
            <Title text="Language" color={themeColors[1]}/>
            <div className="pl-1">
              <LanguageSection 
              languages={resumeData?.languages} 
              accentColor={themeColors[3]} 
              bgColor={themeColors[1]}
              />
            </div>
          </div>
          {/* Interest Section */}
          { resumeData?.interests?.length > 0 && resumeData.interests[0] != "" && (
            <div >
              <Title text="Interests" color={themeColors[1]} />
              <div className='flex items-center flex-wrap gap-3 mt-4 pl-1'>
              {resumeData?.interests?.map((interest, index) => {
                if (!interest ) return null
                return (
                  <div className="text-[13px] font-semibold " key={`interest_${index}`} >{interest}</div>
                )})}
            </div>
            </div>
          )}
      </div>

      <div className="col-span-5 ml-8  space-y-8 ">
        {/* Education Section */}
        <div >
          <Title text="Education" color={themeColors[1]}/>
          <div className='flex flex-col gap-5 pl-2 '>
          {resumeData?.education?.map((data, index) => (
            <EducationInfo2 
            key={` education ${index}`} 
            degree={data.degree} 
            institution={data.institution} 
            duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
            durationColor={themeColors[4]}
            titleColor={themeColors[3]}
            />
          ))}
          </div>
        </div>
        {/* Conditional Projects Section */}
        {resumeData?.projects?.length > 0 && resumeData.projects.some(item => item.title?.trim() || item.description?.trim()) && (
          <div >
            <Title text="Recent Projects" color={themeColors[3]} />
            {resumeData.projects.filter(item => item.title?.trim() || item.description?.trim()).map((data, index) => {
              return (
                <div className='pl-2'>
                <Projects
                  key={`project_${index}`}
                  title={data.title}
                  description={data.description}
                  githubLink={data.github}
                  liveDemoUrl={data.liveDemo}
                  bgColor={themeColors[1]}
                  iconColor={themeColors[3]}
                  titleColor={themeColors[3]}
                />
                </div>
              );
            })}
          </div>
        )}
        {/* Conditional Work Experience Section */}
        {resumeData?.workExperience?.length > 0 && resumeData.workExperience.some(item => item.company?.trim() || item.role?.trim()) && (
          <div >
            <Title text="Work Experience" color={themeColors[3]} />
            {resumeData.workExperience.filter(item => item.company?.trim() || item.role?.trim()).map((data, index) => {
              return (
                <div className='pl-2'>
                <WorkExperience1
                  key={`work_${index}`}
                  company={data.company}
                  role={data.role}
                  duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                  durationColor={themeColors[4]}
                  description={data.description}
                  titleColor={themeColors[3]}
                  lineColor={themeColors[3]}
                />
                </div>
              );
            })}
          </div>
        )}
        {/* reference */}
        { resumeData?.references?.length > 0 && resumeData?.references[0] != "" && (
        <div className=''>
          <Title text="References" color={themeColors[1]} />
          <div className='grid  gap-2'>
          {resumeData?.references?.map((data, index) => {
            return (
              <References1
                key={`reference_${index}`}
                title={data.name}
                designation={data.designation}
                company={data.company}
                phone={data.phone}
                email={data.email}
                bgColor={themeColors[1]}
                lineColor={themeColors[3]}
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


export default TemplateTwo
