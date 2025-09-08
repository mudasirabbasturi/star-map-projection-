// src/components/shapes.jsx
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
    x="100"
    y="100"
    width="1000"
    height="1000"
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

export const makeApple = () => (
  <>
    <path
      d="M828 308c-46 27-96 40-146 38-38-2-73-16-96-40 3-55 31-104 72-144 48-48 110-72 170-74 7 30 9 63-2 96-10 33-28 61-48 82zm115 568c-26 60-56 110-98 146-41 36-91 54-149 56-47 2-94-14-141-14s-94 16-141 14c-58-2-108-20-149-56-42-36-72-86-98-146-36-80-54-169-54-258 0-72 14-138 44-194 29-56 70-102 119-133 44-28 95-42 147-42 46 0 92 16 132 16s86-16 132-16c52 0 103 14 147 42 49 31 90 77 119 133 30 56 44 122 44 194 0 89-18 178-54 258z"
      fill="none"
      stroke="white"
    />
    <path
      d="M640 120c60-80 160-110 240-100-18 70-64 130-128 168-48 28-88 36-120 32 0-38 4-72 8-100z"
      fill="none"
      stroke="white"
    />
  </>
);
