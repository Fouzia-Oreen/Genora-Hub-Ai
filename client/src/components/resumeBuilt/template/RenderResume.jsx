import TemplateFive from './TemplateFive';
import TemplateFour from './TemplateFour';
import TemplateOne from './TemplateOne';
import TemplateSeven from './TemplateSeven';
import TemplateSix from './TemplateSix';
import TemplateThree from './TemplateThree';
import TemplateTwo from './TemplateTwo';

const RenderResume = ({templateId, resumeData, colorPalette, containerWidth}) => {

  switch (templateId) {
    case "01":
        return (
            <TemplateOne 
              resumeData={resumeData}
              colorPalette={colorPalette}
              containerWidth={containerWidth}
            />
            
        );
    case "02":
        return (
            <TemplateTwo 
              resumeData={resumeData}
              colorPalette={colorPalette}
              containerWidth={containerWidth}
            />
        );
    case "03":
        return (
            <TemplateThree 
              resumeData={resumeData}
              colorPalette={colorPalette}
              containerWidth={containerWidth}
            />
        );
    case "04":
        return (
            <TemplateFour 
              resumeData={resumeData}
              colorPalette={colorPalette}
              containerWidth={containerWidth}
            />
        );
        case "05":
        return (
            <TemplateFive 
              resumeData={resumeData}
              colorPalette={colorPalette}
              containerWidth={containerWidth}
            />
        );
        case "06":
        return (
            <TemplateSix 
              resumeData={resumeData}
              colorPalette={colorPalette}
              containerWidth={containerWidth}
            />
        );
        case "07":
        return (
            <TemplateSeven 
              resumeData={resumeData}
              colorPalette={colorPalette}
              containerWidth={containerWidth}
            />
        );
    default:
        return (
            <TemplateSeven 
              resumeData={resumeData}
              colorPalette={colorPalette}
              containerWidth={containerWidth}
            />
        );
  }
}
export default RenderResume
