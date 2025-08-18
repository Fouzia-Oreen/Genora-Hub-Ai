
const TemplateCard = ({thumbnailImg,isSelected,onSelect}) => {
    return (
    <div className={` flex flex-col items-center justify-between  rounded border border-color_4/30 hover:border-color_4/50 overflow-hidden cursor-pointer ${isSelected ? "border-color_4/80 border shadow-md" : ""}`} onClick={onSelect}>
      {thumbnailImg ? (
        <img
        src={thumbnailImg}
        alt="Resume Template"
        className={`w-full h-full rounded  border border-color_4/30`}
      />
      ) : (
        <div></div>
      )
      }
    </div>
    )
}
export default TemplateCard
