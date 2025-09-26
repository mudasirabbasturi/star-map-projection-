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

const customImage = "http://localhost:3000/imgs/starmap/default/couple.jpg";

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

  const [orientation, setOrientation] = useState("portrait");
  // unified state for styles
  const [styles, setStyles] = useState({
    map: {
      projection: "orthographic",
      width: 90,
      height: 60,
      maskShape: "circle",
      fill: null,
      bgType: "none",
      bgImageMode: "cover",
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
      showPlanetNames: false,
      showMoonName: true,
      showMoon: true,
      showGraticule: true,
      sizeMult: 1,
      magLimit: 6.5,
      date: new Date().toISOString(),
      lat: 51.5,
      lon: -0.1,
    },
  });

  const [posterStyles, setPosterStyles] = useState({
    paperSize: "A4",
    bgType: "solid",
    bgColor: "#020202ff",
    bgGradientColor: ["#a80077ff", "#66ff00"],
    bgGradientType: "linear", // linear | radial | conic
    bgGradientAngle: 90,
    borderStyle: "none",
    borderWidth: 1,
    borderRadius: 0,
    borderColor: "#ffff",
    bgGradientColors: ["#a80077ff", "#66ff00"],
    bgImage: null,
    bgImageMode: "cover",
    bgImageOpacity: 0.7,
  });
  const updatePosterStyles = (path, value) => {
    setPosterStyles((prev) => {
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
  const getBaseBackground = () => {
    if (posterStyles.bgType === "solid") return posterStyles.bgColor;
    if (posterStyles.bgType === "gradient") {
      if (posterStyles.bgGradientType === "linear") {
        return `linear-gradient(${
          posterStyles.bgGradientAngle
        }deg, ${posterStyles.bgGradientColors.join(", ")})`;
      }
      if (posterStyles.bgGradientType === "radial") {
        return `radial-gradient(${posterStyles.bgGradientColors.join(", ")})`;
      }
      if (posterStyles.bgGradientType === "conic") {
        return `conic-gradient(from ${
          posterStyles.bgGradientAngle
        }deg, ${posterStyles.bgGradientColors.join(", ")})`;
      }
    }
    return "#fff";
  };

  const getImageOverlayStyle = () => {
    if (!posterStyles.bgImage) return {};
    let backgroundSize = "cover";
    if (posterStyles.bgImageMode === "contain") backgroundSize = "contain";
    if (posterStyles.bgImageMode === "stretch") backgroundSize = "100% 100%";

    return {
      backgroundImage: `url(${posterStyles.bgImage})`,
      backgroundSize,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      opacity: posterStyles.bgImageOpacity,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: posterStyles.borderRadius,
      pointerEvents: "none",
    };
  };

  const [posterWrapperStyles, setPosterWrapperStyles] = useState({
    width: 90,
    height: 92.6,
    bgColor: null,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 0,
    borderColor: "#ffff",
  });
  const updatePosterWrapperStyles = (path, value) => {
    setPosterWrapperStyles((prev) => {
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

  const [imgStyles, setImgStyles] = useState({
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
    paddingTop: 4,
  });
  const updateImgStyles = (path, value) => {
    setImgStyles((prev) => {
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

  const [showStyles, setShowStyles] = useState({
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
  });
  const updateShowStyles = (path, value) => {
    setShowStyles((prev) => {
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

  const [contentStyles, setContentStyles] = useState({
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
  });
  const updateContentStyles = (path, value) => {
    setContentStyles((prev) => {
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

  const [titleStyles, setTitleStyles] = useState({
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
  });
  const updateTitleStyles = (path, value) => {
    setTitleStyles((prev) => {
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

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/json/stars.6.json`).then((r) => r.json()),
      fetch(`/json/mw.json`).then((r) => r.json()),
      fetch(`/json/constellations.lines.json`).then((r) => r.json()),
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
    showDownloadImageFiles: "Downloaded PNG/JPEG",
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
  const [mediaTarget, setMediaTarget] = useState(null);
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
    setDrawerMode(mode);
    setOpen(true);
  };

  const closeDrawer = () => {
    setDrawerMode(null);
    setOpen(null);
  };

  const openNotificationWithIcon = (fileName) => {
    api.success({
      message: `✅ ${fileName} saved!`,
      duration: 6,
    });
  };

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
      <head><meta charset="UTF-8"><style>${cssText}</style></head>
      <body>${htmlContent}</body>
    </html>`;
      const response = await fetch("http://localhost:3001/api/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: fullHTML,
          paperSize: posterStyles.paperSize,
          fileName: content.fileName,
          downloadType: content.downloadType,
        }),
      });

      if (!response.ok) throw new Error("Failed to capture screenshot");

      // blob for download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${content.fileName}.${content.downloadType}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      openNotificationWithIcon(content.fileName);
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

  const [files, setFiles] = useState([]);
  useEffect(() => {
    if (open && drawerMode === "uploadSelectCustomeImg" && files.length === 0) {
      fetchFiles("customImgs");
    }
  }, [open, drawerMode, files.length]);

  const fetchFiles = async (type = "customImgs") => {
    try {
      const res = await fetch(`http://localhost:3001/api/files/${type}`);
      const data = await res.json();
      if (data.success) setFiles(data.files);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };
  const handleDeleteFile = async (type, fileName) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/files/${type}/${fileName}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        api.success({ message: "File deleted", description: data.message });
        if (type === "customImgs") fetchFiles("customImgs");
      } else {
        api.error({ message: "Delete failed", description: data.message });
      }
    } catch (err) {
      console.error("Delete error:", err);
      api.error({ message: "Delete error", description: err.message });
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
        />
        <div className="main-body">
          <Spin spinning={loading} tip="Generating poster..." size="large">
            <Suspense fallback={<div>Loading Map...</div>}>
              <div
                ref={canvasRef}
                className={`poster hasIcon ${
                  drawerMode === "poster" ? "active" : ""
                } ${orientation}`}
                style={{
                  background: getBaseBackground(),
                  borderStyle: posterStyles.borderStyle,
                  borderWidth: `${posterStyles.borderWidth}px`,
                  borderRadius: `${posterStyles.borderRadius}%`,
                  borderColor: posterStyles.borderColor,
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
                    width: `${posterWrapperStyles.width}%`,
                    height: `${posterWrapperStyles.height}%`,
                    backgroundColor: posterWrapperStyles.bgColor,
                    borderStyle: posterWrapperStyles.borderStyle,
                    borderWidth: `${posterWrapperStyles.borderWidth}px`,
                    borderRadius: `${posterWrapperStyles.borderRadius}%`,
                    borderColor: posterWrapperStyles.borderColor,
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
                    showDrawer={showDrawer}
                    positions={positions}
                    handleMouseDown={handleMouseDown}
                    drawerMode={drawerMode}
                    orientation={orientation}
                  />

                  <CustomImg
                    imgStyles={imgStyles}
                    showStyles={showStyles}
                    positions={positions}
                    handleMouseDown={handleMouseDown}
                    showDrawer={showDrawer}
                    drawerMode={drawerMode}
                    content={content}
                  />

                  <Title
                    titleStyles={titleStyles}
                    showStyles={showStyles}
                    positions={positions}
                    handleMouseDown={handleMouseDown}
                    showDrawer={showDrawer}
                    drawerMode={drawerMode}
                    content={content}
                  />

                  <Content
                    contentStyles={contentStyles}
                    showStyles={showStyles}
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
      >
        {open && (
          <Suspense fallback={<div>Loading Sections...</div>}>
            {drawerMode === "poster" ? (
              <PosterSetting
                posterStyles={posterStyles}
                updatePosterStyles={updatePosterStyles}
                content={content}
                onChangeContent={onChangeContent}
                showDrawer={showDrawer}
                orientation={orientation}
                setOrientation={setOrientation}
              />
            ) : drawerMode === "posterWrapper" ? (
              <PosterWrapperSetting
                posterWrapperStyles={posterWrapperStyles}
                updatePosterWrapperStyles={updatePosterWrapperStyles}
                content={content}
                onChangeContent={onChangeContent}
              />
            ) : drawerMode === "content" ? (
              <ContentSetting
                contentStyles={contentStyles}
                updateContentStyles={updateContentStyles}
                showStyles={showStyles}
                updateShowStyles={updateShowStyles}
                content={content}
                onChangeContent={onChangeContent}
              />
            ) : drawerMode === "title" ? (
              <TitleSetting
                titleStyles={titleStyles}
                updateTitleStyles={updateTitleStyles}
                showStyles={showStyles}
                updateShowStyles={updateShowStyles}
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
                orientation={orientation}
              />
            ) : drawerMode === "CustomImg" ? (
              <CustomImgSetting
                imgStyles={imgStyles}
                updateImgStyles={updateImgStyles}
                showStyles={showStyles}
                updateShowStyles={updateShowStyles}
                content={content}
                onChangeContent={onChangeContent}
                showDrawer={showDrawer}
              />
            ) : drawerMode === "show_hide" ? (
              <ShowHideElement
                showStyles={showStyles}
                updateShowStyles={updateShowStyles}
              />
            ) : drawerMode === "uploadSelectCustomeImg" ? (
              <>
                {/* Upload Button */}
                <Upload
                  name="file"
                  action={`http://localhost:3001/api/upload/custom-img`}
                  showUploadList={false}
                  onChange={(info) => {
                    if (info.file.status === "done") {
                      fetchFiles("customImgs");
                    }
                  }}
                >
                  <Button className="border" type="link">
                    Upload Media
                  </Button>
                </Upload>
                <hr />
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                  }}
                >
                  {files.length === 0 ? (
                    <small>No Images Uploaded Yet.</small>
                  ) : (
                    files.map((file, idx) => {
                      const fileUrl = `http://localhost:3001/files/customImgs/${file}`;
                      return (
                        <div
                          key={idx}
                          style={{
                            position: "relative",
                            width: 70,
                            height: 70,
                            cursor: "pointer",
                            border: "1px solid transparent",
                          }}
                          onClick={() => {
                            let storageKey = "recentPosterMedia";
                            if (mediaTarget?.startsWith("map.")) {
                              updateStyles(mediaTarget, fileUrl);
                              storageKey = "recentMapMedia";
                            } else if (mediaTarget?.startsWith("poster.")) {
                              updatePosterStyles(
                                mediaTarget.replace("poster.", ""),
                                fileUrl
                              );
                            } else if (mediaTarget?.startsWith("CustomImg.")) {
                              updateImgStyles(
                                mediaTarget.replace("CustomImg.", ""),
                                fileUrl
                              );
                              storageKey = "recentCustomImgMedia";
                            } else {
                              updateImgStyles(mediaTarget, fileUrl);
                            }

                            let recent =
                              JSON.parse(localStorage.getItem(storageKey)) ||
                              [];
                            if (!recent.includes(fileUrl)) {
                              recent.push(fileUrl);
                              localStorage.setItem(
                                storageKey,
                                JSON.stringify(recent)
                              );
                            }
                          }}
                        >
                          {/* Image */}
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundImage: `url(${fileUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          ></div>

                          {/* Delete on hover */}
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              background: "red",
                              color: "white",
                              fontSize: 12,
                              textAlign: "center",
                              lineHeight: "16px",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // prevent click on parent
                              handleDeleteFile("customImgs", file);
                            }}
                          >
                            ×
                          </div>
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
