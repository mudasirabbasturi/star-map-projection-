import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Drawer, notification, Spin, Upload, Button, Row, Col } from "antd";

import { MdOutlineEditNote } from "react-icons/md";
import { AiFillFilePdf } from "react-icons/ai";
import { CiTrash, CiImport } from "react-icons/ci";

const ShowHideElement = lazy(() =>
  import("./components/setting/ShowHideElement")
);
const PosterSetting = lazy(() => import("./components/setting/PosterSetting"));
const PosterWrapperSetting = lazy(() =>
  import("./components/setting/PosterWrapperSetting")
);
const ContentSetting = lazy(() =>
  import("./components/setting/ContentSetting")
);
import TitleSetting from "./components/setting/TitleSetting";
const MapSetting = lazy(() => import("./components/setting/MapSetting"));
const CustomImgSetting = lazy(() =>
  import("./components/setting/CustomImgSetting")
);

const Sidebar = lazy(() => import("./components/Sidebar"));
const Title = lazy(() => import("./components/Title"));
const Map = lazy(() => import("./components/Map"));
const CustomImg = lazy(() => import("./components/CustomImg"));
const Content = lazy(() => import("./components/Content"));

// Environment-aware bases:
// - ASSET_BASE (for static assets & files) reads from VITE_ASSET_BASE or falls back to "."
// - API_BASE (for backend API) reads from VITE_API_BASE or falls back to http://localhost:3001
// For Electron builds set VITE_ASSET_BASE="." in .env.production (or leave undefined and fallback will work)
const ASSET_BASE = import.meta.env.VITE_ASSET_BASE || ".";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

const customImage = `${ASSET_BASE}/imgs/starmap/default/couple.jpg`;

