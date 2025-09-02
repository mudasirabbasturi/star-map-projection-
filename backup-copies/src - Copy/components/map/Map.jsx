// src/components/map/Map.jsx
import React, { useEffect, useRef, useState } from "react";
import { makeCircle, makeRect, makeTriangle, makeHeart } from "./shapes";
import { raDecToXY, starRadius } from "./helpers";
import * as Astronomy from "astronomy-engine";

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

// Map longitude to center RA (degrees). This is a pragmatic mapping used earlier.
const centerRAFromLon = (lon) => {
  let v = -lon;
  while (v <= -180) v += 360;
  while (v > 180) v -= 360;
  return v;
};

const Map = ({
  maskShape = "circle",
  starsData = { features: [] },
  mwData = { features: [] },
  constData = { features: [] },
  showStars = true,
  showMilkyway = true,
  showConstellations = true,
  showPlanets = true,
  showMoon = true,
  sizeMult = 1,
  centerRA = 0,
  strokeColor = "#eee",
  strokeWidth = 1,
  strokeStyle = "solid",
  fill,
  lat = 0,
  lon = 0,
  milkywayOpacity = 0.2,
  magLimit = 6.5,
}) => {
  const svgRef = useRef(null);
  const [maskElement, setMaskElement] = useState(makeCircle());

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
        setMaskElement(makeCircle());
    }
  }, [maskShape]);

  const derivedCenterRA = centerRAFromLon(lon);
  const derivedCenterDec = clamp(lat, -90, 90);

  // Stars (filter by magLimit, use sizeMult)
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
      if (mag > magLimit) continue; // filter by magnitude limit (larger numbers = dimmer)
      const [ra, dec] = f.geometry.coordinates;
      const { x, y } = raDecToXY(ra, dec - derivedCenterDec, derivedCenterRA);
      if (x < -40 || x > 1240 || y < -40 || y > 1240) continue;
      const c = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      c.setAttribute("class", "star");
      c.setAttribute("cx", x.toFixed(2));
      c.setAttribute("cy", y.toFixed(2));
      c.setAttribute("r", starRadius(mag, sizeMult).toFixed(2));
      const rawOpacity = 1.2 - mag / 6.5;
      c.setAttribute("opacity", clamp(rawOpacity, 0.05, 1).toFixed(2));
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

  // Milky Way (honour milkywayOpacity and toggle)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const layer = svg.querySelector("#mwLayer");
    if (!layer) return;
    layer.innerHTML = "";
    if (!showMilkyway || !mwData?.features?.length) return;

    const frag = document.createDocumentFragment();
    for (const f of mwData.features) {
      const polygons =
        f.geometry?.type === "MultiPolygon"
          ? f.geometry.coordinates
          : f.geometry?.type === "Polygon"
          ? [f.geometry.coordinates]
          : [];
      for (const poly of polygons) {
        for (const ring of poly) {
          let d = "";
          for (let i = 0; i < ring.length; i++) {
            const [ra, dec] = ring[i];
            const { x, y } = raDecToXY(
              ra,
              dec - derivedCenterDec,
              derivedCenterRA
            );
            d += i === 0 ? `M${x},${y}` : `L${x},${y}`;
          }
          d += "Z";
          const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          path.setAttribute("d", d);
          path.setAttribute(
            "fill",
            `rgba(255,255,255,${clamp(milkywayOpacity, 0, 1)})`
          );
          path.setAttribute("stroke", "none");
          frag.appendChild(path);
        }
      }
    }
    layer.appendChild(frag);
  }, [
    mwData,
    derivedCenterRA,
    derivedCenterDec,
    showMilkyway,
    milkywayOpacity,
  ]);

  // Constellations
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const lines = svg.querySelector("#constLinesLayer");
    const labels = svg.querySelector("#constLabelsLayer");
    if (!lines || !labels) return;
    lines.innerHTML = "";
    labels.innerHTML = "";
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
          const { x, y } = raDecToXY(
            ra,
            dec - derivedCenterDec,
            derivedCenterRA
          );
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
      if (geom.type === "LineString") drawLine(geom.coordinates);
      else if (geom.type === "MultiLineString") {
        for (const line of geom.coordinates) drawLine(line);
      }

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
        const { x, y } = raDecToXY(
          labelPos[0],
          labelPos[1] - derivedCenterDec,
          derivedCenterRA
        );
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

    lines.appendChild(fragLines);
    labels.appendChild(fragLabels);
  }, [constData, derivedCenterRA, derivedCenterDec, showConstellations]);

  // Planets & Moon (observer from lat/lon)
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
          const raDeg = (eq.ra || 0) * 15;
          const decDeg = eq.dec || 0;
          const { x, y } = raDecToXY(
            raDeg,
            decDeg - derivedCenterDec,
            derivedCenterRA
          );
          if (x < -40 || x > 1240 || y < -40 || y > 1240) continue;
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
        } catch (err) {
          // ignore single-body failures
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
        const raDeg = (eq.ra || 0) * 15;
        const decDeg = eq.dec || 0;
        const { x, y } = raDecToXY(
          raDeg,
          decDeg - derivedCenterDec,
          derivedCenterRA
        );
        if (!(x < -40 || x > 1240 || y < -40 || y > 1240)) {
          const circ = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          circ.setAttribute("cx", x.toFixed(2));
          circ.setAttribute("cy", y.toFixed(2));
          circ.setAttribute("r", Math.max(4, starRadius(-1.0, sizeMult)));
          circ.setAttribute("class", "moon");
          circ.setAttribute("fill", "#dfe9f5");
          layer.appendChild(circ);
          const label = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          label.setAttribute("x", x + 10);
          label.setAttribute("y", y + 5);
          label.setAttribute("fill", "#cdd9ea");
          label.setAttribute("font-size", "12");
          label.textContent = "Moon";
          layer.appendChild(label);
        }
      } catch (err) {
        // ignore moon calc error
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

  return (
    <svg ref={svgRef} viewBox="0 0 1200 1200" aria-label="Celestial map">
      <defs>
        <clipPath id="maskShape">{maskElement}</clipPath>
      </defs>

      <g id="shapeOutline">
        {React.cloneElement(maskElement, {
          fill: "none",
          stroke: strokeStyle === "none" ? "none" : strokeColor,
          strokeWidth,
          strokeDasharray: getStrokeDashArray(strokeStyle),
        })}
      </g>

      <g clipPath="url(#maskShape)">
        <g id="mwLayer" />
        <g id="starsLayer" />
        <g id="constLinesLayer" />
        <g id="constLabelsLayer" />
        <g id="planetsLayer" />
      </g>

      {fill && (
        <g clipPath="url(#maskShape)">
          {React.cloneElement(maskElement, { fill, stroke: "none" })}
        </g>
      )}
    </svg>
  );
};

export default Map;
