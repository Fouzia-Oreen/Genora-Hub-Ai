import { LucideMail, LucideMapPinHouse, LucidePhone, LucideUser } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatYearMonth } from '../../../helper';
import Certifications from '../template-section/Certifications';
import ContactInfo from '../template-section/ContactInfo';
import { EducationInfo2 } from '../template-section/EducationInfo';
import { LanguageSection } from '../template-section/LanguageSection';
import Projects from '../template-section/Projects';
import References from '../template-section/References';
import SkillSection from '../template-section/SkillSection';
import { ToolsSection2 } from '../template-section/ToolsSection';
import { WorkExperience } from '../template-section/WorkExperience';

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#22D3EE" , "#07222c"];
const Title = ({text, color}) => {
  return (
    <div className='relative w-fit mb-2.5'>
      <span className="absolute bottom-0.5 left-0 w-[2px] h-5" style={{backgroundColor : color}}></span>
      <h2 className={`relative font-bold ml-2`}>{text}</h2>
    </div>
  )
}

const TemplateThree = ({resumeData, colorPalette, containerWidth}) => {
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
    <div className="flex items-start gap-5 justify-between mb-5" style={{color: themeColors[4]}}>
      <div>
        <div className="flex flex-col justify-between ">
          <h2 className="text-3xl font-bold ">{resumeData.profileInfo.fullName}</h2>
          <p className="text-[15px] font-semibold my-2 ">{resumeData.profileInfo.designation}</p>
          <div className=" flex gap-5 ">
            <ContactInfo 
                  icon={<LucideMapPinHouse />}
                  iconBG={themeColors[1]}
                  iconColor={themeColors[3]}
                  value={resumeData?.contactInfo?.location}
              />
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
          </div>
        </div>
        </div>
        <div 
        className="w-[100px] h-[100px] max-w-[105px] max-h-[105px] rounded-full flex items-center justify-center" 
        style={{backgroundColor : themeColors[1]}}>
            {resumeData.profileInfo.profilePreviewUrl ? (
                <img src={resumeData.profileInfo.profilePreviewUrl} 
                className='w-[100px] h-[100px] rounded-full' />
            ) : (
                <div 
                    className="w-[100px] h-[100px] rounded-full  flex items-center justify-center text-5xl" 
                    style={{color: themeColors[4]}}><LucideUser size={28}/>
                </div>
            )}
        </div>
    </div>

     <div className="grid grid-cols-12   mt-8" style={{color: themeColors[4]}}>
      <div className="col-span-8 space-y-7">
        <div className=''>
          <Title text="Professional Summary" color={themeColors[3]} />
          <p className='text-sm font-medium pl-2'>{resumeData?.profileInfo?.summary}</p>
        </div>

          {/* Conditional Work Experience Section */}
          {resumeData?.workExperience?.length > 0 && resumeData.workExperience.some(item => item.company?.trim() || item.role?.trim()) && (
            <div >
              <Title text="Work Experience" color={themeColors[3]} />
              {resumeData.workExperience.filter(item => item.company?.trim() || item.role?.trim()).map((data, index) => {
                return (
                  <div className='pl-2'>
                  <WorkExperience
                    key={`work_${index}`}
                    company={data.company}
                    role={data.role}
                    duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                    durationColor={themeColors[3]}
                    description={data.description}
                  />
                  </div>
                );
              })}
            </div>
          )}
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
                  />
                  </div>
                );
              })}
            </div>
          )}
          {/* Education Section */}
          <div >
            <Title text="Education" color={themeColors[3]}/>
            <div className='flex flex-col gap-5 pl-2 '>
            {resumeData?.education?.map((data, index) => (
              <EducationInfo2 
              key={` education ${index}`} 
              degree={data.degree} 
              institution={data.institution} 
              duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
              durationColor={themeColors[3]}
              />
            ))}
            </div>
          </div>
          {/* Conditional Certifications Section */}
          {resumeData?.certifications?.length > 0 && resumeData.certifications.some(item => item.title?.trim() || item.issuer?.trim()) && (
            <div >
              <Title text="Achievements" color={themeColors[3]} />
              <div className='grid grid-cols-2 gap-2 pl-2'>
                {resumeData.certifications.filter(item => item.title?.trim() || item.issuer?.trim()).map((data, index) => {
                  return (
                    <Certifications
                      key={`certificate_${index}`}
                      title={data.title}
                      issuer={data.issuer}
                      year={data.year}
                      bgColor={themeColors[1]}
                    />
                  );
                })}
              </div>
            </div>
          )}
     </div>  

      <div className=' col-span-4 space-y-7 ml-10' >
          {/* Conditional Skills Section */}
          {resumeData?.skills?.length > 0 && resumeData.skills.some(item => item.name?.trim()) && (
            <div className=''>
              <Title text="Skills" color={themeColors[3]} />
              <div className='pl-2'>
              <SkillSection
                skills={resumeData?.skills}
                accentColor={themeColors[3]}
                bgColor={themeColors[1]}
              />
              </div>
            </div>
          )}
          {/* Language Section */}
          <div >
            <Title text="Language" color={themeColors[3]}/>
            <div className="pl-2">
              <LanguageSection 
              languages={resumeData?.languages} 
              accentColor={themeColors[3]} 
              bgColor={themeColors[1]}
              />
            </div>
          </div>
          {/* Conditional Tools Section */}
          {resumeData?.tools?.length > 0 && resumeData.tools.some(item => item.name?.trim()) && (
            <div >
              <Title text="Tools" color={themeColors[3]}/>
              <div className='pl-2'>
              <ToolsSection2
                tools={resumeData?.tools}
                accentColor={themeColors[4]}
                bgColor={themeColors[1]}
              />
              </div>
            </div>
          )}
          {/* Interest Section */}
          { resumeData?.interests?.length > 0 && resumeData.interests[0] != "" && (
            <div >
              <Title text="Interests" color={themeColors[3]} />
              <div className='flex items-center flex-wrap gap-3 mt-4 pl-2'>
              {resumeData?.interests?.map((interest, index) => {
                if (!interest ) return null
                return (
                  <div className="text-[12px] font-semibold " key={`interest_${index}`} >{interest}</div>
                )})}
            </div>
            </div>
          )}
          {/*  Conditional Reference Section  */}
          { resumeData?.references?.length > 0 && resumeData?.references[0] != "" && (
          <div >
            <Title text="References" color={themeColors[3]} />
            <div className='grid pl-2'>
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

export default TemplateThree
