import { Progress1, Progress2 } from '../resumeSections/Progress';

// language design - common
export const LanguageSection = ({languages, accentColor, bgColor}) => {
  return (
    <div className='grid gap-y-1 mb-1'>
      {
        languages?.map((language, index) => (
          <div            
            key={`skill_${index}`} 
            languages={language.name} 
            accentColor={accentColor} 
            bgColor={bgColor}
            className='text-[13px] font-medium'
            >
              {language.name}
          </div>
        ))
      }
    </div>
  )
}

// language design - 1
export const LanguageInfo1 = ({language, progress, accentColor, bgColor}) => {
    const roundedProgress = Math.ceil((progress / 100) * 5);

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm">{language}</p>
            {roundedProgress > 0 && (
                <Progress1 progress={roundedProgress} color={accentColor} bgColor={bgColor} />
            )}
        </div>
    )
}
export const LanguageSection1 = ({languages, accentColor, bgColor}) => {
  return (
    <div className='flex flex-col gap-2'>
      {
        languages?.map((language, index) => (
          <LanguageInfo1 
            key={`language_${index}`} 
            language={language.name} 
            progress={language.progress} 
            accentColor={accentColor} 
            bgColor={bgColor}
          />
        ))
      }
    </div>
  )
}

// language design - 2
export const LanguageInfo2 = ({language, bgColor,accentColor }) => {
    return (
        <div className="flex items-center justify-between px-2 rounded py-0.5" style={{backgroundColor: bgColor , color: accentColor}}>
            <p className="text-xs font-medium" >{language}</p>
        </div>
    )
}
export const LanguageSection2 = ({languages, bgColor, accentColor}) => {
  return (
    <div className='flex flex-wrap gap-2'>
      {
        languages?.map((language, index) => (
          <LanguageInfo2 
            key={`language_${index}`} 
            language={language.name} 
            bgColor={bgColor}
            accentColor={accentColor} 
          />
        ))
      }
    </div>
  )
}

// language design - 3
export const LanguageInfo3 = ({ language, bgColor, accentColor, progress }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-sm">{language}</p>
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
export const LanguageSection3 = ({ languages, bgColor, accentColor }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {languages?.map((language, index) => (
        <LanguageInfo3
          key={`language_${index}`}
          language={language.name}
          progress={language.progress} // expects 0–100 now
          accentColor={accentColor}
          bgColor={bgColor}
        />
      ))}
    </div>
  );
};