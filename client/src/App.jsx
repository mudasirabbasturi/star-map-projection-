import { useState, useRef, Suspense } from "react";
import { Drawer, notification, Spin } from "antd";
import { MdOutlineEditNote } from "react-icons/md";
import Sidebar from "./components/Sidebar";
import PosterSetting from "./components/setting/PosterSetting";
import PosterWrapperSetting from "./components/setting/PosterWrapperSetting";
import ContentBodySetting from "./components/setting/ContentBodySetting";

const App = () => {
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const [api, contextHolder] = notification.useNotification();
  const [positions, setPositions] = useState({
    contentTitle: { y: 5 },
    map: { y: 10 },
    contentBody: { y: 70 },
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
    bgColor: "#020202ff",
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
    contentTitle: {
      width: 90,
    },
    contentBody: {
      width: 90,
      height: null,
      bgColor: "transparent",
      fontSize: 14,
      fontFamily: "Verdana",
      fontStyle: "normal",
      fontWeight: "normal",
      textColor: "#ff9c6e",
      textTransform: "capitalize",
      textDecoration: "none",
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 0,
      borderColor: "#7c5cffcc",
    },
  });

  // content state
  const [content, setContent] = useState({
    downloadType: "pdf",
    fileName: "Poster",
    message: "look up at the stars",
    title: "my star map",
    address: "london, uk",
    date: new Date().toISOString().split("T")[0],
    coordinate: "51.5°N, 0.1°W",
  });

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

  const onChangeContent = (key, value) =>
    setContent((prev) => ({ ...prev, [key]: value }));

  const drawerTitles = {
    poster: "Poster Settings",
    posterWrapper: "Inner Poster Settings",
    map: "Map Settings",
    contentTitle: "Title Settings",
    contentBody: "Text Setting",
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
                  backgroundColor: styles.bgColor,
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
                    Map
                  </div>
                  <div
                    className={`contentTitle hasIcon ${
                      drawerMode === "contentTitle" ? "active" : ""
                    }`}
                    style={{
                      width: `${styles.contentTitle.width}%`,
                      top: `${positions.contentTitle.y}%`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "contentTitle")}
                  >
                    <div
                      className="iconWrapper"
                      onClick={() => showDrawer("contentTitle")}
                    >
                      <MdOutlineEditNote className="editIcon" />
                    </div>
                    contentTitle
                  </div>
                  <div
                    className={`contentBody hasIcon ${
                      drawerMode === "contentBody" ? "active" : ""
                    }`}
                    style={{
                      width: `${styles.contentBody.width}%`,
                      backgroundColor: styles.contentBody.bgColor,
                      top: `${positions.contentBody.y}%`,
                      color: styles.contentBody.textColor,
                      fontSize: styles.contentBody.fontSize,
                      fontFamily: styles.contentBody.fontFamily,
                      fontStyle: styles.contentBody.fontStyle,
                      fontWeight: styles.contentBody.fontWeight,
                      textTransform: styles.contentBody.textTransform,
                      textDecoration: styles.contentBody.textDecoration,
                      borderStyle: styles.contentBody.borderStyle,
                      borderWidth: `${styles.contentBody.borderWidth}px`,
                      borderRadius: `${styles.contentBody.borderRadius}%`,
                      borderColor: styles.contentBody.borderColor,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "contentBody")}
                  >
                    <div
                      className="iconWrapper"
                      onClick={() => showDrawer("contentBody")}
                    >
                      <MdOutlineEditNote className="editIcon" />
                    </div>
                    <div className="address">{content.address}</div>
                    <div className="address">{content.date}</div>
                    <div className="address">{content.message}</div>
                    <div className="address">{content.coordinate}</div>
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
            ) : drawerMode === "contentBody" ? (
              <ContentBodySetting
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
