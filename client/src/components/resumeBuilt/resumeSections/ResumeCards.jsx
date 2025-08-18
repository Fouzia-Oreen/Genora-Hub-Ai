import { useEffect } from "react";
import { useState } from "react";
import { getLightColorFromImage } from "../../../helper";
import { Trash2 } from "lucide-react";

const ResumeCard = ({ imgUrl, title, profileInfo, lastUpdated, onSelect, onDelete }) => {
  const placeholderImg = "https://placehold.co/300x400/1e293b/d1d5db?text=No+Image";
  const [bgColor, setBgColor] = useState();

  useEffect(() => {
    if (imgUrl) {
      getLightColorFromImage(imgUrl)
        .then((color) => setBgColor(color))
        .catch(() => setBgColor("#ffffff"));
    }
  }, [imgUrl]);

  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 relative"
      style={{ backgroundColor: bgColor }}
      onClick={onSelect}
    >
      {/* Delete button top-right */}
      <button
        className="absolute top-5 right-5 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md"
        onClick={(e) => {
          e.stopPropagation(); 
          onDelete?.();        
        }}
      >
        <Trash2 size={16} />
      </button>

      <img
        src={imgUrl || placeholderImg}
        alt={title}
        className="w-full h-auto rounded-lg object-cover aspect-[3/4]"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = placeholderImg;
        }}
      />

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-color_4">{title}</h3>
        <p className="text-sm text-color_1/80">
          <span className="font-medium">Profile:</span> {profileInfo}
        </p>
        <p className="text-xs text-color_1/80">
          <span className="font-medium">Last Updated :</span> {lastUpdated}
        </p>
      </div>
    </div>
  );
};

export default ResumeCard;

