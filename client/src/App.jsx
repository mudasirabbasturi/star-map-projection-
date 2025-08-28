import { useState, Suspense, lazy } from "react";
import { MdOutlineEditNote } from "react-icons/md";
import { Spin, Drawer } from "antd";
const Poster = lazy(() => import("@components/Poster/Poster"));
const Map = lazy(() => import("@components/Map/Map"));
const Main = lazy(() => import("@components/moment/pages/Main/Main"));
import MomentContent from "@components/moment/MomentContent";
const NodeStyle = lazy(() =>
  import("@components/moment/pages/NodeStyle/NodeStyle")
);

const App = () => {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState({
    map: { x: 0, y: 0 },
    momentContent: { x: 0, y: 0 },
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

  const [open, setOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("momentContent");

  const showDrawer = (mode) => {
    if (!open) {
      setDrawerMode(mode);
      setOpen(true);
    } else if (drawerMode !== mode) {
      setDrawerMode(mode);
    }
  };
  const hideDrawer = () => setOpen(false);

  const [posterStyles, setPosterStyles] = useState({
    bgColor: "#ffffff",
  });

  const [mapStyles, setMapStyles] = useState({
    bgColor: "trasparent",
  });

  const [styles, setStyles] = useState({
    fontFamily: "Arial, sans-serif",
    fontStyle: "normal",
    fontWeight: "normal",
    textDecoration: "none",
    fontSize: 16,
    textColor: "#000000",
    bgColor: "trasparent",
    width: 90,
    visibleNodes: {
      address: true,
      date: true,
      message: true,
      title: true,
      coordinate: true,
    },
  });

  const [nodeStyles, setNodeStyles] = useState({
    address: {},
    date: {},
    message: {},
    title: {},
    coordinate: {},
  });

  const getFinalStyle = (node) => {
    return {
      ...styles,
      ...nodeStyles[node],
    };
  };

  const fontFamilies = [
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Roboto", value: "Roboto, sans-serif" },
    { label: "Times New Roman", value: "Times New Roman, serif" },
    { label: "Courier New", value: "Courier New, monospace" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
  ];

  return (
    <>
      <div className="app-container">
        <div className="main-body">
          <Spin spinning={loading} tip="Generating poster..." size="large">
            <div
              className={`poster glb ${loading ? "download-mode" : ""}`}
              style={{
                position: "relative",
                backgroundColor: posterStyles.bgColor,
              }}
            >
              <div
                className="editIconWrapper"
                onClick={() => showDrawer("poster")}
              >
                <MdOutlineEditNote className="editIcon" />
              </div>
              <Map handleMouseDown={handleMouseDown} positions={positions} />
              <MomentContent
                positions={positions}
                getFinalStyle={getFinalStyle}
                styles={styles}
                handleMouseDown={handleMouseDown}
                showDrawer={showDrawer}
              />
            </div>
          </Spin>
        </div>
      </div>
      <Drawer
        title={
          drawerMode === "poster"
            ? "Main Poster Setting & Style"
            : drawerMode === "momentContent"
            ? "Content Settings"
            : drawerMode === "address"
            ? "Address Setting"
            : drawerMode === "date"
            ? "Date Setting"
            : drawerMode === "message"
            ? "Message Setting"
            : drawerMode === "title"
            ? "Title Setting"
            : drawerMode === "coordinate"
            ? "Coordinate Setting"
            : null
        }
        open={open}
        onClose={hideDrawer}
        placement="left"
        width="300px"
        mask={false}
      >
        {open && (
          <Suspense fallback={<div>Loading...</div>}>
            {drawerMode === "poster" ? (
              <Poster
                posterStyles={posterStyles}
                setPosterStyles={setPosterStyles}
              />
            ) : drawerMode === "momentContent" ? (
              <Main
                styles={styles}
                setStyles={setStyles}
                fontFamilies={fontFamilies}
              />
            ) : (
              <NodeStyle
                styles={getFinalStyle(drawerMode)}
                setStyles={(newStyle) =>
                  setNodeStyles((prev) => ({
                    ...prev,
                    [drawerMode]: { ...prev[drawerMode], ...newStyle },
                  }))
                }
                fontFamilies={fontFamilies}
              />
            )}
          </Suspense>
        )}
      </Drawer>
    </>
  );
};

export default App;
