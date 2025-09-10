import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Drawer, notification, Spin, List } from "antd";
import { MdOutlineEditNote } from "react-icons/md";
import { AiFillFilePdf } from "react-icons/ai";

const Sidebar = lazy(() => import("./components/Sidebar"));
const PosterSetting = lazy(() => import("./components/setting/PosterSetting"));
const PosterWrapperSetting = lazy(() =>
  import("./components/setting/PosterWrapperSetting")
);
const ContentSetting = lazy(() =>
  import("./components/setting/ContentSetting")
);
const MapSetting = lazy(() => import("./components/setting/MapSetting"));
const Map = lazy(() => import("./components/Map"));

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
    borderColor: "#ffff",
    posterWrapper: {
      width: 90,
      height: 90,
      bgColor: "transparent",
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 0,
      borderColor: "#ffff",
    },
    map: {
      width: 90,
      height: null,
      maskShape: "circle",
      fill: "transparent",
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
      lon: -0.1,
    },
    content: {
      width: 90,
      height: 15,
      bgColor: "transparent",
      fontFamily: "Verdana",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 14,
      textColor: "#ffff",
      textTransform: "capitalize",
      textDecoration: "none",
      borderStyle: "none",
      borderWidth: 0,
      borderRadius: 0,
      borderColor: "#ffff",
      title: {
        fontFamily: "Verdana",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 16,
        textColor: "#ffff",
        textTransform: "capitalize",
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

  // stars,map state
  const [starsData, setStarsData] = useState({ features: [] });
  const [mwData, setMwData] = useState({ features: [] });
  const [constData, setConstData] = useState({ features: [] });
  const [centerRA, setCenterRA] = useState(0);

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

  // drawer
  const drawerTitles = {
    poster: "Poster Settings",
    posterWrapper: "Inner Poster Settings",
    map: "Map Settings",
    content: "Content Setting",
    showDownloadFiles: "Downloaded files",
    showImportFiles: "All Save Styles",
  };
  const [drawerMode, setDrawerMode] = useState(null);
  const [open, setOpen] = useState(null);

  const showDrawer = (mode) => {
    fetchFiles();
    setDrawerMode(mode);
    setOpen(true);
  };
  const closeDrawer = () => {
    setDrawerMode(null);
    setOpen(null);
    setFiles([]);
    setStyleFiles([]);
  };

  // notification
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

  // screen shot
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

  // Export
  const handleExport = async () => {
    try {
      const finalState = { positions, styles, content };
      const res = await fetch("http://localhost:3001/api/export-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalState),
      });
      if (!res.ok) throw new Error("Export request failed");
      const data = await res.json();
      if (data.success) {
        openNotificationWithIcon(data.fileName, data.folder, data.url);
        console.log("✅ File saved at:", data.url);
      } else {
        api.error({
          message: "❌ Export failed",
          description: data.message || "Unknown error",
        });
      }
    } catch (err) {
      console.error("Export error:", err);
      api.error({
        message: "❌ Error exporting file",
        description: err.message,
      });
    }
  };

  // import
  const handleImport = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedState = JSON.parse(e.target.result);
        if (importedState.positions) setPositions(importedState.positions);
        if (importedState.styles) setStyles(importedState.styles);
        if (importedState.content) setContent(importedState.content);
        setLoading(false);
      } catch (err) {
        console.error("Failed to import JSON:", err);
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (open && drawerMode === "showDownloadFiles") {
      fetchFiles();
    }
    if (open && drawerMode === "showImportFiles") {
      fetchStyleFiles();
    }
  }, [open, drawerMode]);

  const [files, setFiles] = useState([]);
  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/files/posters");
      const data = await res.json();
      if (data.success) setFiles(data.files);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const [styleFiles, setStyleFiles] = useState([]);
  const fetchStyleFiles = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/files/styles");
      const data = await res.json();
      if (data.success)
        setStyleFiles(data.files.filter((f) => f.endsWith(".json")));
    } catch (err) {
      console.error("Error fetching style files:", err);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="app-container">
        <Sidebar
          loading={loading}
          showDrawer={showDrawer}
          handleScreenShot={handleScreenShot}
          handleExport={handleExport}
          handleImport={handleImport}
        />
        <div className="main-body">
          <Spin spinning={loading} tip="Generating poster..." size="large">
            <Suspense fallback={<div>Loading Map...</div>}>
              <div
                ref={canvasRef}
                className={`poster hasIcon `}
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
                  className={`posterWrapper hasIcon`}
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
                  {/* Map */}
                  <div
                    className={`map hasIcon `}
                    style={{
                      width: `${styles.map.width}%`,
                      height: `${styles.map.height}%`,
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
                    <Map
                      mapData={{ starsData, mwData, constData, centerRA }}
                      mapStyle={styles.map}
                    />
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
        width={drawerMode === "showDownloadFiles" ? "100%" : null}
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
            ) : drawerMode === "map" ? (
              <MapSetting
                styles={styles}
                updateStyles={updateStyles}
                content={content}
                onChangeContent={onChangeContent}
              />
            ) : drawerMode === "showDownloadFiles" ? (
              <>
                <div className="d-flex flex-wrap">
                  {files.map((file, index) => {
                    const isPdf = file.toLowerCase().endsWith(".pdf");
                    const url = `http://localhost:5173/files/posters/${file}`;

                    return (
                      <div
                        key={index}
                        className="img_pdf border mb-3 me-3 p-2 d-flex flex-column align-items-center justify-content-center"
                        style={{ width: "23%" }}
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-100 d-flex justify-content-center"
                          style={{ textDecoration: "none" }}
                        >
                          {isPdf ? (
                            <AiFillFilePdf size={64} color="red" />
                          ) : (
                            <img
                              src={url}
                              alt={`Poster ${index + 1}`}
                              className="img-fluid w-100"
                            />
                          )}
                        </a>
                        <div
                          className="mt-2 text-truncate w-100 text-center"
                          style={{ fontSize: "0.9rem" }}
                          title={file}
                        >
                          {file}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : drawerMode === "showImportFiles" ? (
              <>
                <div className="p-3">
                  {styleFiles.length === 0 ? (
                    <div>No style files found.</div>
                  ) : (
                    styleFiles.map((file, idx) => {
                      const url = `http://localhost:5173/files/styles/${file}`;
                      return (
                        <div
                          key={idx}
                          className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center"
                        >
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "70%" }}
                          >
                            {file}
                          </span>
                          <button
                            className="btn btn-sm btn-primary"
                            // onClick={() => handleSelectStyle(url)}
                          >
                            Import
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              ""
            )}
          </Suspense>
        )}
      </Drawer>
    </>
  );
};

export default App;
