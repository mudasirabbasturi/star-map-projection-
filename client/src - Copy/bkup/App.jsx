import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { MdOutlineEditNote, MdEdit } from "react-icons/md";
import { Input, Spin, Drawer } from "antd";
const Sidebar = lazy(() => import("@component/sidebar/Sidebar"));
const Canvas = lazy(() => import("@component/canvas/Canvas"));
const Map = lazy(() => import("@component/map/Map"));
const EditorMap = lazy(() => import("@component/map/editor/EditorMap"));
const Address = lazy(() => import("@component/moment/Address"));
const EditorAddress = lazy(() =>
  import("@component/moment/editor/EditorAddress")
);
const Date = lazy(() => import("@component/moment/Date"));
const EditorDate = lazy(() => import("@component/moment/editor/EditorDate"));
const Title = lazy(() => import("@component/moment/Title"));
const EditorTitle = lazy(() => import("@component/moment/editor/EditorTitle"));
const Message = lazy(() => import("@component/moment/Message"));
const EditorMessage = lazy(() =>
  import("@component/moment/editor/EditorMessage")
);
const Coordinate = lazy(() => import("@component/moment/Coordinate"));
const EditorCoordinate = lazy(() =>
  import("@component/moment/editor/EditorCoordinate")
);

const App = () => {
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef(null);

  const handleScreenshot = async () => {
    if (!canvasRef.current) return;
    setLoading(true);
    try {
      // Convert canvas to image
      const mapCanvas = document.querySelector(".map canvas");
      let mapImgTag = "";
      if (mapCanvas) {
        const dataURL = mapCanvas.toDataURL("image/png");
        mapImgTag = `<img src="${dataURL}" style="width:100%;height:100%;"/>`;
      }

      // Grab HTML content
      let htmlContent = canvasRef.current.outerHTML;
      if (mapImgTag) {
        htmlContent = htmlContent.replace(
          /<canvas[\s\S]*?<\/canvas>/,
          mapImgTag
        );
      }

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

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState("canvas"); // style,text...

  const showDrawer = (mode, data = null) => {
    setDrawerMode(mode);
    setIsOpenDrawer(true);
  };

  const closeDrawer = () => {
    setIsOpenDrawer(false);
  };

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar
        loading={loading}
        handleScreenshot={handleScreenshot}
        showDrawer={showDrawer}
      />

      <div className="main-body">
        <Spin spinning={loading} tip="Generating poster..." size="large">
          <div
            className={`canvas glb ${loading ? "download-mode" : ""}`}
            ref={canvasRef}
          >
            <div
              className="editIconWrapper"
              onClick={() => showDrawer("canvas")}
            >
              <MdOutlineEditNote className="editIcon" />
            </div>

            <Map showDrawer={showDrawer} />
            <div className="textContent">
              <Address showDrawer={showDrawer} />
              <Date showDrawer={showDrawer} />
              <Title showDrawer={showDrawer} />
              <Message showDrawer={showDrawer} />
              <Coordinate showDrawer={showDrawer} />
            </div>
          </div>
        </Spin>
      </div>
      <Drawer
        title={
          drawerMode === "canvas"
            ? "Canvas Manager"
            : drawerMode === "map"
            ? "Map Manager"
            : drawerMode === "moment"
            ? "Moment & Text Manager"
            : drawerMode === "saveStyle"
            ? "Use Save Style"
            : null
        }
        open={isOpenDrawer}
        onClose={closeDrawer}
        placement="left"
        width={drawerMode === "saveStyle" ? "500px" : "300px"}
        mask={true}
      >
        {isOpenDrawer && (
          <Suspense fallback={<div>Loading...</div>}>
            {drawerMode === "canvas" ? (
              <Canvas />
            ) : drawerMode === "map" ? (
              <EditorMap />
            ) : drawerMode === "address" ? (
              <EditorAddress />
            ) : drawerMode === "date" ? (
              <EditorDate />
            ) : drawerMode === "title" ? (
              <EditorTitle />
            ) : drawerMode === "message" ? (
              <EditorMessage />
            ) : drawerMode === "coordinate" ? (
              <EditorCoordinate />
            ) : null}
          </Suspense>
        )}
      </Drawer>
    </div>
  );
};

export default App;
