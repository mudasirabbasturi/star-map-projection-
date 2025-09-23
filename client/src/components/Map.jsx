// src/components/map/Map.jsx
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
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

// Memoized projection creation
const useProjection = (
  width,
  height,
  centerRA,
  centerDec,
  type = "orthographic"
) => {
  return useMemo(() => {
    switch (type) {
      case "stereographic":
        return d3
          .geoStereographic()
          .translate([width / 2, height / 2])
          .scale(width / 2.2)
          .rotate([-centerRA, -centerDec, 0]);

      case "aitoff":
        return d3Projection
          .geoAitoff()
          .translate([width / 2, height / 2])
          .scale(width / Math.PI)
          .rotate([-centerRA, -centerDec, 0]);

      case "orthographic":
      default:
        return d3
          .geoOrthographic()
          .translate([width / 2, height / 2])
          .scale(width / 2)
          .clipAngle(90)
          .rotate([-centerRA, -centerDec, 0]);
    }
  }, [width, height, centerRA, centerDec, type]);
};

// Memoized safe project function
const useSafeProject = (projection, derivedCenterRA) => {
  return useCallback(
    (ra, dec) => {
      if (ra == null || dec == null) return { x: NaN, y: NaN };
      try {
        let longitude = ((ra - derivedCenterRA + 180) % 360) - 180;
        if (longitude < -180) longitude += 360;
        const [x, y] = projection([longitude, dec]) || [NaN, NaN];
        return { x, y };
      } catch {
        return { x: NaN, y: NaN };
      }
    },
    [projection, derivedCenterRA]
  );
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
    showPlanetNames = true,
    showMoon = true,
    sizeMult = 1,
    strokeColor = "#eee",
    strokeWidth = 1,
    strokeStyle = "solid",
    fill = "transparent",
    lat = 51.5,
    lon = -0.1,
    milkywayOpacity = 0.2,
    magLimit = 6.5,
    projection: projectionType = "orthographic",
  } = mapStyle;

  const { starsData, mwData, constData } = mapData;

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

  const derivedCenterRA = useMemo(() => centerRAFromLon(lon), [lon]);
  const derivedCenterDec = useMemo(() => clamp(lat, -90, 90), [lat]);

  const projection = useProjection(
    1200,
    1200,
    derivedCenterRA,
    derivedCenterDec,
    projectionType
  );
  const safeProject = useSafeProject(projection, derivedCenterRA);

  // Memoized stars rendering - FIXED VERSION
  const stars = useMemo(() => {
    if (!showStars || !starsData?.features?.length) return [];

    return starsData.features
      .filter((f) => {
        const mag = f.properties?.mag ?? 6.5;
        return mag <= magLimit;
      })
      .map((f) => {
        const mag = f.properties?.mag ?? 6.5; // Define mag here
        const [ra, dec] = f.geometry?.coordinates || [];
        const { x, y } = safeProject(ra, dec);
        if (!isFinite(x) || !isFinite(y)) return null;

        const r = starRadius(mag, sizeMult);
        const rawOpacity = 1.2 - mag / 6.5;
        const opacity = clamp(rawOpacity, 0.05, 1);

        // Enhanced star visibility - brighter stars appear more prominent
        const starBrightness = Math.max(0.3, 1.5 - mag / 4);

        return (
          <circle
            key={`${ra}-${dec}-${mag}`}
            cx={x}
            cy={y}
            r={r}
            opacity={opacity * starBrightness}
            fill="white"
            className="star"
          />
        );
      })
      .filter(Boolean);
  }, [starsData, safeProject, showStars, magLimit, sizeMult]);

  // Memoized Milky Way rendering
  const milkyWay = useMemo(() => {
    if (!showMilkyway || !mwData?.features?.length) return null;

    const pathGen = d3.geoPath(projection);
    return mwData.features.map((f, index) => (
      <path
        key={`mw-${index}`}
        d={pathGen(f)}
        fill="white"
        opacity={clamp(milkywayOpacity, 0, 1)}
        className="milky-way"
      />
    ));
  }, [mwData, projection, showMilkyway, milkywayOpacity]);

  // Memoized constellations rendering
  const constellations = useMemo(() => {
    if (!showConstellations || !constData?.features?.length)
      return { lines: [], labels: [] };

    const lines = [];
    const labels = [];

    constData.features.forEach((f, index) => {
      const geom = f.geometry;
      if (!geom) return;

      // Draw lines
      const drawLine = (coords) => {
        let d = "";
        for (let i = 0; i < coords.length; i++) {
          const [ra, dec] = coords[i];
          if (ra == null || dec == null) continue;
          const { x, y } = safeProject(ra, dec);
          if (!isFinite(x) || !isFinite(y)) continue;
          d += (i === 0 ? "M" : "L") + x + " " + y;
        }
        if (d) {
          lines.push(
            <path
              key={`const-line-${index}`}
              d={d}
              className="constLine"
              stroke="rgba(180,200,255,0.6)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        }
      };

      if (geom.type === "LineString") drawLine(geom.coordinates);
      else if (geom.type === "MultiLineString") {
        geom.coordinates.forEach((line, lineIndex) =>
          drawLine(line, `${index}-${lineIndex}`)
        );
      }

      // Labels
      const props = f.properties || {};
      let labelName = props.name || props.n || null;
      let labelPos = props.pos || null;

      if (!labelPos) {
        const firstLine =
          geom.type === "LineString" ? geom.coordinates : geom.coordinates?.[0];
        if (firstLine?.length) {
          labelPos = firstLine[Math.floor(firstLine.length / 2)];
        }
      }

      if (labelName && labelPos) {
        const [ra, dec] = labelPos;
        if (ra != null && dec != null) {
          const { x, y } = safeProject(ra, dec);
          if (isFinite(x) && isFinite(y)) {
            labels.push(
              <text
                key={`const-label-${index}`}
                x={x + 6}
                y={y - 6}
                className="constLabel"
                fill="rgba(200,220,255,0.9)"
                fontSize="10"
              >
                {labelName}
              </text>
            );
          }
        }
      }
    });

    return { lines, labels };
  }, [constData, safeProject, showConstellations]);

  // Memoized planets and moon rendering
  const celestialBodies = useMemo(() => {
    if (!showPlanets && !showMoon) return [];

    const observer = new Astronomy.Observer(
      clamp(lat, -90, 90),
      clamp(lon, -180, 180),
      0
    );
    const now = mapStyle.date ? new Date(mapStyle.date) : new Date();
    const bodies = [];

    if (showPlanets) {
      const planets = [
        { name: "Mercury", body: Astronomy.Body.Mercury },
        { name: "Venus", body: Astronomy.Body.Venus },
        { name: "Mars", body: Astronomy.Body.Mars },
        { name: "Jupiter", body: Astronomy.Body.Jupiter },
        { name: "Saturn", body: Astronomy.Body.Saturn },
        { name: "Uranus", body: Astronomy.Body.Uranus },
        { name: "Neptune", body: Astronomy.Body.Neptune },
      ];

      planets.forEach((p) => {
        try {
          const eq = Astronomy.Equator(p.body, now, observer, true, false);
          const raDeg = (eq.ra || 0) * 15;
          const decDeg = eq.dec || 0;
          const { x, y } = safeProject(raDeg, decDeg);
          if (isNaN(x) || isNaN(y)) return;

          bodies.push(
            <g key={p.name} className="planet">
              <circle
                cx={x}
                cy={y}
                r={Math.max(3, starRadius(0, sizeMult))}
                fill="#ffda6b"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="0.6"
              />
              {showPlanetNames && (
                <text x={x + 8} y={y + 4} fill="#ffdca0" fontSize="12">
                  {p.name}
                </text>
              )}
            </g>
          );
        } catch (e) {
          console.error(`Error rendering ${p.name}:`, e);
        }
      });
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
        const { x, y } = safeProject(raDeg, decDeg);
        if (!isNaN(x) && !isNaN(y)) {
          bodies.push(
            <g key="moon" className="moon">
              <circle
                cx={x}
                cy={y}
                r={Math.max(18, starRadius(-1, sizeMult))}
                fill="#dfe9f5"
              />
              <text x={x + 10} y={y + 5} fill="#cdd9ea" fontSize="12">
                Moon
              </text>
            </g>
          );
        }
      } catch (e) {
        console.error("Error rendering Moon:", e);
      }
    }

    return bodies;
  }, [
    showPlanets,
    showMoon,
    showPlanetNames,
    safeProject,
    sizeMult,
    lat,
    lon,
    mapStyle.date,
  ]);

  // Memoized graticule
  const graticule = useMemo(() => {
    if (!mapStyle.showGraticule) return null;

    const graticuleData = d3.geoGraticule10();
    const pathGen = d3.geoPath(projection);

    return (
      <path
        d={pathGen(graticuleData)}
        fill="none"
        stroke="rgba(200,200,200,0.3)"
        strokeWidth="0.5"
        className="graticule"
      />
    );
  }, [projection, mapStyle.showGraticule]);

  // Optimized shape transform calculation
  const getShapeTransform = useCallback((shape) => {
    const transforms = {
      circle: "translate(18,18) scale(.97)",
      apple: "translate(-30, -10) scale(1.11)",
      heart: "translate(-207, -450) scale(1.35)",
      triangle: "translate(-60,-10) scale(1.1)",
      rect: "translate(0,0) scale(1.2, 1.5)", // Adjusted for better fit
    };

    return transforms[shape] || transforms.circle;
  }, []);

  const shapeTransform = getShapeTransform(maskShape);

  return (
    <>
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
          preserveAspectRatio={maskShape === "rect" ? "none" : "xMidYMid meet"}
        >
          <defs>
            <clipPath id="maskShape" transform={shapeTransform}>
              {maskShape === "circle" ? (
                <circle cx="600" cy="600" r="600" />
              ) : (
                maskElement
              )}
            </clipPath>

            {/* Enhanced star glow for better visibility */}
            <filter id="starGlow" height="300%" width="300%" x="-75%" y="-75%">
              <feMorphology
                operator="dilate"
                radius="2"
                in="SourceAlpha"
                result="thicken"
              />
              <feGaussianBlur in="thicken" stdDeviation="3" result="blurred" />
              <feFlood
                floodColor="white"
                floodOpacity="0.4"
                result="glowColor"
              />
              <feComposite
                in="glowColor"
                in2="blurred"
                operator="in"
                result="softGlow"
              />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g clipPath="url(#maskShape)">
            {(mapStyle.bgType === "color" || mapStyle.bgType === "both") && (
              <rect
                x="0"
                y="0"
                width="1200"
                height="1200"
                fill={
                  mapStyle.fill && mapStyle.fill !== "transparent"
                    ? mapStyle.fill
                    : "black"
                }
              />
            )}

            {(mapStyle.bgType === "image" || mapStyle.bgType === "both") &&
              mapStyle.bgImage && (
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

            <g id="mwLayer">{milkyWay}</g>
            <g
              id="starsLayer"
              filter={mapStyle.enhanceStars ? "url(#starGlow)" : undefined}
            >
              {stars}
            </g>
            <g id="constLinesLayer">{constellations.lines}</g>
            <g id="constLabelsLayer">{constellations.labels}</g>
            <g id="planetsLayer">{celestialBodies}</g>
            <g id="graticuleLayer">{graticule}</g>
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
    </>
  );
};

export default React.memo(Map);
