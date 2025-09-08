import { useState, useRef, Suspense } from "react";
import { Drawer, notification, Spin } from "antd";
import { MdOutlineEditNote } from "react-icons/md";
import Sidebar from "./components/Sidebar";
import PosterSetting from "./components/setting/PosterSetting";
import PosterWrapperSetting from "./components/setting/PosterWrapperSetting";
import ContentSetting from "./components/setting/ContentSetting";
import Map from "./components/Map";

const App = () => {
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const [api, contextHolder] = notification.useNotification();
  const [positions, setPositions] = useState({
    map: { y: 12 },
    title: { y: 4 },
    content: { y: 80 },
  });
  const [dragging, setDragging] = useState(false);
  const handleMouseDown = (e, element) => {
    e.preventDefault();
    setDragging(true);
    const startY = e.clientY;
    const wrapper = e.currentTarget.parentElement;
    const wrapperHeight = wrapper.offsetHeight;
    const initialPercent = positions[element].y;
    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startY;
      const deltaPercent = (deltaY / wrapperHeight) * 100;
      setPositions((prev) => ({
        ...prev,
        [element]: { y: initialPercent + deltaPercent },
      }));
    };
    const handleMouseUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // unified state for all styles
  const [styles, setStyles] = useState({
    paperSize: "A4",
    bgType: "solid",
    bgColor: "#020202ff",
    bgGradientColor: ["#a80077ff", "#66ff00"],
    bgGradientType: "linear", // linear | radial | conic
    bgGradientAngle: 90, // only for linear/conic
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 0,
    borderColor: "#7c5cffcc",
    posterWrapper: {
      width: 90,
      height: 90,
      bgColor: "transparent",
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 0,
      borderColor: "#7c5cffcc",
    },
    map: {
      width: 90,
    },
    content: {
      width: 90,
      height: 15,
      bgColor: "transparent",
      fontFamily: "Verdana",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 14,
      textColor: "#ff9c6e",
      textTransform: "capitalize",
      textDecoration: "none",
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 0,
      borderColor: "#7c5cffcc",
      title: {
        fontFamily: "Verdana",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 16,
        textColor: "#ff783aff",
        textTransform: "none",
        textDecoration: "none",
      },
    },
    show: {
      title: true,
      address: true,
      message: true,
      date: true,
      time: true,
      coordinate: true,
    },
  });

  const getBackground = () => {
    if (styles.bgType === "solid") return styles.bgColor;
    const colors = styles.bgGradientColor.join(", ");
    if (styles.bgGradientType === "linear") {
      return `linear-gradient(${styles.bgGradientAngle}deg, ${colors})`;
    }
    if (styles.bgGradientType === "radial") {
      return `radial-gradient(circle, ${colors})`;
    }
    if (styles.bgGradientType === "conic") {
      return `conic-gradient(from ${styles.bgGradientAngle}deg, ${colors})`;
    }
  };

  // generic updater for any nested path
  const updateStyles = (path, value) => {
    setStyles((prev) => {
      const keys = path.split(".");
      const newState = { ...prev };
      let temp = newState;
      keys.forEach((key, idx) => {
        if (idx === keys.length - 1) temp[key] = value;
        else temp[key] = { ...temp[key] };
        temp = temp[key];
      });
      return newState;
    });
  };

  // content state
  const [content, setContent] = useState({
    downloadType: "pdf",
    fileName: "Poster",
    message: "look up at the stars",
    title: "my star map",
    address: "london, uk",
    date: new Date().toISOString().split("T")[0],
    time: new Date()
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase(),
    coordinate: "51.5°N, 0.1°W",
  });
  const onChangeContent = (key, value) =>
    setContent((prev) => ({ ...prev, [key]: value }));

  const drawerTitles = {
    poster: "Poster Settings",
    posterWrapper: "Inner Poster Settings",
    map: "Map Settings",
    content: "Content Setting",
  };
  const [drawerMode, setDrawerMode] = useState(null);
  const [open, setOpen] = useState(null);

  const showDrawer = (mode) => {
    setDrawerMode(mode);
    setOpen(true);
  };
  const closeDrawer = () => {
    setDrawerMode(null);
    setOpen(null);
  };

  const openNotificationWithIcon = (fileName, folder, url) => {
    api.success({
      message: `✅ ${fileName} saved!`,
      description: (
        <span>
          Saved in folder: <b>{folder}</b> <br />
          <a href={url} target="_blank" rel="noreferrer">
            Open File
          </a>
        </span>
      ),
      duration: 6,
    });
  };

  const handleScreenShot = async () => {
    if (!canvasRef.current) return;
    setLoading(true);
    try {
      const htmlContent = canvasRef.current.outerHTML;
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
        <head><meta charset="UTF-8"><style>${cssText}</style></head>
        <body>${htmlContent}</body>
      </html>`;

      const response = await fetch("http://localhost:3001/api/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: fullHTML,
          paperSize: styles.paperSize,
          fileName: content.fileName,
          downloadType: content.downloadType,
        }),
      });
      if (!response.ok) throw new Error("Failed to capture screenshot");
      const data = await response.json();
      openNotificationWithIcon(data.fileName, data.folder, data.url);
      window.open(data.url, "_blank");
      console.log("✅ File saved:", data);
    } catch (err) {
      console.error("Error capturing screenshot:", err);
      api.error({
        message: "❌ Error saving file",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="app-container">
        <Sidebar loading={loading} handleScreenShot={handleScreenShot} />
        <div className="main-body">
          <Spin spinning={loading} tip="Generating poster..." size="large">
            <Suspense fallback={<div>Loading Map...</div>}>
              <div
                ref={canvasRef}
                className={`poster hasIcon ${
                  drawerMode === "poster" ? "active" : ""
                }`}
                style={{
                  background: getBackground(),
                  borderStyle: styles.borderStyle,
                  borderWidth: `${styles.borderWidth}px`,
                  borderRadius: `${styles.borderRadius}%`,
                  borderColor: styles.borderColor,
                }}
              >
                <div
                  className="iconWrapper"
                  onClick={() => showDrawer("poster")}
                >
                  <MdOutlineEditNote className="editIcon" />
                </div>
                <div
                  className={`posterWrapper hasIcon ${
                    drawerMode === "posterWrapper" ? "active" : ""
                  }`}
                  style={{
                    width: `${styles.posterWrapper.width}%`,
                    height: `${styles.posterWrapper.height}%`,
                    backgroundColor: styles.posterWrapper.bgColor,
                    borderStyle: styles.posterWrapper.borderStyle,
                    borderWidth: `${styles.posterWrapper.borderWidth}px`,
                    borderRadius: `${styles.posterWrapper.borderRadius}%`,
                    borderColor: styles.posterWrapper.borderColor,
                  }}
                >
                  <div
                    className="iconWrapper"
                    onClick={() => showDrawer("posterWrapper")}
                  >
                    <MdOutlineEditNote className="editIcon" />
                  </div>
                  <div
                    className={`map hasIcon ${
                      drawerMode === "map" ? "active" : ""
                    }`}
                    style={{
                      width: `${styles.map.width}%`,
                      top: `${positions.map.y}%`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "map")}
                  >
                    <div
                      className="iconWrapper"
                      onClick={() => showDrawer("map")}
                    >
                      <MdOutlineEditNote className="editIcon" />
                    </div>
                    <Map />
                  </div>
                  {styles.show.title && (
                    <div
                      className={`title hasIcon ${
                        drawerMode === "title" ? "active" : ""
                      }`}
                      style={{
                        top: `${positions.title.y}%`,
                        color: styles.content.title.textColor,
                        fontSize: styles.content.title.fontSize,
                        fontFamily: styles.content.title.fontFamily,
                        fontStyle: styles.content.title.fontStyle,
                        fontWeight: styles.content.title.fontWeight,
                        textTransform: styles.content.title.textTransform,
                        textDecoration: styles.content.title.textDecoration,
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e, "title");
                      }}
                    >
                      {content.title}
                    </div>
                  )}
                  <div
                    className={`content hasIcon ${
                      drawerMode === "content" ? "active" : ""
                    }`}
                    style={{
                      width: `${styles.content.width}%`,
                      height: `${styles.content.height}%`,
                      backgroundColor: styles.content.bgColor,
                      top: `${positions.content.y}%`,
                      color: styles.content.textColor,
                      fontSize: styles.content.fontSize,
                      fontFamily: styles.content.fontFamily,
                      fontStyle: styles.content.fontStyle,
                      fontWeight: styles.content.fontWeight,
                      textTransform: styles.content.textTransform,
                      textDecoration: styles.content.textDecoration,
                      borderStyle: styles.content.borderStyle,
                      borderWidth: `${styles.content.borderWidth}px`,
                      borderRadius: `${styles.content.borderRadius}%`,
                      borderColor: styles.content.borderColor,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "content")}
                  >
                    <div
                      className="iconWrapper"
                      onClick={() => showDrawer("content")}
                    >
                      <MdOutlineEditNote className="editIcon" />
                    </div>
                    {styles.show.address && (
                      <div className="address">{content.address}</div>
                    )}
                    {styles.show.date && (
                      <div className="date">
                        {content.date}
                        {styles.show.time && (
                          <span className="ms-1">{content.time}</span>
                        )}
                      </div>
                    )}
                    {styles.show.message && (
                      <div className="message">{content.message}</div>
                    )}
                    {styles.show.coordinate && (
                      <div className="coordinate">{content.coordinate}</div>
                    )}
                  </div>
                </div>
              </div>
            </Suspense>
          </Spin>
        </div>
      </div>

      <Drawer
        title={drawerTitles[drawerMode]}
        open={open}
        onClose={closeDrawer}
        mask={false}
        placement="left"
      >
        {open && (
          <Suspense fallback={<div>Loading Sections...</div>}>
            {drawerMode === "poster" ? (
              <PosterSetting
                styles={styles}
                updateStyles={updateStyles}
                content={content}
                onChangeContent={onChangeContent}
              />
            ) : drawerMode === "posterWrapper" ? (
              <PosterWrapperSetting
                styles={styles}
                updateStyles={updateStyles}
                content={content}
                onChangeContent={onChangeContent}
              />
            ) : drawerMode === "content" ? (
              <ContentSetting
                styles={styles}
                updateStyles={updateStyles}
                content={content}
                onChangeContent={onChangeContent}
              />
            ) : null}
          </Suspense>
        )}
      </Drawer>
    </>
  );
};

export default App;
