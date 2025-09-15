import React, { useEffect } from "react";
import * as d3 from "d3-geo";

const MilkyWayLayer = ({
  svgRef,
  mwData,
  showMilkyway,
  projection,
  milkywayOpacity = 0.2,
}) => {
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const layer = svg.querySelector("#mwLayer");
    if (!layer) return;
    layer.innerHTML = "";
    if (!showMilkyway || !mwData?.features?.length) return;

    const pathGen = d3.geoPath(projection);
    const frag = document.createDocumentFragment();

    for (const f of mwData.features) {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", pathGen(f));
      path.setAttribute("fill", "white");
      path.setAttribute("opacity", Math.min(Math.max(milkywayOpacity, 0), 1));
      frag.appendChild(path);
    }
    layer.appendChild(frag);
  }, [mwData, projection, showMilkyway, milkywayOpacity, svgRef]);

  return <g id="mwLayer" />;
};

export default MilkyWayLayer;
