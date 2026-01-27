import React from 'react';

const BrutalistCard = ({
  children,
  color = "bg-white",
  shadowColor = "#000000",
  shadowSize = "8px",
  className = ""
}) => {
  return (
    <div className={`relative group ${className}`}>
      <div className={`absolute inset-0 ${shadowColor} border-2 border-black translate-x-[${shadowSize}] translate-y-[${shadowSize}]`}
        style={{ transform: `translate(${shadowSize}, ${shadowSize})` }}>
      </div>

      <div className={`relative ${color} border-4 border-black p-6 transition-all duration-200 
                      group-hover:-translate-y-1 group-hover:-translate-x-1 
                      active:translate-x-[${shadowSize}] active:translate-y-[${shadowSize}]`}>
        {children}
      </div>
    </div>
  );
};

export default BrutalistCard;