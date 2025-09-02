// src/components/map/Map.jsx
import React, { useEffect, useRef, useState } from "react";
import { makeCircle, makeRect, makeTriangle, makeHeart } from "./shapes";
import { raDecToXY, starRadius } from "./helpers";

const getStrokeDashArray = (style) => {
  switch (style) {
    case "dashed":
      return "6,4";
    case "dotted":
      return "2,6";
    case "double":
      return "1,2"; // visual approximation
    case "none":
      return "none";
    case "solid":
    default:
      return "";
  }
};

const Map = ({
  maskShape = "circle",
  starsData = { features: [] },
  mwData = { features: [] },
  constData = { features: [] },
  showStars = true,
  showMilkyway = false,
  showConstellations = false,
  sizeMult = 1,
  centerRA = 0,
  strokeColor = "#eee",
  strokeWidth = 1,
  strokeStyle = "solid",
  fill,
}) => {
  const svgRef = useRef(null);
  const [maskElement, setMaskElement] = useState(makeCircle());

  // mask element
  useEffect(() => {
    switch (maskShape) {
      case "heart":
        setMaskElement(makeHeart());
        break;
      case "rect":
        setMaskElement(makeRect());
        break;
      case "triangle":
        setMaskElement(makeTriangle());
        break;
      case "circle":
      default:
        setMaskElement(makeCircle());
    }
  }, [maskShape]);

  // --- Stars ---
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const starsLayer = svg.querySelector("#starsLayer");
    if (!starsLayer) return;

    starsLayer.innerHTML = "";
    if (!showStars || !starsData?.features?.length) return;

    const frag = document.createDocumentFragment();

    for (const f of starsData.features) {
      const mag =
        f?.properties && typeof f.properties.mag === "number"
          ? f.properties.mag
          : 6.5;

      const [lon, lat] = f.geometry.coordinates;
      const { x, y } = raDecToXY(lon, lat, centerRA);

      // discard way-offscreen
      if (x < -20 || x > 1220 || y < -20 || y > 1220) continue;

      const c = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      c.setAttribute("class", "star");
      c.setAttribute("cx", x.toFixed(2));
      c.setAttribute("cy", y.toFixed(2));
      c.setAttribute("r", starRadius(mag, sizeMult).toFixed(2));
      c.setAttribute("opacity", (0.95 - Math.max(0, mag) / 10).toFixed(2));
      c.setAttribute("fill", "white");
      frag.appendChild(c);
    }

    starsLayer.appendChild(frag);
  }, [starsData, sizeMult, centerRA, showStars]);

  // --- Milky Way ---
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const mwLayer = svg.querySelector("#mwLayer");
    if (!mwLayer) return;

    mwLayer.innerHTML = "";
    if (!showMilkyway || !mwData?.features?.length) return;

    const frag = document.createDocumentFragment();

    for (const feature of mwData.features) {
      const geom = feature.geometry;
      if (!geom || !geom.coordinates) continue;

      const polygons =
        geom.type === "MultiPolygon"
          ? geom.coordinates
          : geom.type === "Polygon"
          ? [geom.coordinates]
          : [];

      for (const polygon of polygons) {
        for (const ring of polygon) {
          let d = "";
          for (let i = 0; i < ring.length; i++) {
            const [lon, lat] = ring[i];
            const { x, y } = raDecToXY(lon, lat, centerRA);
            d += i === 0 ? `M${x},${y}` : `L${x},${y}`;
          }
          d += "Z";

          const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          path.setAttribute("d", d);
          path.setAttribute("class", "mw");
          path.setAttribute("fill", "rgba(255,255,255,0.12)");
          path.setAttribute("stroke", "none");
          frag.appendChild(path);
        }
      }
    }

    mwLayer.appendChild(frag);
  }, [mwData, centerRA, showMilkyway]);

  // --- Constellations (lines + labels) ---
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
      const props = f.properties || {};
      if (!geom || !geom.coordinates) continue;

      const drawLine = (coords) => {
        let d = "";
        for (let i = 0; i < coords.length; i++) {
          const [lon, lat] = coords[i];
          const { x, y } = raDecToXY(lon, lat, centerRA);
          d += i === 0 ? `M${x},${y}` : `L${x},${y}`;
        }
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("d", d);
        path.setAttribute("class", "constLine");
        path.setAttribute("stroke", "rgba(180,200,255,0.22)");
        path.setAttribute("stroke-width", "1.2");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        fragLines.appendChild(path);
      };

      if (geom.type === "LineString") {
        drawLine(geom.coordinates);
      } else if (geom.type === "MultiLineString") {
        for (const line of geom.coordinates) {
          drawLine(line);
        }
      }

      // label
      let labelName = props.name || props.n || null; // fallback if dataset uses 'n'
      let labelPos = props.pos || null; // [lon, lat]
      if (!labelPos) {
        // fallback: mid-point of first line
        const firstLine =
          geom.type === "LineString"
            ? geom.coordinates
            : Array.isArray(geom.coordinates) && geom.coordinates.length
            ? geom.coordinates[0]
            : null;
        if (firstLine && firstLine.length) {
          const mid = firstLine[Math.floor(firstLine.length / 2)];
          labelPos = mid;
        }
      }
      if (labelName && labelPos) {
        const { x, y } = raDecToXY(labelPos[0], labelPos[1], centerRA);
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", (x + 6).toString());
        text.setAttribute("y", (y - 6).toString());
        text.setAttribute("class", "constLabel");
        text.setAttribute("fill", "rgba(200,220,255,0.9)");
        text.setAttribute("font-size", "10");
        text.setAttribute("text-anchor", "start");
        text.textContent = labelName;
        fragLabels.appendChild(text);
      }
    }

    linesLayer.appendChild(fragLines);
    labelsLayer.appendChild(fragLabels);
  }, [constData, centerRA, showConstellations]);

  // viewBox similar to your HTML
  const getViewBox = () => {
    switch (maskShape) {
      case "heart":
        return "0 0 1200 1200"; // heart path designed for 1200x1200
      case "rect":
        return "0 0 1200 1200";
      case "triangle":
        return "0 0 1200 1200";
      case "circle":
      default:
        return "0 0 1200 1200";
    }
  };

  return (
    <svg ref={svgRef} viewBox={getViewBox()} aria-label="Celestial map">
      <defs>
        <clipPath id="maskShape">{maskElement}</clipPath>
      </defs>

      {/* outline */}
      <g id="shapeOutline">
        {React.cloneElement(maskElement, {
          fill: "none",
          stroke: strokeStyle === "none" ? "none" : strokeColor,
          strokeWidth,
          strokeDasharray: getStrokeDashArray(strokeStyle),
        })}
      </g>

      {/* clipped content */}
      <g clipPath="url(#maskShape)">
        <g id="mwLayer"></g>
        <g id="starsLayer"></g>
        <g id="constLinesLayer"></g>
        <g id="constLabelsLayer"></g>
        <g id="planetsLayer"></g>
      </g>

      {/* optional fill behind content inside mask */}
      {fill && (
        <g clipPath="url(#maskShape)">
          {React.cloneElement(maskElement, { fill, stroke: "none" })}
        </g>
      )}
    </svg>
  );
};

export default Map;
