import React, { useEffect } from "react";
import { safeProject } from "../utils";

const ConstellationsLayer = ({
  svgRef,
  constData,
  showConstellations,
  projection,
}) => {
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const linesLayer = svg.querySelector("#constLinesLayer");
    const labelsLayer = svg.querySelector("#constLabelsLayer");
    if (!linesLayer || !labelsLayer) return;
    linesLayer.innerHTML = "";
    labelsLayer.innerHTML = "";
    if (!showConstellations || !constData?.features?.length) return;

    const fragLines = document.createDocumentFragment();
    const fragLabels = document.createDocumentFragment();

    for (const f of constData.features) {
      const geom = f.geometry;
      if (!geom) continue;

      const drawLine = (coords) => {
        let d = "";
        for (let i = 0; i < coords.length; i++) {
          const [ra, dec] = coords[i];
          const { x, y } = safeProject(projection, ra, dec);
          if (!isFinite(x) || !isFinite(y)) continue;
          d += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2);
        }
        if (d) {
          const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          path.setAttribute("d", d);
          path.setAttribute("class", "constLine");
          path.setAttribute("stroke", "rgba(180,200,255,0.6)");
          path.setAttribute("stroke-width", "1.2");
          path.setAttribute("fill", "none");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("stroke-linejoin", "round");
          fragLines.appendChild(path);
        }
      };

      if (geom.type === "LineString") drawLine(geom.coordinates);
      else if (geom.type === "MultiLineString") {
        for (const line of geom.coordinates) drawLine(line);
      }

      // Label
      const props = f.properties || {};
      let labelName = props.name || props.n || null;
      let labelPos = props.pos || null;

      if (!labelPos) {
        const firstLine =
          geom.type === "LineString"
            ? geom.coordinates
            : Array.isArray(geom.coordinates) && geom.coordinates.length
            ? geom.coordinates[0]
            : null;
        if (firstLine && firstLine.length)
          labelPos = firstLine[Math.floor(firstLine.length / 2)];
      }

      if (labelName && labelPos) {
        const [ra, dec] = labelPos;
        const { x, y } = safeProject(projection, ra, dec);
        if (isFinite(x) && isFinite(y)) {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          text.setAttribute("x", x + 6);
          text.setAttribute("y", y - 6);
          text.setAttribute("class", "constLabel");
          text.setAttribute("fill", "rgba(200,220,255,0.9)");
          text.setAttribute("font-size", "10");
          text.textContent = labelName;
          fragLabels.appendChild(text);
        }
      }
    }

    linesLayer.appendChild(fragLines);
    labelsLayer.appendChild(fragLabels);
  }, [constData, showConstellations, projection, svgRef]);

  return (
    <>
      <g id="constLinesLayer" />
      <g id="constLabelsLayer" />
    </>
  );
};

export default ConstellationsLayer;
