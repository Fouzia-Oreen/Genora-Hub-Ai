
const StepProgress = ({progress}) => {
  return (
    <div className='w-full bg-color_6/20 overflow-hidden rounded-full'>
      <div 
        className="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-all rounded-full" 
        style={{width:`${progress}%`}}>
      </div>
    </div>
  )
}

export default StepProgress;
