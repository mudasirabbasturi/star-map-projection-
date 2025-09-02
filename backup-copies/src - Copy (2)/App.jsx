// src/App.jsx
import { useState, useRef, useEffect, Suspense, lazy } from "react";
import { MdOutlineEditNote } from "react-icons/md";
import { Spin, Drawer } from "antd";

const Sidebar = lazy(() => import("@components/sidebar/Sidebar"));
const Sections = lazy(() => import("@components/sections/Sections"));
const Map = lazy(() => import("@components/map/Map"));

const App = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState(null);

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
      height: 70,
      maskShape: "circle",
      bgColor: "transparent",
      strokeColor: "#eee",
      strokeStyle: "solid", // solid | dashed | dotted | double | none
      strokeWidth: 1,
      showStars: true,
      showMilkyway: true,
      showConstellations: true,
      showPlanets: true,
      showMoon: true,
    },
    moment: {
      fontFamily: "Arial, sans-serif",
      fontStyle: "normal",
      fontWeight: "normal",
      textDecoration: "none",
      fontSize: 16,
      textColor: "#000000",
      bgColor: "#ffffff",
      width: 90,
      borderStyle: "solid",
      borderWidth: 0,
      borderRadius: 0,
      borderColor: "#eee",
    },
  });

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

  const updateSectionStyle = (section, newStyle) => {
    setStyles((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...newStyle },
    }));
  };

  const showDrawer = (section) => {
    setDrawerMode(section);
    setOpen(true);
  };
  const hideDrawer = () => {
    setDrawerMode(null);
    setOpen(false);
  };
  const getFinalStyle = (section) => styles[section] || {};

  const drawerTitles = {
    poster: "Poster Settings",
    posterWrapper: "Inner Poster Settings",
    map: "Map Settings",
    moment: "Moment Settings",
  };
  const canvasRef = useRef(null);
  const handleScreenShot = async () => {
    if (!canvasRef.current) return;
    setLoading(true);
    try {
      const htmlContent = canvasRef.current.outerHTML;
      const styles = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("");
          } catch (e) {
            return "";
          }
        })
        .join("\n");
      const fullHTML = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>${styles}</style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
      const response = await fetch("http://localhost:3001/api/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: fullHTML, width: 2480, height: 3508 }),
      });
      if (!response.ok) throw new Error("Failed to capture screenshot");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "screenshot.png";
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
        <Sidebar handleScreenShot={handleScreenShot} />
        <div className="main-body">
          <Spin spinning={loading} tip="Generating poster..." size="large">
            <div
              ref={canvasRef}
              className={`poster glb ${
                drawerMode === "poster" ? "active" : ""
              }`}
              style={{
                minHeight: "100vh",
                background: styles.poster.bgColor,
                borderStyle: styles.poster.borderStyle,
                borderWidth: `${styles.poster.borderWidth}px`,
                borderRadius: `${styles.poster.borderRadius}%`,
                borderColor: styles.poster.borderColor,
              }}
            >
              <div
                className="editIconWrapper"
                onClick={() => showDrawer("poster")}
              >
                <MdOutlineEditNote className="editIcon" />
              </div>

              <div
                className={`posterWrapper glb ${
                  drawerMode === "posterWrapper" ? "active" : ""
                }`}
                style={{
                  width: `${styles.posterWrapper.width}%`,
                  height: `${styles.posterWrapper.height}%`,
                  background: styles.posterWrapper.bgColor,
                  borderStyle: styles.posterWrapper.borderStyle,
                  borderWidth: `${styles.posterWrapper.borderWidth}px`,
                  borderRadius: `${styles.posterWrapper.borderRadius}%`,
                  borderColor: styles.posterWrapper.borderColor,
                }}
              >
                <div
                  className="editIconWrapper"
                  onClick={() => showDrawer("posterWrapper")}
                >
                  <MdOutlineEditNote className="editIcon" />
                </div>
                <div
                  className={`map glb ${drawerMode === "map" ? "active" : ""}`}
                  style={{
                    width: `${styles.map.width}%`,
                    height: `${styles.map.height}%`,
                  }}
                >
                  <div
                    className="editIconWrapper"
                    onClick={() => showDrawer("map")}
                  >
                    <MdOutlineEditNote className="editIcon" />
                  </div>
                  <Map
                    maskShape={styles.map.maskShape}
                    starsData={starsData}
                    mwData={mwData}
                    constData={constData}
                    showStars={styles.map.showStars}
                    showMilkyway={styles.map.showMilkyway}
                    showConstellations={styles.map.showConstellations}
                    showPlanets={styles.map.showPlanets}
                    showMoon={styles.map.showMoon}
                    sizeMult={styles.map.sizeMult || 1}
                    magLimit={styles.map.magLimit || 6.5}
                    milkywayOpacity={styles.map.milkywayOpacity || 0.2}
                    centerRA={centerRA}
                    strokeColor={styles.map.strokeColor}
                    strokeWidth={styles.map.strokeWidth}
                    strokeStyle={styles.map.strokeStyle}
                    fill={styles.map.bgColor}
                    lat={styles.map.lat || 51.5}
                    lon={styles.map.lon || -0.1}
                  />
                </div>
              </div>
            </div>
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
          <Suspense fallback={<div>Loading...</div>}>
            <Sections
              drawerMode={drawerMode}
              styles={getFinalStyle(drawerMode)}
              setStyles={(s) => updateSectionStyle(drawerMode, s)}
              fontFamilies={["Arial", "Roboto", "Times New Roman"]}
            />
          </Suspense>
        )}
      </Drawer>
    </>
  );
};

export default App;
