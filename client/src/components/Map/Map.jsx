// src/components/map/Map.jsx
import { useEffect, useRef, useState } from "react";
import { makeCircle, makeRect, makeTriangle, makeHeart } from "./shapes";
import { raDecToXY, starRadius } from "./helpers";

const Map = ({
  maskShape = "circle",
  starsData = { features: [] },
  sizeMult = 1,
  centerRA = 0,
}) => {
  const svgRef = useRef();
  const [maskElement, setMaskElement] = useState(makeCircle());

  // Update mask element when shape changes
  useEffect(() => {
    switch (maskShape) {
      case "circle":
        setMaskElement(makeCircle());
        break;
      case "heart":
        setMaskElement(makeHeart());
        break;
      case "rect":
        setMaskElement(makeRect());
        break;
      case "triangle":
        setMaskElement(makeTriangle());

        break;
      default:
        setMaskElement(makeCircle());
    }
  }, [maskShape]);

  // Render stars
  useEffect(() => {
    if (!starsData?.features) return;

    const svg = svgRef.current;
    const starsLayer = svg.querySelector("#starsLayer");
    starsLayer.innerHTML = "";

    const frag = document.createDocumentFragment();

    starsData.features.forEach((f) => {
      const mag = f.properties?.mag ?? 6.5;
      const [lon, lat] = f.geometry.coordinates;
      const { x, y } = raDecToXY(lon, lat, centerRA);

      const c = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      c.setAttribute("class", "star");
      c.setAttribute("cx", x);
      c.setAttribute("cy", y);
      c.setAttribute("r", starRadius(mag, sizeMult));
      c.setAttribute("fill", "white");
      frag.appendChild(c);
    });

    starsLayer.appendChild(frag);
  }, [starsData, sizeMult, centerRA]);
  const viewBox = maskShape === "heart" ? "170 352 860 798" : "0 0 1200 1200";
  return (
    <svg ref={svgRef} viewBox={viewBox}>
      <defs>
        <clipPath id="maskShape">{maskElement}</clipPath>
      </defs>

      <g clipPath="url(#maskShape)">
        <g id="mwLayer"></g>
        <g id="starsLayer"></g>
        <g id="constLinesLayer"></g>
        <g id="constLabelsLayer"></g>
        <g id="planetsLayer"></g>
      </g>

      <g id="shapeOutline">{maskElement}</g>
    </svg>
  );
};

export default Map;
