import { LucideGithub, LucideGlobe, LucideLinkedin, LucideMail, LucideMapPinHouse, LucidePhone, LucideUser } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatYearMonth } from '../../../helper';
import Certifications from '../template-section/Certifications';
import ContactInfo from '../template-section/ContactInfo';
import EducationInfo from '../template-section/EducationInfo';
import { LanguageSection1 } from '../template-section/LanguageSection';
import Projects from '../template-section/Projects';
import References from '../template-section/References';
import SkillSection from '../template-section/SkillSection';
import { ToolsSection1 } from '../template-section/ToolsSection';
import { WorkExperience } from '../template-section/WorkExperience';

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#22D3EE" , "#07222c"];
const DEFAULT_THEME2 = ["#E0E7FF", "#A3B3FF", "#8C9FCF ", "#456FD9" , "#4B4B5C"];


const Title = ({text, color}) => {
  return (
    <div className=' w-fit mb-1'>
      <h2 className={`font-semibold text-lg`} style={{color : color}}>{text}</h2>
    </div>
  )
}

const TemplateOne = ({resumeData, colorPalette, containerWidth}) => {

  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME2;
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
    className='p-12  bg-white'
    style={{
      transform: containerWidth > 0 ? `scale ${scale}` : "none" ,
      transformOrigin: "top left",
      width : containerWidth > 0 ? ` ${baseWidth}px` : "auto",
      height : "auto",
      color : themeColors[4]
    }}
    >
      <div className=''>
        {/* image & summary */}
      <div className=' grid grid-cols-5 items-center '>
        <div className=' col-span-4 '>
          <div className='h-[3px] w-20  rounded-full my-3 ml-2' style={{backgroundColor: themeColors[3]}}></div>
          <h1 className='text-2xl font-bold'>{resumeData?.profileInfo?.fullName}</h1>
          <p className='text-sm mt-2 '>{resumeData?.profileInfo?.summary}</p>
        </div>
        <div className='col-span-1  flex items-end justify-end'>
          <div className="w-[100px] h-[100px] max-w-[110px] max-h-[110px] rounded-full flex items-center justify-center  " style={{backgroundColor: themeColors[1]}}>
            {resumeData?.profileInfo?.profilePreviewUrl ? (
              <img src={resumeData.profileInfo.profilePreviewUrl} alt="" className='w-[90px] h-[90px] rounded-full'/>
              ) : (
                <div className='[90px] h-[90px] flex items-center justify-center text-5xl rounded-full' style={{color: themeColors[4]}}> <LucideUser /> </div>
              )
            }
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-8   ">
        <div className=' col-span-4  py-5 mt-6' >
          <div className="space-y-7">
            <div className="flex flex-col space-y-3">
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
              {resumeData?.contactInfo?.linkedIn &&
              <ContactInfo
                icon={<LucideLinkedin />}
                iconBG={themeColors[1]}
                iconColor={themeColors[3]}
                value={resumeData?.contactInfo?.linkedIn}
              />}
              {resumeData?.contactInfo?.github &&
              <ContactInfo
                icon={<LucideGithub />}
                iconBG={themeColors[1]}
                iconColor={themeColors[3]}
                value={resumeData?.contactInfo?.github}
              />}
              {resumeData?.contactInfo?.website &&
              <ContactInfo
                icon={<LucideGlobe />}
                iconBG={themeColors[1]}
                iconColor={themeColors[3]}
                value={resumeData?.contactInfo?.website}
              />}
            </div>
            {/* Conditional Education Section */}
            {resumeData?.education?.length > 0 && resumeData.education.some(item => item.degree?.trim() || item.institution?.trim()) && (
              <div>
                <Title text="Education" color={themeColors[3]}/>
                <div  className='flex flex-col gap-2'>
                {resumeData.education.filter(item => item.degree?.trim() || item.institution?.trim()).map((data, index) => (
                  <EducationInfo 
                  key={`education_${index}`} 
                  degree={data.degree} 
                  institution={data.institution} 
                  duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                  />
                ))}
                </div>
              </div>
            )}
            {/* Conditional Language Section */}
            {resumeData?.languages?.length > 0 && resumeData.languages.some(item => item.name?.trim()) && (
              <div>
                <Title text="Language" color={themeColors[3]}/>
                  <LanguageSection1
                  languages={resumeData?.languages}
                  accentColor={themeColors[3]}
                  bgColor={themeColors[1]}
                  />
              </div>
            )}
            
            {/* Conditional Tools Section */}
            {resumeData?.tools?.length > 0 && resumeData.tools.some(item => item.name?.trim()) && (
              <div >
                <Title text="Tools" color={themeColors[3]}/>
                <ToolsSection1
                  tools={resumeData?.tools}
                  accentColor={themeColors[3]}
                  bgColor={themeColors[1]}
                />
              </div>
            )}
          </div>
        </div>

        <div className="col-span-8 space-y-7 py-5">

          {/* Conditional Work Experience Section */}
          {resumeData?.workExperience?.length > 0 && resumeData.workExperience.some(item => item.company?.trim() || item.role?.trim()) && (
            <div className='mt-5'>
              <Title text="Work Experience" color={themeColors[3]} />
              {resumeData.workExperience.filter(item => item.company?.trim() || item.role?.trim()).map((data, index) => {
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

          {/* Conditional Projects Section */}
          {resumeData?.projects?.length > 0 && resumeData.projects.some(item => item.title?.trim() || item.description?.trim()) && (
            <div className='mt-5'>
              <Title text="Recent Projects" color={themeColors[3]} />
              {resumeData.projects.filter(item => item.title?.trim() || item.description?.trim()).map((data, index) => {
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

          {/* Conditional Skills Section */}
          {resumeData?.skills?.length > 0 && resumeData.skills.some(item => item.name?.trim()) && (
            <div className=''>
              <Title text="Skills" color={themeColors[3]} />
              <SkillSection
                skills={resumeData?.skills}
                accentColor={themeColors[3]}
                bgColor={themeColors[1]}
              />
            </div>
          )}

          {/* Conditional Certifications Section */}
          {resumeData?.certifications?.length > 0 && resumeData.certifications.some(item => item.title?.trim() || item.issuer?.trim()) && (
            <div className='mt-5'>
              <Title text="Achievements" color={themeColors[3]} />
              <div className='grid grid-cols-2 gap-2'>
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

          {/* Conditional Interests Section */}
          {resumeData?.interests?.length > 0 && resumeData.interests.some(item => item?.trim()) && (
            <div className='mt-5'>
              <Title text="Interests" color={themeColors[3]} />
              <div className='flex items-center flex-wrap gap-3'>
                {resumeData.interests.filter(item => item?.trim()).map((interest, index) => {
                  return (
                    <div className="text-[14px] font-semibold px-3 py-0.5 rounded" key={`interest_${index}`} style={{backgroundColor : themeColors[1]}}>{interest}</div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Conditional References Section */}
          {resumeData?.references?.length > 0 && resumeData.references.some(item => item.name?.trim() || item.designation?.trim()) && (
            <div className='mt-5'>
              <Title text="References" color={themeColors[3]} />
              <div className='grid grid-cols-2 gap-2'>
                {resumeData.references.filter(item => item.name?.trim() || item.designation?.trim()).map((data, index) => {
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
    </div>
  )
}


export default TemplateOne
