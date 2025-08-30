import { useEffect, useRef } from "react";

const CelestialMap = () => {
  const containerRef = useRef();
  const canvasRef = useRef();

  // Convert parametric heart to SVG path string
  const getHeartPath = (width, height) => {
    let xMin = Infinity,
      xMax = -Infinity,
      yMin = Infinity,
      yMax = -Infinity;

    const points = [];
    for (let t = 0; t < Math.PI * 2; t += 0.01) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );
      points.push({ x, y });
      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }

    const heartWidth = xMax - xMin;
    const heartHeight = yMax - yMin;
    const scaleX = width / heartWidth;
    const scaleY = height / heartHeight;
    const scale = Math.min(scaleX, scaleY) * 0.95;

    const offsetX = (xMin + xMax) / 2;
    const offsetY = (yMin + yMax) / 2;

    // Build SVG path string
    let path = "";
    points.forEach((p, i) => {
      const px = width / 2 + (p.x - offsetX) * scale;
      const py = height / 2 + (p.y - offsetY) * scale;
      path += i === 0 ? `M${px},${py}` : ` L${px},${py}`;
    });
    path += " Z";
    return path;
  };

  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        s.onerror = reject;
        document.body.appendChild(s);
      });

    const initCelestial = async () => {
      await loadScript("/d3.min.js");
      await loadScript("/d3.geo.projection.min.js");
      await loadScript("/celestial.min.js");

      const canvas = canvasRef.current;

      if (window.Celestial) {
        window.Celestial.display({
          container: canvas,
          width: canvas.width,
          height: canvas.height,
          form: false, // Canvas mode
          interactive: false,
          advanced: false,
          disableAnimations: true,
          projection: "airy",
          transform: "equatorial",
          follow: "zenith",
          geopos: [36.525321, -121.815916],
          lines: { graticule: { show: false } },
          datapath: "https://ofrohn.github.io/data/",
          stars: { colors: true, size: 7, limit: 6 },
          mw: { show: true, style: { fill: "#ffffff", opacity: 0.02 } },
        });
      }
    };

    initCelestial();
  }, []);

  const heartPath = getHeartPath(600, 600);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        backgroundColor: "red",
        margin: "0 auto",
        position: "relative",
        clipPath: `path('${heartPath}')`,
        WebkitClipPath: `path('${heartPath}')`,
        background: "black",
      }}
    >
      <canvas
        ref={canvasRef}
        // width={600}
        // height={600}
        style={{ display: "block", backgroundColor: "green", width: "100%" }}
      />
      {/* Heart outline */}
      <svg
        // width="600"
        // height="600"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          background: "blue",
          width: "100%",
        }}
      >
        <path d={heartPath} stroke="white" fill="none" strokeWidth="3" />
      </svg>
    </div>
  );
};

export default CelestialMap;
