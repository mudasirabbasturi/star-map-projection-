import React from "react";

const ProjectionBackground = ({ fill }) => {
  if (fill === "transparent" || fill === "none") return null;
  return <rect x="0" y="0" width="1200" height="1200" fill={fill} />;
};

export default ProjectionBackground;
