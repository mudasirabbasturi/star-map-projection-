// src/App.jsx
import { useState, useEffect, Suspense, lazy } from "react";
import { MdOutlineEditNote } from "react-icons/md";
import { Spin, Drawer } from "antd";

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

  return (
    <>
      <div className="app-container">
        <div className="main-body">
          <Spin spinning={loading} tip="Generating poster..." size="large">
            <div
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

            <div
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                background: "#eee",
                color: "black",
                padding: "4px 8px",
              }}
            >
              <span>
                Paper Size: <b>{styles.poster.paperSize}</b>
              </span>
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
