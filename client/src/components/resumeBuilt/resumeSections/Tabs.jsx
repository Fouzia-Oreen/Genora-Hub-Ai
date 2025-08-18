
const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className='my-2 '>
      <div className="flex ">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`relative px-3 md:px-4 py-2  font-semibold transition-colors duration-200 
              ${activeTab === tab.label 
                ? "text-color_5 underline" 
                : "text-color_5/60 hover:text-color_5/60"
              } 
              focus:outline-none`}
            onClick={() => setActiveTab(tab.label)}
          >
            <div className="flex items-center">
              <span>{tab.label}</span>
            </div>
            {activeTab === tab.label && (
              <div className='absolute bottom-0 left-0  h-0.5 bg-color_5 rounded-t-lg'></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;