// src/components/map/shapes.jsx
import React from "react";

export const makeCircle = () => (
  <circle
    cx={600}
    cy={600}
    r={500}
    fill="none"
    stroke="white"
    strokeWidth={2}
  />
);

export const makeRect = () => (
  <rect
    x={100}
    y={100}
    width={1000}
    height={1000}
    fill="none"
    stroke="white"
    strokeWidth={2}
  />
);

export const makeTriangle = () => (
  <polygon
    points="600,100 1100,1000 100,1000"
    fill="none"
    stroke="white"
    strokeWidth={2}
  />
);

export const makeHeart = () => (
  <path
    d="M 600 1121
       C 201 869, 33 554, 306 407
       C 474 323, 600 449, 600 554
       C 600 449, 726 323, 894 407
       C 1167 554, 999 869, 600 1121
       Z"
    fill="none"
    stroke="white"
    strokeWidth={2}
  />
);
