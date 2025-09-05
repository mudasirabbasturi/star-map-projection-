// src/App.jsx
import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Spin, Drawer } from "antd";

const Sidebar = lazy(() => import("@components/Sidebar"));
const PosterCanvas = lazy(() => import("@components/PosterCanvas"));
const Sections = lazy(() => import("@components/Sections"));

const App = () => {
  const webSafeFonts = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Trebuchet MS",
    "Impact",
    "Comic Sans MS",
  ];

  // Positions with X & Y for full draggable
  const [positions, setPositions] = useState({
    map: { x: 0, y: 0 },
    content: { x: 0, y: 0 },
    address: { x: 0, y: 0 },
    date: { x: 0, y: 0 },
    message: { x: 0, y: 0 },
    title: { x: 0, y: 0 },
    coordinate: { x: 0, y: 0 },
  });

  const handleMouseDown = (e, mode) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = positions[mode];

    const handleMouseMove = (e) => {
      setPositions((prev) => ({
        ...prev,
        [mode]: {
          x: startPos.x + (e.clientX - startX),
          y: startPos.y + (e.clientY - startY),
        },
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const [loading, setLoading] = useState(false);
  const [drawerMode, setDrawerMode] = useState(null);
  const [open, setOpen] = useState(false);

  const [starsData, setStarsData] = useState({ features: [] });
  const [mwData, setMwData] = useState({ features: [] });
  const [constData, setConstData] = useState({ features: [] });
  const [centerRA, setCenterRA] = useState(0);

  const [styles, setStyles] = useState({
    poster: {
      paperSize: "A4",
      bgColor: "#020202ff",
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 0,
      borderColor: "#eee",
    },
    posterWrapper: {
      bgColor: "transparent",
      width: 90,
      height: 90,
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 0,
      borderColor: "#eee",
    },
    map: {
      width: 90,
      height: null,
      maskShape: "circle",
      bgColor: "transparent",
      strokeColor: "#eee",
      strokeStyle: "solid",
      strokeWidth: 1,
      showStars: true,
      showMilkyway: true,
      milkywayOpacity: 0.2,
      showConstellations: true,
      showPlanets: true,
      showMoon: true,
      sizeMult: 1,
      magLimit: 6.5,
      lat: 51.5,
      log: -0.1,
    },
    content: {
      width: 90,
      height: 20,
      bgColor: "transparent",
      textColor: "#ff9c6e",
      fontFamily: "Verdana",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 14,
      textTransform: "capitalize",
      textDecoration: "none",
      borderStyle: "solid",
      borderWidth: 0,
      borderRadius: 0,
      borderColor: "#eee",
      show: {
        showMessage: true,
        showTitle: true,
        showAddress: true,
        showDate: true,
        showCoordinate: true,
      },
      nodes: {
        message: {
          width: 100,
        },
        title: {
          width: 100,
        },
        address: {
          width: 100,
        },
        date: {
          width: 100,
        },
        coordinate: {
          width: 100,
        },
      },
    },
  });

  const defaultContent = {
    message: "look up at the stars",
    title: "my star map",
    address: "london, uk",
    date: new Date().toISOString().split("T")[0],
    coordinate: "51.5°N, 0.1°W",
  };

  const [content, setContent] = useState(defaultContent);
  const onChangeContent = (newContent) => {
    setContent((prev) => ({ ...prev, ...newContent }));
  };

  const canvasRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/json/stars.6.json").then((r) => r.json()),
      fetch("/json/mw.json").then((r) => r.json()),
      fetch("/json/constellations.lines.json").then((r) => r.json()),
    ])
      .then(([stars, mw, constellations]) => {
        setStarsData(stars);
        setMwData(mw);
        setConstData(constellations);
      })
      .catch((err) => console.error("Failed to load JSON data:", err))
      .finally(() => setLoading(false));
  }, []);

  const updateSectionStyle = (path, newStyle) => {
    setStyles((prev) => {
      const keys = path.split(".");
      const updated = { ...prev };

      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];
      current[lastKey] = { ...current[lastKey], ...newStyle };
      return updated;
    });
  };

  const showDrawer = (section) => {
    setDrawerMode(section);
    setOpen(true);
  };
  const hideDrawer = () => {
    setDrawerMode(null);
    setOpen(false);
  };

  const getFinalStyle = (section) => {
    if (section in styles.content.nodes) {
      return { ...styles.content, ...styles.content.nodes[section] };
    }
    return styles[section] || {};
  };

  const drawerTitles = {
    poster: "Poster Settings",
    posterWrapper: "Inner Poster Settings",
    map: "Map Settings",
    content: "Content Settings",
    message: "Message Settings",
    title: "Title Settings",
    address: "Address Settings",
    date: "Date Settings",
    coordinate: "Coordinate Settings",
  };

  // ISO A sizes (in pixels at 300dpi) + extras
  const PAPER_SIZES = {
    A0: { width: 9933, height: 14043 },
    A1: { width: 7016, height: 9933 },
    A2: { width: 4961, height: 7016 },
    A3: { width: 3508, height: 4961 },
    A4: { width: 2480, height: 3508 },
    A5: { width: 1748, height: 2480 },
    A6: { width: 1240, height: 1748 },
    Letter: { width: 2550, height: 3300 },
    Legal: { width: 2550, height: 4200 },
    Tabloid: { width: 3300, height: 5100 },
    B0: { width: 10000, height: 14140 },
    B1: { width: 7070, height: 10000 },
    B2: { width: 5000, height: 7070 },
    B3: { width: 3530, height: 5000 },
    B4: { width: 2500, height: 3530 },
    B5: { width: 1760, height: 2500 },
    C0: { width: 9170, height: 12970 },
    C1: { width: 6480, height: 9170 },
    C2: { width: 4580, height: 6480 },
    C3: { width: 3240, height: 4580 },
    C4: { width: 2290, height: 3240 },
    C5: { width: 1620, height: 2290 },
  };

  const getPaperSize = (name) => {
    return PAPER_SIZES[name] || PAPER_SIZES["A4"];
  };

  const handleScreenShot = async () => {
    if (!canvasRef.current) return;
    setLoading(true);
    try {
      const htmlContent = canvasRef.current.outerHTML;
      const nodes = canvasRef.current.querySelectorAll(".textNode");
      let fontCSS = "";
      nodes.forEach((node) => {
        const className = node.className.split(" ")[0];
        const style = window.getComputedStyle(node);
        const fontSizePt = parseFloat(style.fontSize) * 0.75;
        fontCSS += `
        .${className} {
          font-size: ${fontSizePt}pt !important;
          font-family: ${style.fontFamily} !important;
          font-weight: ${style.fontWeight} !important;
          font-style: ${style.fontStyle} !important;
          text-transform: ${style.textTransform} !important;
          text-decoration: ${style.textDecoration} !important;
          color: ${style.color} !important;
          background-color: ${style.backgroundColor} !important;
        }
      `;
      });
      const cssText = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("");
          } catch {
            return "";
          }
        })
        .join("\n");
      const fullHTML = `<html>
      <head>
        <meta charset="UTF-8">
        <style>${cssText}${fontCSS}</style>
      </head>
      <body>${htmlContent}</body>
    </html>`;
      const response = await fetch("http://localhost:3001/api/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: fullHTML,
          paperSize: styles.poster.paperSize, // "A4", "A3", etc.
        }),
      });
      if (!response.ok) throw new Error("Failed to capture screenshot");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "poster.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error capturing screenshot:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="app-container">
        <Suspense fallback={<div>Loading Sidebar...</div>}>
          <Sidebar
            handleScreenShot={handleScreenShot}
            showDrawer={showDrawer}
          />
        </Suspense>
        <div className="main-body">
          <Spin spinning={loading} tip="Generating poster..." size="large">
            <Suspense fallback={<div>Loading Canvas...</div>}>
              <PosterCanvas
                canvasRef={canvasRef}
                drawerMode={drawerMode}
                showDrawer={showDrawer}
                mapData={{ starsData, mwData, constData, centerRA }}
                styles={styles}
                handleMouseDown={handleMouseDown}
                positions={positions}
                content={content}
                onChangeContent={onChangeContent}
                paperSize={getPaperSize(styles.poster.paperSize)}
              />
            </Suspense>
          </Spin>
        </div>
      </div>

      <Drawer
        title={drawerTitles[drawerMode]}
        open={open}
        onClose={hideDrawer}
        placement="left"
        width="300px"
        mask={false}
      >
        {open && (
          <Suspense fallback={<div>Loading Sections...</div>}>
            <Sections
              drawerMode={drawerMode}
              styles={getFinalStyle(drawerMode)}
              setStyles={(s) => updateSectionStyle(drawerMode, s)}
              fontFamilies={webSafeFonts}
              updateSectionStyle={updateSectionStyle}
              onChangeContent={onChangeContent}
              content={content}
              globalContentStyle={
                drawerMode && drawerMode.startsWith("content.")
                  ? styles.content
                  : null
              }
            />
          </Suspense>
        )}
      </Drawer>
    </>
  );
};

export default App;
