import React from 'react';

const RatingInput = ({ value = 0, total = 5, onChange = () => {}, activeColor, inActiveColor}) => {
    const displayValue = Math.round((value / 100) * total);
    const handleClick = (index) => {

        const newValue = Math.round(((index + 1) / total) * 100);
        onChange(newValue);
    };

    return (
        <div className="flex">
            {[...Array(total)].map((_, index) => {
                const isActive = index < displayValue;
                return (
                    <div
                        key={index}
                        onClick={() => handleClick(index)}
                        className="w-4 h-4 mx-1 cursor-pointer rounded"
                        style={{ backgroundColor: isActive ? activeColor : inActiveColor }}
                    >
                    </div>
                );
            })}
        </div>
    );
};

export default RatingInput;