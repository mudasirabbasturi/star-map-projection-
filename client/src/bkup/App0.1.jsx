import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { MdOutlineEditNote, MdEdit } from "react-icons/md";
import { Input, Spin, Drawer } from "antd";
const Sidebar = lazy(() => import("@component/sidebar/Sidebar"));
const Canvas = lazy(() => import("@component/canvas/Canvas"));
const Map = lazy(() => import("@component/map/Map"));
const Moment = lazy(() => import("@component/moment/Moment"));

const App = () => {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState({
    styleContent: { x: 0, y: 0 },
    textNode1: { x: 0, y: 0 },
    textNode2: { x: 0, y: 0 },
    textNode3: { x: 0, y: 0 },
    textNode4: { x: 0, y: 0 },
    textNode5: { x: 0, y: 0 },
  });

  const [texts, setTexts] = useState({
    textNode1: "OUR LUCKY STARS",
    textNode2: "20th September 2021 - 12:00 AM",
    textNode3: "London, United Kingdom",
    textNode4: "51.5073° N, 0.1276° W",
    textNode5: "Magical Night Sky",
  });

  const [draggingId, setDraggingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [dragStart, setDragStart] = useState({
    mouseX: 0,
    mouseY: 0,
    elemX: 0,
    elemY: 0,
  });

  const handleMouseDown = (id) => (e) => {
    if (editingId) return;
    e.preventDefault();
    setDraggingId(id);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: positions[id].x,
      elemY: positions[id].y,
    });
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingId) return;
      const dx = e.clientX - dragStart.mouseX;
      const dy = e.clientY - dragStart.mouseY;
      setPositions((prev) => ({
        ...prev,
        [draggingId]: { x: dragStart.elemX + dx, y: dragStart.elemY + dy },
      }));
    };
    const onUp = () => setDraggingId(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [draggingId, dragStart]);

  const styleFor = (id) => ({
    transform: `translate(${positions[id].x}px, ${positions[id].y}px)`,
    cursor: editingId ? "text" : draggingId === id ? "grabbing" : "grab",
  });

  const handleDoubleClick = (id) => {
    setEditingId(id);
  };

  const handleInputChange = (id) => (e) => {
    setTexts((prev) => ({ ...prev, [id]: e.target.value }));
  };

  const handleBlur = () => {
    setEditingId(null);
  };

  const canvasRef = useRef(null);

  const handleScreenshot = async () => {
    if (!canvasRef.current) return;
    setLoading(true);
    try {
      const htmlContent = canvasRef.current.outerHTML;
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

      {/* Main Canvas */}
      <div className="main-body">
        <Spin spinning={loading} tip="Generating poster..." size="large">
          <div
            className={`canvas glb ${loading ? "download-mode" : ""}`}
            ref={canvasRef}
          >
            <div className="editIconWrapper">
              <MdOutlineEditNote className="editIcon" />
            </div>
            {/* Draggable styleContent */}
            <div
              className="styleContent glb"
              style={styleFor("styleContent")}
              onMouseDown={handleMouseDown("styleContent")}
            >
              <div className="editIconWrapper">
                <MdEdit className="editIcon" />
              </div>
            </div>

            {/* Draggable & Editable text nodes */}
            <div className="textContent">
              {Object.keys(texts).map((id) => (
                <div
                  key={id}
                  className={`textNode ${id} glb`}
                  style={styleFor(id)}
                  onMouseDown={handleMouseDown(id)}
                  onDoubleClick={() => handleDoubleClick(id)}
                >
                  <div className="editIconWrapper">
                    <MdEdit className="editIcon" />
                  </div>
                  {texts[id]}
                  {/* {editingId === id ? (
                    <Input
                      autoSize={{ minRows: 3 }}
                      value={texts[id]}
                      onChange={handleInputChange(id)}
                      onBlur={handleBlur}
                      autoFocus
                    />
                  ) : (
                    texts[id]
                  )} */}
                </div>
              ))}
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
        mask={false}
      >
        {isOpenDrawer && (
          <Suspense fallback={<div>Loading...</div>}>
            {drawerMode === "canvas" ? (
              <Canvas />
            ) : drawerMode === "map" ? (
              <Map />
            ) : drawerMode === "moment" ? (
              <Moment />
            ) : null}
          </Suspense>
        )}
      </Drawer>
    </div>
  );
};

export default App;
