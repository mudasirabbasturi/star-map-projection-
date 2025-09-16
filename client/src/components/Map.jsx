// src/components/map/Map.jsx
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineEditNote } from "react-icons/md";
import { makeRect, makeTriangle, makeHeart, makeApple } from "./shapes";
import { starRadius } from "./helpers";
import * as Astronomy from "astronomy-engine";
import * as d3 from "d3-geo";
import * as d3Projection from "d3-geo-projection";
// Stroke style helper
const getStrokeDashArray = (style) => {
  switch (style) {
    case "dashed":
      return "6,4";
    case "dotted":
      return "2,6";
    case "double":
      return "1,2";
    case "none":
      return "none";
    default:
      return "";
  }
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const centerRAFromLon = (lon) => {
  let v = -lon;
  while (v <= -180) v += 360;
  while (v > 180) v -= 360;
  return v;
};
// -------------------- Aitoff Projection -----------------------
const makeProjection = (
  width = 1200,
  height = 1200,
  centerRA = 0,
  centerDec = 0
) => {
  return d3Projection
    .geoAitoff()
    .translate([width / 2, height / 2])
    .scale(width / Math.PI)
    .rotate([-centerRA, -centerDec, 0]);
};
const Map = ({
  mapStyle = {},
  mapData = {
    starsData: { features: [] },
    mwData: { features: [] },
    constData: { features: [] },
    centerRA: 0,
  },
  showDrawer,
  positions,
  handleMouseDown,
  drawerMode,
}) => {
  const svgRef = useRef(null);
  const [maskElement, setMaskElement] = useState(makeHeart());
  const {
    maskShape = "circle",
    showStars = true,
    showMilkyway = true,
    showConstellations = true,
    showPlanets = true,
    showMoon = true,
    sizeMult = 1,
    strokeColor = "#eee",
    strokeWidth = 1,
    strokeStyle = "solid",
    fill = "transparent", // This will now be used for projection background
    lat = 51.5,
    lon = -0.1,
    milkywayOpacity = 0.2,
    magLimit = 6.5,
  } = mapStyle;
  const { starsData, mwData, constData, centerRA } = mapData;
  // Setup mask shape
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
      default:
        setMaskElement(makeApple());
    }
  }, [maskShape]);
  const derivedCenterRA = centerRAFromLon(lon);
  const derivedCenterDec = clamp(lat, -90, 90);
  // Projection (static per render)
  const projection = makeProjection(
    1200,
    1200,
    derivedCenterRA,
    derivedCenterDec
  );
  const safeProject = (ra, dec) => {
    if (ra == null || dec == null) return { x: NaN, y: NaN };
    try {
      // Convert RA to longitude (-180 to 180)
      let longitude = ((ra - derivedCenterRA + 180) % 360) - 180;
      if (longitude < -180) longitude += 360;

      // d3 expects [longitude, latitude]
      const [x, y] = projection([longitude, dec]) || [NaN, NaN];
      return { x, y };
    } catch {
      return { x: NaN, y: NaN };
    }
  };

  const createProjectionBackground = () => {
    if (fill === "transparent" || fill === "none") return null;
    return (
      <rect
        x="0"
        y="0"
        width="1200"
        height="1200"
        fill={fill}
        className="projection-background"
      />
    );
  };
  // ---------------------- Stars ------------------------------------------ //
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
      if (mag > magLimit) continue;
      const [ra, dec] = f.geometry?.coordinates || [];
      const { x, y } = safeProject(ra, dec);
      if (!isFinite(x) || !isFinite(y)) continue;
      const r = starRadius(mag, sizeMult);
      const c = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      c.setAttribute("cx", x.toFixed(2));
      c.setAttribute("cy", y.toFixed(2));
      c.setAttribute("r", r.toFixed(2));
      const rawOpacity = 1.2 - mag / 6.5;
      const opacity = clamp(rawOpacity, 0.05, 1);
      c.setAttribute("opacity", opacity.toFixed(2));
      c.setAttribute("fill", "white");
      frag.appendChild(c);
    }
    layer.appendChild(frag);
  }, [
    starsData,
    sizeMult,
    derivedCenterRA,
    derivedCenterDec,
    showStars,
    magLimit,
  ]);
  // ---------------------- Milky Way (via d3.geoPath) ----------------------
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
      path.setAttribute("opacity", String(clamp(milkywayOpacity, 0, 1)));
      frag.appendChild(path);
    }
    layer.appendChild(frag);
  }, [
    mwData,
    derivedCenterRA,
    derivedCenterDec,
    showMilkyway,
    milkywayOpacity,
  ]);
  // ---------------------- Constellations (lines + labels) ----------------
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
          if (ra == null || dec == null) continue;
          const { x, y } = safeProject(ra, dec);
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
        if (ra != null && dec != null) {
          const { x, y } = safeProject(ra, dec);
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
    }
    linesLayer.appendChild(fragLines);
    labelsLayer.appendChild(fragLabels);
  }, [constData, derivedCenterRA, derivedCenterDec, showConstellations]);
  // ---------------------- Planets & Moon ---------------------------------
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const layer = svg.querySelector("#planetsLayer");
    if (!layer) return;
    layer.innerHTML = "";
    if (!showPlanets && !showMoon) return;
    const observer = new Astronomy.Observer(
      clamp(lat, -90, 90),
      clamp(lon, -180, 180),
      0
    );
    const now = new Date();
    if (showPlanets) {
      const bodies = [
        { name: "Mercury", body: Astronomy.Body.Mercury },
        { name: "Venus", body: Astronomy.Body.Venus },
        { name: "Mars", body: Astronomy.Body.Mars },
        { name: "Jupiter", body: Astronomy.Body.Jupiter },
        { name: "Saturn", body: Astronomy.Body.Saturn },
        { name: "Uranus", body: Astronomy.Body.Uranus },
        { name: "Neptune", body: Astronomy.Body.Neptune },
      ];
      for (const p of bodies) {
        try {
          const eq = Astronomy.Equator(p.body, now, observer, true, false);
          const raDeg = (eq.ra || 0) * 15; // Convert hours to degrees
          const decDeg = eq.dec || 0;
          const { x, y } = safeProject(raDeg, decDeg);
          if (isNaN(x) || isNaN(y)) continue;
          const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          const circ = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          circ.setAttribute("cx", x.toFixed(2));
          circ.setAttribute("cy", y.toFixed(2));
          circ.setAttribute("r", Math.max(3, starRadius(0, sizeMult)));
          circ.setAttribute("class", "planet");
          circ.setAttribute("fill", "#ffda6b");
          circ.setAttribute("stroke", "rgba(0,0,0,0.4)");
          circ.setAttribute("stroke-width", "0.6");
          const label = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          label.setAttribute("x", x + 8);
          label.setAttribute("y", y + 4);
          label.setAttribute("fill", "#ffdca0");
          label.setAttribute("font-size", "12");
          label.textContent = p.name;
          g.appendChild(circ);
          g.appendChild(label);
          layer.appendChild(g);
        } catch (e) {
          console.error(`Error rendering ${p.name}:`, e);
        }
      }
    }
    if (showMoon) {
      try {
        const eq = Astronomy.Equator(
          Astronomy.Body.Moon,
          now,
          observer,
          true,
          false
        );
        const raDeg = (eq.ra || 0) * 15; // Convert hours to degrees
        const decDeg = eq.dec || 0;
        const { x, y } = safeProject(raDeg, decDeg);
        if (!isNaN(x) && !isNaN(y)) {
          const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          const circ = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          circ.setAttribute("cx", x.toFixed(2));
          circ.setAttribute("cy", y.toFixed(2));
          circ.setAttribute("r", Math.max(4, starRadius(-1, sizeMult)));
          circ.setAttribute("class", "moon");
          circ.setAttribute("fill", "#dfe9f5");
          const label = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          label.setAttribute("x", x + 10);
          label.setAttribute("y", y + 5);
          label.setAttribute("fill", "#cdd9ea");
          label.setAttribute("font-size", "12");
          label.textContent = "Moon";
          g.appendChild(circ);
          g.appendChild(label);
          layer.appendChild(g);
        }
      } catch (e) {
        console.error("Error rendering Moon:", e);
      }
    }
  }, [
    showPlanets,
    showMoon,
    derivedCenterRA,
    derivedCenterDec,
    sizeMult,
    lat,
    lon,
  ]);
  const calculateShapeTransform = (shapeElement, maskShape) => {
    if (maskShape === "circle") {
      return "translate(0,0) scale(1)";
    }
    if (maskShape === "apple") {
      return "translate(-30, -10) scale(1.11)";
    }
    if (maskShape === "heart") {
      return "translate(-207, -450) scale(1.35)";
    }
    if (maskShape === "triangle") {
      return "translate(-60,-10) scale(1.1)";
    }
    if (maskShape === "rect") {
      // Calculate the transform to make the rectangle fill the entire 1200x1200 viewbox
      const rectWidth = 1000; // Assuming your rectangle's original width
      const rectHeight = 800; // Assuming your rectangle's original height
      const scaleX = 1200 / rectWidth;
      const scaleY = 1200 / rectHeight;
      return `translate(0,0) scale(${scaleX}, ${scaleY})`;
    }
    if (maskShape === "circle") {
      const r = shapeElement.props.r || 500;
      const cx = shapeElement.props.cx || 600;
      const cy = shapeElement.props.cy || 600;
      const scale = 550 / r;
      return `translate(${600 - cx * scale}, ${
        600 - cy * scale
      }) scale(${scale})`;
    }
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    const extractPoints = (element) => {
      const points = [];
      if (element.type === "path") {
        const d = element.props.d;
        const commands = d.split(/[ ,]/).filter((cmd) => cmd !== "");
        for (let i = 0; i < commands.length; i++) {
          const x = parseFloat(commands[i]);
          const y = parseFloat(commands[i + 1]);
          if (!isNaN(x) && !isNaN(y)) {
            points.push([x, y]);
            i++;
          }
        }
      } else if (element.type === "polygon") {
        element.props.points.split(" ").forEach((pair) => {
          const [x, y] = pair.split(",").map(parseFloat);
          if (!isNaN(x) && !isNaN(y)) points.push([x, y]);
        });
      } else if (element.type === "rect") {
        const x = parseFloat(element.props.x || 0);
        const y = parseFloat(element.props.y || 0);
        const w = parseFloat(element.props.width || 0);
        const h = parseFloat(element.props.height || 0);
        points.push([x, y], [x + w, y], [x, y + h], [x + w, y + h]);
      }
      return points;
    };
    const points = extractPoints(shapeElement);
    points.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const width = maxX - minX;
    const height = maxY - minY;
    const scale = Math.min(1000 / width, 1000 / height) * 0.9;
    const translateX = 600 - centerX * scale;
    const translateY = 600 - centerY * scale;
    return `translate(${translateX}, ${translateY}) scale(${scale})`;
  };
  const getShapeTransform = (shape) => {
    if (shape === "circle") {
      // return "";
      return "translate(18,18) scale(.97)";
    }
    if (!shape || shape === "circle") return "";
    let shapeElement;
    switch (shape) {
      case "heart":
        shapeElement = makeHeart();
        break;
      case "triangle":
        shapeElement = makeTriangle();
        break;
      case "apple":
        shapeElement = makeApple();
        break;
      case "rect":
        shapeElement = makeRect();
        break;
      default:
        return "";
    }
    return calculateShapeTransform(shapeElement, shape);
  };
  return (
    <div
      className={`map hasIcon ${drawerMode === "map" ? "active" : ""}`}
      style={{
        width: `${mapStyle.width}%`,
        height: `${mapStyle.height}%`,
        top: `${positions.map.y}%`,
      }}
      onMouseDown={(e) => handleMouseDown(e, "map")}
    >
      <div className="iconWrapper" onClick={() => showDrawer("map")}>
        <MdOutlineEditNote className="editIcon" />
      </div>

      <svg
        width="100%"
        height="100%"
        ref={svgRef}
        viewBox="0 0 1200 1200"
        preserveAspectRatio={maskShape === "rect" ? "none" : undefined}
      >
        <defs>
          <clipPath id="maskShape" transform={getShapeTransform(maskShape)}>
            {maskShape === "circle" ? (
              <circle cx="600" cy="600" r="600" />
            ) : (
              maskElement
            )}
          </clipPath>
        </defs>
        {/* <g clipPath="url(#maskShape)">
          {createProjectionBackground()}
          <g id="mwLayer" />
          <g id="starsLayer" />
          <g id="constLinesLayer" />
          <g id="constLabelsLayer" />
          <g id="planetsLayer" />
        </g> */}
        <g clipPath="url(#maskShape)">
          {/* 🔹 Background fill always */}
          <rect
            x="0"
            y="0"
            width="1200"
            height="1200"
            fill={fill && fill !== "transparent" ? fill : "black"} // fallback
          />

          {/* 🔹 Optional background image overlay */}
          {mapStyle.bgImage && (
            <image
              href={mapStyle.bgImage}
              width="100%"
              height="100%"
              preserveAspectRatio={
                mapStyle.bgImageMode === "cover"
                  ? "xMidYMid slice"
                  : mapStyle.bgImageMode === "contain"
                  ? "xMidYMid meet"
                  : "none"
              }
              opacity={mapStyle.bgImageOpacity ?? 1}
            />
          )}

          {/* 🔹 Stars and layers always above bg */}
          <g id="mwLayer" />
          <g id="starsLayer" />
          <g id="constLinesLayer" />
          <g id="constLabelsLayer" />
          <g id="planetsLayer" />
        </g>
        <g id="shapeOutline" transform={getShapeTransform(maskShape)}>
          {maskShape === "circle" ? (
            <circle
              cx="600"
              cy="600"
              r="600"
              fill="transparent"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={getStrokeDashArray(strokeStyle)}
            />
          ) : (
            React.cloneElement(maskElement, {
              fill: "transparent",
              stroke: strokeColor,
              strokeWidth,
              strokeDasharray: getStrokeDashArray(strokeStyle),
            })
          )}
        </g>
      </svg>
    </div>
  );
};
export default Map;