const App = () => {
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const [api, contextHolder] = notification.useNotification();
  const [positions, setPositions] = useState({
    map: { y: 12 },
    CustomImg: { y: 50 },
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
    const handleMouseMove = (ev) => {
      const deltaY = ev.clientY - startY;
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

  // unified state for styles
  const [styles, setStyles] = useState({
    paperSize: "A4",
    bgType: "solid",
    bgColor: "#020202ff",
    bgGradientColor: ["#a80077ff", "#66ff00"],
    bgGradientType: "linear", // linear | radial | conic
    bgGradientAngle: 90,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 0,
    borderColor: "#ffff",

    bgGradientColors: ["#a80077ff", "#66ff00"],
    bgImage: null,
    bgImageMode: "cover",
    bgImageOpacity: 0.7,

    posterWrapper: {
      width: 90,
      height: 92.6,
      bgColor: null,
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 0,
      borderColor: "#ffff",
    },
    map: {
      projection: "orthographic",
      width: 90,
      height: null,
      maskShape: "circle",
      fill: null,
      bgType: "none",
      bgImage: null,
      bgImageOpacity: 0.1,
      strokeColor: "#eee",
      strokeStyle: "solid",
      strokeWidth: 1,
      showStars: true,
      showMilkyway: true,
      milkywayOpacity: 0.2,
      showConstellations: true,
      showPlanets: true,
      showPlanetNames: true,
      showMoonName: false,
      showMoon: true,
      showGraticule: true,
      sizeMult: 1,
      magLimit: 6.5,
      date: new Date().toISOString(),
      lat: 51.5,
      lon: -0.1,
    },
    CustomImg: {
      imgSrc: customImage,
      width: 90,
      imgDimention: 25,
      bgColor: null,
      fontFamily: "Verdana",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 1.5,
      textColor: "#ffff",
      textTransform: "capitalize",
      textDecoration: "none",
    },
    content: {
      width: 90,
      height: 15,
      bgColor: null,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
      fontFamily: "Verdana",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 2,
      textColor: "#ffff",
      textTransform: "capitalize",
      textDecoration: "none",
      borderStyle: "none",
      borderWidth: 0,
      borderRadius: 0,
      borderColor: "#ffff",
      title: {
        width: 90,
        height: 5,
        bgColor: null,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        fontFamily: "Verdana",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 2.5,
        textColor: "#ffff",
        textTransform: "capitalize",
        textDecoration: "none",
        borderStyle: "none",
        borderWidth: 0,
        borderRadius: 0,
        borderColor: "#ffff",
      },
    },
    show: {
      title: true,
      content: true,
      address: true,
      message: true,
      date: true,
      time: true,
      coordinate: true,
      CustomImg: false,
      imgTxt_1: false,
      imgTxt_2: false,
      starMap: true,
      moonMap: false,
    },
  });

  const getBaseBackground = () => {
    if (styles.bgType === "solid") return styles.bgColor;
    if (styles.bgType === "gradient") {
      if (styles.bgGradientType === "linear") {
        return `linear-gradient(${
          styles.bgGradientAngle
        }deg, ${styles.bgGradientColors.join(", ")})`;
      }
      if (styles.bgGradientType === "radial") {
        return `radial-gradient(${styles.bgGradientColors.join(", ")})`;
      }
      if (styles.bgGradientType === "conic") {
        return `conic-gradient(from ${
          styles.bgGradientAngle
        }deg, ${styles.bgGradientColors.join(", ")})`;
      }
    }
    return "#fff";
  };

  const getImageOverlayStyle = () => {
    if (!styles.bgImage) return {};
    let backgroundSize = "cover";
    if (styles.bgImageMode === "contain") backgroundSize = "contain";
    if (styles.bgImageMode === "stretch") backgroundSize = "100% 100%";

    return {
      backgroundImage: `url(${styles.bgImage})`,
      backgroundSize,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      opacity: styles.bgImageOpacity,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: styles.borderRadius,
      pointerEvents: "none",
    };
  };

  // generic updater
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

  const [mediaTarget, setMediaTarget] = useState(null);

  // content
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
    text1: "Under These Stars",
    text2: "Our Story Began With Gentle Smiles",
  });
  const onChangeContent = (key, value) =>
    setContent((prev) => ({ ...prev, [key]: value }));

  // star data
  const [starsData, setStarsData] = useState({ features: [] });
  const [mwData, setMwData] = useState({ features: [] });
  const [constData, setConstData] = useState({ features: [] });
  const [centerRA, setCenterRA] = useState(0);

  // load JSON files — use ASSET_BASE so asset origin works for dev/prod/Electron
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${ASSET_BASE}/json/stars.6.json`).then((r) => r.json()),
      fetch(`${ASSET_BASE}/json/mw.json`).then((r) => r.json()),
      fetch(`${ASSET_BASE}/json/constellations.lines.json`).then((r) =>
        r.json()
      ),
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
    CustomImg: "Custom Image Settings",
    content: "Content Setting",
    title: "Title Setting",
    showDownloadImageFiles: "Downloaded Images, png,jpeg",
    showDownloadPdfFiles: "Downloaded PDF files",
    uploadSelectCustomeImg: (
      <>
        <div className="d-flex">
          <div className="me-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => showDrawer(parentDrawer || "CustomImg")}
            >
              back
            </button>
          </div>
          <div>Custom Images</div>
        </div>
      </>
    ),
    showImportFiles: "All Save Styles",
    show_hide: "Show And Hide Elements.",
  };
  const [drawerMode, setDrawerMode] = useState(null);
  const [parentDrawer, setParentDrawer] = useState(null);
  const [open, setOpen] = useState(null);

  const showDrawer = (mode, parent = null, target = null) => {
    if (mode === "uploadSelectCustomeImg") {
      setParentDrawer(drawerMode);
      if (parent && target) {
        setMediaTarget(`${parent}.${target}`);
      } else if (target) {
        setMediaTarget(target); // for root bgImage
      } else if (parent) {
        setMediaTarget(parent);
      }
    }
    // default fetch posters when opening drawer without type
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

  // screenshot — uses API_BASE
  const handleScreenShot = async () => {
    if (!canvasRef.current) return;
    setLoading(true);
    try {
      const canvas = canvasRef.current;
      const elements = canvas.querySelectorAll("*");
      elements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        el.setAttribute(
          "style",
          computed.cssText + ";" + (el.getAttribute("style") || "")
        );
      });
      const rootComputed = window.getComputedStyle(canvas);
      canvas.setAttribute(
        "style",
        rootComputed.cssText + ";" + (canvas.getAttribute("style") || "")
      );
      const htmlContent = canvas.outerHTML;
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
        <style>${cssText}</style>
      </head>
      <body>${htmlContent}</body>
    </html>`;

      const response = await fetch(`${API_BASE}/api/screenshot`, {
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
    } catch (err) {
      console.error("Error capturing screenshot:", err);
      api.error({ message: "❌ Error saving file", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // export styles
  const handleExport = async () => {
    try {
      const finalState = { positions, styles, content };
      const res = await fetch(`${API_BASE}/api/export-style`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalState),
      });
      if (!res.ok) throw new Error("Export request failed");
      const data = await res.json();
      if (data.success) {
        openNotificationWithIcon(data.fileName, data.folder, data.url);
        // If in Electron this will open the saved file via URL returned by backend
        if (window.electronAPI) window.open(data.url, "_blank");
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

  // import JSON (file input or url)
  const handleImport = async (input) => {
    setLoading(true);
    try {
      if (input?.target?.files?.[0]) {
        const file = input.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedState = JSON.parse(e.target.result);
            applyImportedState(importedState);
          } catch (err) {
            console.error("Failed to import JSON:", err);
            alert("Invalid JSON file.");
            setLoading(false);
          }
        };
        reader.readAsText(file);
      } else if (typeof input === "string") {
        const res = await fetch(input);
        const importedState = await res.json();
        applyImportedState(importedState);
      }
    } catch (err) {
      console.error("Failed to import JSON:", err);
      alert("Could not load JSON file.");
      setLoading(false);
    }
  };

  const applyImportedState = (importedState) => {
    if (importedState.positions) setPositions(importedState.positions);
    if (importedState.styles) setStyles(importedState.styles);
    if (importedState.content) setContent(importedState.content);
    setLoading(false);
  };

  useEffect(() => {
    if (!open) return;
    if (
      drawerMode === "showDownloadImageFiles" ||
      drawerMode === "showDownloadPdfFiles"
    ) {
      fetchFiles("posters");
    } else if (drawerMode === "showImportFiles") {
      fetchFiles("styles");
    } else if (drawerMode === "uploadSelectCustomeImg") {
      fetchFiles("customImgs");
    }
  }, [open, drawerMode]);

  const [files, setFiles] = useState([]);
  // default type 'posters' when not provided
  const fetchFiles = async (type = "posters") => {
    try {
      const res = await fetch(`${API_BASE}/api/files/${type}`);
      const data = await res.json();
      if (data.success) setFiles(data.files);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const [styleFiles, setStyleFiles] = useState([]);
  const fetchStyleFiles = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/files/styles`);
      const data = await res.json();
      if (data.success)
        setStyleFiles(data.files.filter((f) => f.endsWith(".json")));
    } catch (err) {
      console.error("Error fetching style files:", err);
    }
  };

  const handleDeleteFile = async (type, fileName) => {
    try {
      const res = await fetch(`${API_BASE}/api/files/${type}/${fileName}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        api.success({ message: "File deleted", description: data.message });
        if (type === "posters") fetchFiles("posters");
        if (type === "styles") fetchStyleFiles();
        if (type === "customImgs") fetchFiles("customImgs");
      } else {
        api.error({ message: "Delete failed", description: data.message });
      }
    } catch (err) {
      console.error("Delete error:", err);
      api.error({ message: "Delete error", description: err.message });
    }
  };

  // drawerTitles already defined above

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
                className={`poster hasIcon ${
                  drawerMode === "poster" ? "active" : ""
                }`}
                style={{
                  background: getBaseBackground(),
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
                <div style={getImageOverlayStyle()} />
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

                  <Map
                    mapData={{ starsData, mwData, constData, centerRA }}
                    mapStyle={styles.map}
                    showMap={styles.show}
                    showDrawer={showDrawer}
                    positions={positions}
                    handleMouseDown={handleMouseDown}
                    drawerMode={drawerMode}
                  />

                  <CustomImg
                    styles={styles}
                    positions={positions}
                    handleMouseDown={handleMouseDown}
                    showDrawer={showDrawer}
                    drawerMode={drawerMode}
                    content={content}
                  />

                  <Title
                    styles={styles}
                    positions={positions}
                    handleMouseDown={handleMouseDown}
                    showDrawer={showDrawer}
                    drawerMode={drawerMode}
                    content={content}
                  />

                  <Content
                    styles={styles}
                    positions={positions}
                    handleMouseDown={handleMouseDown}
                    showDrawer={showDrawer}
                    drawerMode={drawerMode}
                    content={content}
                  />
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
        width={
          drawerMode === "showDownloadImageFiles" ||
          drawerMode === "showDownloadPdfFiles"
            ? "100%"
            : null
        }
      >
        {open && (
          <Suspense fallback={<div>Loading Sections...</div>}>
            {drawerMode === "poster" ? (
              <PosterSetting
                styles={styles}
                updateStyles={updateStyles}
                content={content}
                onChangeContent={onChangeContent}
                showDrawer={showDrawer}
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
            ) : drawerMode === "title" ? (
              <TitleSetting
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
                showDrawer={showDrawer}
              />
            ) : drawerMode === "CustomImg" ? (
              <CustomImgSetting
                styles={styles}
                updateStyles={updateStyles}
                content={content}
                onChangeContent={onChangeContent}
                showDrawer={showDrawer}
              />
            ) : drawerMode === "showDownloadImageFiles" ? (
              <div className="d-flex flex-wrap">
                {files
                  .filter((file) =>
                    file.toLowerCase().match(/\.(jpg|jpeg|png)$/)
                  )
                  .map((file, index) => {
                    const url = `${ASSET_BASE}/files/posters/${file}`;
                    return (
                      <div
                        key={index}
                        className="img_pdf border mb-3 me-3 p-2 d-flex flex-column align-items-center justify-content-center"
                        style={{ width: "20%", position: "relative" }}
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-100 d-flex justify-content-center"
                          style={{ textDecoration: "none" }}
                        >
                          <img
                            src={url}
                            alt={`Poster ${index + 1}`}
                            className="img-fluid w-100"
                          />
                        </a>
                        <div
                          className="mt-2 text-truncate w-100 text-center"
                          style={{ fontSize: "0.9rem" }}
                          title={file}
                        >
                          {file}
                        </div>
                        <button
                          className="btn btn-sm btn-danger"
                          style={{ position: "absolute", top: 1, right: 1 }}
                          onClick={() => handleDeleteFile("posters", file)}
                        >
                          <CiTrash />
                        </button>
                      </div>
                    );
                  })}
              </div>
            ) : drawerMode === "showDownloadPdfFiles" ? (
              <div className="d-flex flex-wrap">
                {files
                  .filter((file) => file.toLowerCase().endsWith(".pdf"))
                  .map((file, index) => {
                    const url = `${ASSET_BASE}/files/posters/${file}`;
                    return (
                      <div
                        key={index}
                        className="img_pdf border mb-3 me-3 p-2 d-flex flex-column align-items-center justify-content-center"
                        style={{ width: "23%", position: "relative" }}
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-100 d-flex justify-content-center"
                          style={{ textDecoration: "none" }}
                        >
                          <AiFillFilePdf size={64} color="red" />
                        </a>
                        <div
                          className="mt-2 text-truncate w-100 text-center"
                          style={{ fontSize: "0.9rem" }}
                          title={file}
                        >
                          {file}
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          style={{ position: "absolute", top: 1, right: 1 }}
                          onClick={() => handleDeleteFile("posters", file)}
                        >
                          <CiTrash />
                        </button>
                      </div>
                    );
                  })}
              </div>
            ) : drawerMode === "showImportFiles" ? (
              <div className="p-2" style={{ position: "relative" }}>
                {styleFiles.length === 0 ? (
                  <div>No style files found.</div>
                ) : (
                  styleFiles.map((file, idx) => {
                    const url = `${ASSET_BASE}/files/styles/${file}`;
                    return (
                      <div
                        key={idx}
                        className="border rounded mb-1 ps-1 d-flex justify-content-between align-items-center"
                      >
                        <span
                          className="text-truncate"
                          style={{ maxWidth: "70%" }}
                        >
                          {file}
                        </span>
                        <div>
                          <button
                            className="btn btn-sm btn-primary me-1"
                            onClick={() => handleImport(url)}
                          >
                            <CiImport />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteFile("styles", file)}
                          >
                            <CiTrash />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : drawerMode === "uploadSelectCustomeImg" ? (
              <div>
                <Row gutter={[8, 8]}>
                  {files.map((file, idx) => (
                    <Col key={idx}>
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          border: "1px solid #ddd",
                          cursor: "pointer",
                          backgroundSize: "cover",
                          backgroundImage: `url(${ASSET_BASE}/files/customImgs/${file})`,
                          borderRadius: "50%",
                        }}
                        onClick={() => {
                          const selectedUrl = `${ASSET_BASE}/files/customImgs/${file}`;
                          updateStyles(mediaTarget, selectedUrl);
                          let storageKey = "recentPosterMedia";
                          if (
                            mediaTarget &&
                            mediaTarget.startsWith &&
                            mediaTarget.startsWith("map.")
                          )
                            storageKey = "recentMapMedia";

                          let recent =
                            JSON.parse(localStorage.getItem(storageKey)) || [];
                          if (!recent.includes(selectedUrl)) {
                            recent.push(selectedUrl);
                            localStorage.setItem(
                              storageKey,
                              JSON.stringify(recent)
                            );
                          }
                        }}
                      />
                      <Button
                        type="link"
                        danger
                        size="small"
                        onClick={() => handleDeleteFile("customImgs", file)}
                      >
                        Delete
                      </Button>
                    </Col>
                  ))}
                </Row>

                <Upload
                  name="file"
                  action={`${API_BASE}/api/upload/custom-img`}
                  showUploadList={false}
                  onChange={(info) => {
                    if (info.file.status === "done") {
                      fetchFiles("customImgs");
                    }
                  }}
                >
                  <Button type="dashed" className="mt-3">
                    Upload New Image
                  </Button>
                </Upload>
              </div>
            ) : drawerMode === "show_hide" ? (
              <ShowHideElement styles={styles} updateStyles={updateStyles} />
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
