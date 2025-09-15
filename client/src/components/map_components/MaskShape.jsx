import React from "react";
import { makeHeart, makeRect, makeTriangle, makeApple } from "../shapes";

const MaskShape = ({ maskShape }) => {
  let maskElement;

  switch (maskShape) {
    case "heart":
      maskElement = makeHeart();
      break;
    case "rect":
      maskElement = makeRect();
      break;
    case "triangle":
      maskElement = makeTriangle();
      break;
    case "apple":
      maskElement = makeApple();
      break;
    default:
      maskElement = <circle cx="600" cy="600" r="600" />;
  }

  return (
    <clipPath id="maskShape" transform="translate(0,0) scale(1)">
      {maskElement}
    </clipPath>
  );
};

export default MaskShape;
