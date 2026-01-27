import React from 'react';

const BrutalistButton = ({ 
  children, 
  onClick, 
  color = "bg-yellow-400", 
  shadowColor = "#000000", 
  shadowSize = "6px",
  className = "" 
}) => {
  
  const getShadow = (size, color) => `${size} ${size} 0px 0px ${color}`;

  const shadowStyle = {
    boxShadow: getShadow(shadowSize, shadowColor)
  };

  return (
    <button
      onClick={onClick}
      style={shadowStyle}
      className={`
        ${color} 
        text-black 
        font-black 
        uppercase 
        italic 
        border-[3px] 
        border-black 
        px-6 
        py-3 
        transition-all 
        duration-100 
        hover:-translate-x-1 
        hover:-translate-y-1
        ${className}
      `}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = `translate(${shadowSize}, ${shadowSize})`;
        e.currentTarget.style.boxShadow = 'none';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translate(-4px, -4px)'; 
        e.currentTarget.style.boxShadow = getShadow(shadowSize, shadowColor);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(0px, 0px)'; 
        e.currentTarget.style.boxShadow = getShadow(shadowSize, shadowColor);
      }}
    >
      {children}
    </button>
  );
};

export default BrutalistButton;