
export const Progress1 = ({ progress = 0, total = 5, color, bgColor }) => (
  <div className='flex gap-1.5'>
    {[...Array(total)].map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full transition-all`}
        style={{
          backgroundColor: index < progress ? color || "rgba(1,1,1,1)" : bgColor || "rgba(1,1,1,0.1)"
        }}
      ></div>
    ))}
  </div>
);

export const Progress2 = ({ progress = 0, total = 100, color, bgColor }) => {
  const percentage = Math.min((progress / total) * 100, 100);

  return (
    <div className="flex items-center gap-2 w-[100px]">
      <div className="flex w-full h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: bgColor }}>
        <div
          className="h-full transition-all rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
      <p className="text-xs font-semibold">{percentage.toFixed(0)}%</p>
    </div>
  );
};