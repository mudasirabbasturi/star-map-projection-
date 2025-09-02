import { useEffect, useState } from "react";

const HeartSVG = ({ width, height }) => {
  const [path, setPath] = useState("");

  useEffect(() => {
    let xMin = Infinity,
      xMax = -Infinity,
      yMin = Infinity,
      yMax = -Infinity;
    const points = [];

    // Heart curve points
    for (let t = 0; t < Math.PI * 2; t += 0.01) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );
      points.push([x, y]);
      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }

    // Scale & center
    const heartWidth = xMax - xMin;
    const heartHeight = yMax - yMin;
    const scale = Math.min(width / heartWidth, height / heartHeight) * 0.95;

    const offsetX = (xMin + xMax) / 2;
    const offsetY = (yMin + yMax) / 2;

    // Create SVG path
    const pathData = points
      .map(([x, y], i) => {
        const px = x * scale + width / 2 - offsetX * scale;
        const py = y * scale + height / 2 - offsetY * scale;
        return `${i === 0 ? "M" : "L"} ${px} ${py}`;
      })
      .join(" ");
    setPath(`${pathData} Z`);
  }, [width, height]);

  return (
    <svg width={width} height={height}>
      <path d={path} fill="none" stroke="red" strokeWidth="2" />
    </svg>
  );
};

export default HeartSVG;
