import React from "react";

const Text = ({ text, isActive, onClick }) => {
  if (!text) return null;

  const style = {
    position: "absolute",
    top: text.top,
    left: text.left,
    fontSize: text.fontSize,
    fontFamily: text.fontFamily,
    color: text.color,
    fontWeight: text.fontWeight,
    fontStyle: text.fontStyle,
    textAlign: text.textAlign,
    opacity: text.opacity,
    cursor: "pointer",
    border: isActive ? "1px dashed #1890ff" : "none",
    padding: "2px",
    userSelect: "none",
  };

  return (
    <div style={style} onClick={onClick}>
      {text.text}
    </div>
  );
};

export default Text;
