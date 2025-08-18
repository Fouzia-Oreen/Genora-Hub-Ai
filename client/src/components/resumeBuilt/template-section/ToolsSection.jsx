import { Progress1, Progress2 } from '../resumeSections/Progress';

// tools design - common
export const ToolsSection = ({tools, accentColor, bgColor}) => {
  return (
    <div className='grid gap-y-1 mb-1'>
      {
        tools?.map((tool, index) => (
          <div            
            key={`tool_${index}`} 
            languages={tool.name} 
            accentColor={accentColor} 
            bgColor={bgColor}
            className='text-[12px] font-semibold'
            >
              {tool.name}
          </div>
        ))
      }
    </div>
  )
}

// tools design - 2
export const ToolsInfo1 = ({toolName, progress, accentColor, bgColor}) => {
    const roundedProgress = Math.ceil((progress / 100) * 5);

    return (
        <div className="flex items-center justify-between">
            {/* Using the new `toolName` prop */}
            <p className="text-sm">{toolName}</p>
            {roundedProgress > 0 && (
                <Progress1 progress={roundedProgress} color={accentColor} bgColor={bgColor} />
            )}
        </div>
    )
}
export const ToolsSection1 = ({tools, accentColor, bgColor}) => {
  return (
    <div className='flex flex-col gap-2'>
      {
        tools?.map((tool, index) => (
          <ToolsInfo1
            key={`tool_${index}`}
            toolName={tool.name} 
            progress={tool.progress}
            accentColor={accentColor}
            bgColor={bgColor}
          />
        ))
      }
    </div>
  )
}

// tools design - 2
export const ToolsInfo2 = ({toolName, bgColor,accentColor }) => {
    return (
        <div className="flex items-center justify-between px-2 rounded py-0.5" style={{backgroundColor: bgColor , color: accentColor}}>
            <p className="text-[13px] font-medium" >{toolName}</p>
        </div>
    )
}
export const ToolsSection2 = ({tools, bgColor, accentColor}) => {
  return (
    <div className='flex flex-wrap gap-2'>
      {
        tools?.map((tool, index) => (
        <ToolsInfo2 
          key={`tools_${index}`} 
          toolName={tool.name} 
          bgColor={bgColor}
          accentColor={accentColor} 
        />
        ))
      }
    </div>
  )
}

// tools design - 3
export const ToolsInfo3 = ({ toolName, bgColor, accentColor, progress }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-sm">{toolName}</p>
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
export const ToolsSection3 = ({ tools, bgColor, accentColor }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {tools?.map((tool, index) => (
      <ToolsInfo3
        key={`tool_${index}`}
        toolName={tool.name} 
        progress={tool.progress} 
        accentColor={accentColor}
        bgColor={bgColor}
      />
      ))}
    </div>
  );
};

