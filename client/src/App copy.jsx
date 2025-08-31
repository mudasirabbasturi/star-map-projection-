import { useState, Suspense, lazy } from "react";
import { MdOutlineEditNote, MdEdit } from "react-icons/md";
import { Spin, Drawer } from "antd";

const Sections = lazy(() => import("@components/sections/Sections"));
const Map = lazy(() => import("@components/map/Map"));

const App = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("poster");

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
      maskShape: "circle",
      bgColor: "trasparent",
      width: 90,
      height: 70,
      borderStyle: "solid",
      borderWidth: 1,
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
      width: 90,
      borderStyle: "solid",
      borderWidth: 0,
      borderRadius: 0,
      borderColor: "#eee",
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
    return style;
  };

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
              className="poster glb"
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

              {/* Poster Inner Wrapper */}
              <div
                className="posterWrapper glb"
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

                {/* Map   */}
                {/* <div
                  className="map glb"
                  style={{
                    width: `${styles.map.width}%`,
                    height: `${styles.map.height}%`,
                    background: styles.map.bgColor,
                    borderStyle: styles.map.borderStyle,
                    borderWidth: `${styles.map.borderWidth}px`,
                    borderRadius: `${styles.map.borderRadius}%`,
                    borderColor: styles.map.borderColor,
                  }}
                >
                  <div
                    className="editIconWrapper"
                    onClick={() => showDrawer("map")}
                  >
                    <MdOutlineEditNote className="editIcon" />
                  </div>
                </div> */}
                <Map
                  maskShape={styles.map.maskShape}
                  starsData={starsData}
                  sizeMult={styles.sizeMult || 1}
                  centerRA={centerRA}
                />
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
