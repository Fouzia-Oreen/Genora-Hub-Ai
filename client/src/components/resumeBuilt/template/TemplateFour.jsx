import { LucideMail, LucideMapPinHouse, LucidePhone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatYearMonth } from '../../../helper';
import Certifications from '../template-section/Certifications';
import ContactInfo from '../template-section/ContactInfo';
import { EducationInfo2 } from '../template-section/EducationInfo';
import { LanguageSection1 } from '../template-section/LanguageSection';
import Projects from '../template-section/Projects';
import References from '../template-section/References';
import { SkillSection1 } from '../template-section/SkillSection';
import { ToolsSection2 } from '../template-section/ToolsSection';
import { WorkExperience } from '../template-section/WorkExperience';

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#22D3EE" , "#07222c"];
const Title = ({text, color}) => {
  return (
    <div className=' w-fit mb-2'>
      <h3 className=" font-bold uppercase tracking-wide" style={{color : color}}>
          {text}
        </h3>
    </div>
  )
}
const TemplateFour = ({resumeData, colorPalette, containerWidth}) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
  const resumeRef = useRef(null)
  const [baseWidth, setBaseWidth] = useState(800) 
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const actualBasedWidth = resumeRef.current?.offsetWidth;
    setBaseWidth(actualBasedWidth);
    setScale(containerWidth / baseWidth);
  }, [containerWidth, baseWidth, scale ])
  

  return (
    <div className='p-12  bg-white'     
    style={{
      transform: containerWidth > 0 ? `scale ${scale}` : "none" ,
      transformOrigin: "top left",
      width : containerWidth > 0 ? ` ${baseWidth}px` : "auto",
      height : "auto",
      color : themeColors[4]
    }}>
      <div className=" " style={{color:themeColors[4]}}>
        {/* Header Section */}
        <div className="flex items-center justify-between ">
          <h1 className=" text-2xl uppercase tracking-wide font-semibold" style={{color:themeColors[4]}}>
            {resumeData.profileInfo.fullName}
          </h1>
          <h2 className="text-lg tracking-widest uppercase" style={{color:themeColors[4]}}>
            {resumeData.profileInfo.designation}
          </h2>
        </div>

        {/* About Me Section */}
        <div className="my-6">
          <Title text="About Me" color={themeColors[3]}/>
          <p className="text-sm leading-relaxed" style={{color:themeColors[4]}}>
            {resumeData.profileInfo.summary}
          </p>
        </div>

        {/* Divider Line */}
        <div
        className="h-[1px] mb-8 w-[98%] mx-auto"
        style={{backgroundColor:themeColors[3]}}></div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="col-span-1 space-y-8 ">
            {/* Contact*/}
            <div>
              <Title text="Contact" color={themeColors[3]}/>
              <div className="space-y-4">
                <div className=" gap-[6px] flex flex-col ">
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
            {/* Conditional Language Section */}
            {resumeData?.languages?.length > 0 && resumeData.languages.some(item => item.name?.trim()) && (
              <div>
                <Title text="Language" color={themeColors[3]} />
                <LanguageSection1
                    languages={resumeData.languages}
                    accentColor={themeColors[3]}
                    bgColor={themeColors[1]}
                  />
              </div>
            )}
            {/* Tools Section */}
            {resumeData?.tools?.length > 0 && resumeData.tools.some(t => t.name?.trim()) && (
              <div>
                <Title text="Tools" color={themeColors[3]} />
                  <ToolsSection2
                      tools={resumeData.tools}
                      accentColor={themeColors[3]}
                      bgColor={themeColors[1]}
                    />
              </div>
            )}
            {/* Certifications */}
            { resumeData?.certifications?.length > 0 && resumeData?.certifications[0] != "" && (
            <div>
              <Title text="Achievements" color={themeColors[3]}/>
              <div className='grid grid-cols-1 gap-6'>
              {resumeData?.certifications?.map((data, index) => {
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
            {/* References */}
            { resumeData?.references?.length > 0 && resumeData?.references[0] != "" && (
            <div >
              <Title text="References" color={themeColors[3]}/>
              <div className='grid gap-2'>
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

          {/* Right Column */}
          <div className="col-span-2 space-y-8">
            {/* Education */}
            <div >
              <Title text="Education" color={themeColors[3]}/>
              <div className='grid  gap-6'>
              {resumeData?.education?.map((data, index) => (
                <EducationInfo2
                key={` education ${index}`}
                degree={data.degree}
                institution={data.institution}
                duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                durationColor={themeColors[2]}
                />
              ))}
              </div>
            </div>
            {/* Work Experience */}
            <div>
              <Title text="Work Experience" color={themeColors[3]}/>
              {resumeData?.workExperience?.map((data, index) => {
                return (
                  <WorkExperience
                    key={`work_${index}`}
                    company={data.company}
                    role={data.role}
                    duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                    durationColor={themeColors[2]}
                    description={data.description}
                  />
                );
              })}
            </div>
            {/* Projects */}
            <div>
              <Title text="Projects" color={themeColors[3]}/>
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
            {/* Skills */}
            <div >
            <Title text="Skills" color={themeColors[3]}/>
               <SkillSection1
                skills={resumeData.skills}
                accentColor={themeColors[3]}
                bgColor={themeColors[1]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateFour
