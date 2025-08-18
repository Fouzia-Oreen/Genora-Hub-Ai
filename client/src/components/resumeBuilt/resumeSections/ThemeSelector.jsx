import { LucideCircleCheckBig } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DUMMY_RESUME_DATA, resumeTemplates, themeColorPalette } from '../../../assets/assets'
import RenderResume from '../template/RenderResume'
import ColorPalettesCard from './ColorPalettesCard'
import Tabs from './Tabs'
import TemplateCard from './TemplateCard'

const TAB_DATA = [{label: "Templates"}, {label : "Color Palettes"}]

export const ThemeSelector = ({ selectedTheme, setSelectedTheme, resumeData, onClose }) => {
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [tabValue, setTabValue] = useState("Templates");
  const [selectedColorPalette, setSelectedColorPalette] = useState({
    colors: selectedTheme?.colorPalette,
    index: -1,
  });
  const [selectedTemplate, setSelectedTemplate] = useState({
    theme: selectedTheme?.theme || "",
    index: -1,
  });

  const handleThemeSelection = () => {
    setSelectedTheme({
      colorPalette: selectedColorPalette?.colors,
      theme: selectedTemplate?.theme,
    });
    onClose();
  };

  useEffect(() => {
    const updateWidth = () => {
      if (resumeRef.current) setBaseWidth(resumeRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 mt-2">
        <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />
        <button
          className="flex items-center justify-center gap-2  btn-add"
          onClick={handleThemeSelection}
        >
          <LucideCircleCheckBig  size={18} /> Done
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 xl:h-[63vh]">
        {/* Left: Template / Palette Selection */}
        <div className="col-span-5 overflow-y-auto hide-scrollbar pr-2 h-full">
          <div className="grid md:grid-cols-2 gap-5">
            {tabValue === "Templates" &&
              resumeTemplates.map((template, index) => (
                <TemplateCard
                  key={`templates_${index}`}
                  thumbnailImg={template?.thumbnailImg}
                  isSelected={selectedTemplate?.index === index}
                  onSelect={() => setSelectedTemplate({ theme: template.id, index })}
                />
              ))}

            {tabValue === "Color Palettes" &&
              themeColorPalette.themeOne.map((colors, index) => (
                <ColorPalettesCard
                  key={`colors_${index}`}
                  colors={colors}
                  isSelected={selectedColorPalette?.index === index}
                  onSelect={() => setSelectedColorPalette({ colors, index })}
                />
              ))}
          </div>
        </div>

        {/* Right: Resume Preview */}
        <div
          className="col-span-7 overflow-x-auto  flex justify-start items-start p-4 bg-white rounded-md"
          ref={resumeRef}
        >
          <div style={{ minWidth: baseWidth }}>
            <RenderResume
              templateId={selectedTemplate?.theme || ""}
              resumeData={resumeData || DUMMY_RESUME_DATA}
              containerWidth={baseWidth}
              colorPalette={selectedColorPalette?.colors || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
