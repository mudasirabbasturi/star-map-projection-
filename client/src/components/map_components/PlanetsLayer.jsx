import React, { useEffect } from "react";
import * as Astronomy from "astronomy-engine";
import { safeProject } from "./utils";
import { starRadius } from "../helpers";

const PlanetsLayer = ({
  svgRef,
  lat,
  lon,
  showPlanets,
  showMoon,
  sizeMult,
  projection,
}) => {
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const layer = svg.querySelector("#planetsLayer");
    if (!layer) return;
    layer.innerHTML = "";

    if (!showPlanets && !showMoon) return;

    const observer = new Astronomy.Observer(lat, lon, 0);
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
          const { x, y } = safeProject(projection, raDeg, decDeg);
          if (!isFinite(x) || !isFinite(y)) continue;

          const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          const circ = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          circ.setAttribute("cx", x);
          circ.setAttribute("cy", y);
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
        const raDeg = (eq.ra || 0) * 15;
        const decDeg = eq.dec || 0;
        const { x, y } = safeProject(projection, raDeg, decDeg);
        if (!isFinite(x) || !isFinite(y)) return;

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const circ = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circ.setAttribute("cx", x);
        circ.setAttribute("cy", y);
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
      } catch (e) {
        console.error("Error rendering Moon:", e);
      }
    }
  }, [lat, lon, showPlanets, showMoon, sizeMult, projection, svgRef]);

  return <g id="planetsLayer" />;
};

export default PlanetsLayer;
