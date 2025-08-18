import { Progress1, Progress2 } from '../resumeSections/Progress';

// skill design - common
const SkillSection = ({skills, accentColor, bgColor}) => {
  return (
    <div className='grid gap-y-1 mb-1'>
      {
        skills?.map((skill, index) => (
          <div            
            key={`skill_${index}`} 
            skills={skill.name} 
            accentColor={accentColor} 
            bgColor={bgColor}
            className='text-[13px] font-medium'
            >
              {skill.name}
          </div>
        ))
      }
    </div>
  )
}

// skill design - 1 
export const SkillsInfo1 = ({skills, progress, accentColor, bgColor}) => {
    const roundedProgress = Math.ceil((progress / 100) * 5);

    return (
        <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">{skills}</p>
            {roundedProgress > 0 && (
                <Progress1 progress={roundedProgress} color={accentColor} bgColor={bgColor} />
            )}
        </div>
    )
}
export const SkillSection1 = ({skills, accentColor, bgColor}) => {
  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-1 mb-1'>
      {
        skills?.map((skill, index) => (
          <SkillsInfo1 
            key={`skill_${index}`} 
            skills={skill.name} 
            progress={skill.progress} 
            accentColor={accentColor} 
            bgColor={bgColor}
          />
        ))
      }
    </div>
  )
}

// skill design - 2
export const SkillsInfo2 = ({skill, bgColor,accentColor }) => {
    return (
        <div className="flex items-center justify-between px-2 rounded py-0.5" style={{backgroundColor: bgColor , color: accentColor}}>
            <p className="text-xs font-medium" >{skill}</p>
        </div>
    )
}
export const SkillSection2 = ({skills, bgColor, accentColor}) => {
  return (
    <div className='flex flex-wrap gap-2'>
      {
        skills?.map((skill, index) => (
          <SkillsInfo2 
            key={`skill_${index}`} 
            skill={skill.name} 
            bgColor={bgColor}
            accentColor={accentColor} 
          />
        ))
      }
    </div>
  )
}

// skill design - 3
export const SkillsInfo3 = ({ skill, bgColor, accentColor, progress }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-sm">{skill}</p>
      {progress > 0 && (
        <Progress2 
          progress={progress} 
          total={100} 
          color={accentColor} 
          bgColor={bgColor} 
        />
      )}
    </div>
  );
};

export const SkillSection3 = ({ skills, bgColor, accentColor }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {skills?.map((skill, index) => (
        <SkillsInfo3
          key={`skill_${index}`}
          skill={skill.name}
          progress={skill.progress} 
          accentColor={accentColor}
          bgColor={bgColor}
        />
      ))}
    </div>
  );
};
export default SkillSection
