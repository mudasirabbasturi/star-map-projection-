import React, { useEffect } from "react";
import { starRadius } from "../helpers";
import { clamp } from "./utils"; // You can move helper functions to a utils file

const StarsLayer = ({ svgRef, starsData, showStars, sizeMult }) => {
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const layer = svg.querySelector("#starsLayer");
    if (!layer) return;
    layer.innerHTML = "";
    if (!showStars || !starsData?.features?.length) return;

    const frag = document.createDocumentFragment();
    for (const f of starsData.features) {
      const mag = f.properties?.mag ?? 6.5;
      if (mag > 6.5) continue;
      const [ra, dec] = f.geometry?.coordinates || [];
      // Convert RA/Dec to x/y using your projection function
      const { x, y } = { x: ra, y: dec }; // Placeholder for safeProject
      if (!isFinite(x) || !isFinite(y)) continue;

      const c = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      c.setAttribute("cx", x);
      c.setAttribute("cy", y);
      c.setAttribute("r", starRadius(mag, sizeMult));
      c.setAttribute("fill", "white");
      frag.appendChild(c);
    }
    layer.appendChild(frag);
  }, [starsData, showStars, sizeMult, svgRef]);

  return <g id="starsLayer" />;
};

export default StarsLayer;
