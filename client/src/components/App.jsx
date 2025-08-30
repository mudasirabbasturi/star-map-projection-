import { useState, Suspense, lazy } from "react";
import { MdOutlineEditNote, MdEdit } from "react-icons/md";
import { Spin, Drawer } from "antd";
import CelestialMap from "./CelestialMap";

const Sections = lazy(() => import("@components/sections/Sections"));

const App = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("poster");

  const [styles, setStyles] = useState({
    poster: {
      paperSize: "A4",
      bgColor: "#020202ff",
      borderStyle: "solid",
      borderWidth: 4,
      borderRadius: 0,
      borderColor: "#eee",
    },
    map: {
      bgColor: "transparent",
      width: 90,
      height: "auto",
      borderStyle: "solid",
      borderWidth: 0,
      borderRadius: 0,
      borderColor: "#eee",
    },
    moment: {
      fontFamily: "Arial, sans-serif",
      fontStyle: "normal",
      fontWeight: "normal",
      textDecoration: "none",
      fontSize: 16,
      textColor: "#000000",
      bgColor: "#ffffff",
    },
  });

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

  const hideDrawer = () => setOpen(false);

  const getFinalStyle = (section) => {
    const style = styles[section] || {};
    if (section === "map") {
      style.canvas = style.canvas || {
        bgColor: "transparent",
        width: 100,
        height: 100,
        borderStyle: "solid",
        borderWidth: 0,
        borderRadius: 0,
        borderColor: "#000",
      };
    }
    return style;
  };

  const drawerTitles = {
    poster: "Poster Settings",
    map: "Map Settings",
    moment: "Moment Settings",
  };

  return (
    <>
      <div className="app-container">
        <div className="main-body">
          <Spin spinning={loading} tip="Generating poster..." size="large">
            <div
              className="poster glb"
              style={{
                position: "relative",
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

              {/* Map Container */}
              <div
                className="map glb"
                style={{
                  position: "relative",
                  width: `${styles.map.width}%`,
                  height: `${styles.map.height}%`,
                  borderStyle: styles.map.borderStyle,
                  borderWidth: `${styles.map.borderWidth}px`,
                  borderRadius: `${styles.map.borderRadius}%`,
                  borderColor: styles.map.borderColor,
                  background: styles.map.bgColor,
                }}
              >
                <div
                  className="editIconWrapper"
                  onClick={() => showDrawer("map")}
                >
                  <MdEdit className="editIcon" />
                </div>

                {/* Celestial Map */}
                <CelestialMap />
              </div>
            </div>

            {/* Paper Size Display */}
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

      {/* Drawer for Section Settings */}
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
