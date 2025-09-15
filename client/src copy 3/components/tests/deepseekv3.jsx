import React, { useEffect, useRef, useState } from "react";
import { Drawer, Button, Space, Divider } from "antd";
import {
  SettingOutlined,
  FileTextOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";

const SvgPaperEditor = () => {
  const PAPERS = {
    A4: { w: 210, h: 297, label: "A4 (210×297 mm)" },
    A5: { w: 148, h: 210, label: "A5 (148×210 mm)" },
    Letter: { w: 216, h: 279, label: "Letter (8.5×11 in approx)" },
    Legal: { w: 216, h: 356, label: "Legal (8.5×14 in approx)" },
  };

  const containerRef = useRef(null);
  const svgRef = useRef(null);

  const [paper, setPaper] = useState("A4");
  const [svgSize, setSvgSize] = useState({ width: 900, height: 1200 });
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState(null);

  const dragRef = useRef({
    dragging: false,
    id: null,
    startX: 0,
    startY: 0,
    startItem: null,
  });

  const [inlineEdit, setInlineEdit] = useState({
    open: false,
    id: null,
    value: "",
    x: 0,
    y: 0,
    width: 200,
  });

  // Open drawer handler
  const openDrawer = (type) => {
    setDrawerType(type);
    setDrawerVisible(true);
  };

  // Close drawer handler
  const closeDrawer = () => {
    setDrawerVisible(false);
    setDrawerType(null);
  };

  useEffect(() => {
    const updateSvgSize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Calculate the aspect ratio of the selected paper
      const paperAspectRatio = PAPERS[paper].w / PAPERS[paper].h;

      // Calculate maximum dimensions that fit within the container
      let width, height;

      if (containerWidth / containerHeight > paperAspectRatio) {
        // Container is wider than paper aspect ratio
        height = containerHeight;
        width = height * paperAspectRatio;
      } else {
        // Container is taller than paper aspect ratio
        width = containerWidth;
        height = width / paperAspectRatio;
      }

      // Add some padding (20px on each side)
      width = Math.max(100, width - 40);
      height = Math.max(100, height - 40);

      setSvgSize({ width, height });
    };

    updateSvgSize();
    window.addEventListener("resize", updateSvgSize);

    return () => {
      window.removeEventListener("resize", updateSvgSize);
    };
  }, [paper]);

  function addText() {
    const id = Date.now().toString();
    const w = svgSize.width;
    const h = svgSize.height;
    const newItem = {
      id,
      text: "New text",
      x: Math.round(w / 2),
      y: Math.round(h - Math.max(40, h * 0.12)),
      fontSize: 28,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontWeight: 400,
      fontStyle: "normal",
      fill: "#111827",
      textAnchor: "middle",
    };
    setItems((s) => [...s, newItem]);
    setSelectedId(id);
  }

  function deleteItem(id) {
    setItems((s) => s.filter((it) => it.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function updateItem(id, patch) {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function moveLayer(id, dir) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      const newArr = prev.slice();
      const target = idx + dir;
      if (target < 0 || target >= newArr.length) return prev;
      const tmp = newArr[target];
      newArr[target] = newArr[idx];
      newArr[idx] = tmp;
      return newArr;
    });
  }

  function bringToFront(id) {
    setItems((s) => {
      const idx = s.findIndex((it) => it.id === id);
      if (idx === -1) return s;
      const it = s[idx];
      const arr = s.slice(0, idx).concat(s.slice(idx + 1));
      return [...arr, it];
    });
  }

  function clientToSvg(clientX, clientY) {
    const svg = svgRef.current;
    if (!svg) return { x: clientX, y: clientY };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: clientX, y: clientY };
    const inv = ctm.inverse();
    const res = pt.matrixTransform(inv);
    return { x: res.x, y: res.y };
  }

  function onTextPointerDown(e, id) {
    e.stopPropagation();
    const pt = clientToSvg(e.clientX, e.clientY);
    const it = items.find((x) => x.id === id);
    dragRef.current = {
      dragging: true,
      id,
      startX: pt.x,
      startY: pt.y,
      startItem: { ...it },
    };
    window.addEventListener("pointermove", onTextPointerMove);
    window.addEventListener("pointerup", onTextPointerUp);
    setSelectedId(id);
  }

  function onTextPointerMove(e) {
    if (!dragRef.current.dragging) return;
    const pt = clientToSvg(e.clientX, e.clientY);
    const dx = pt.x - dragRef.current.startX;
    const dy = pt.y - dragRef.current.startY;
    const id = dragRef.current.id;
    const start = dragRef.current.startItem;
    updateItem(id, {
      x: Math.round(start.x + dx),
      y: Math.round(start.y + dy),
    });
  }

  function onTextPointerUp() {
    dragRef.current.dragging = false;
    dragRef.current.id = null;
    window.removeEventListener("pointermove", onTextPointerMove);
    window.removeEventListener("pointerup", onTextPointerUp);
  }

  function onTextDoubleClick(e, id) {
    e.stopPropagation();
    const it = items.find((x) => x.id === id);
    if (!it) return;
    const svgBox = svgRef.current.getBoundingClientRect();
    const pt = svgRef.current.createSVGPoint();
    pt.x = it.x;
    pt.y = it.y - it.fontSize;
    const screenPt = pt.matrixTransform(svgRef.current.getScreenCTM());
    setInlineEdit({
      open: true,
      id,
      value: it.text,
      x: screenPt.x - svgBox.left - 8,
      y: screenPt.y - svgBox.top - 8,
      width: Math.max(120, it.text.length * (it.fontSize * 0.6)),
    });
    setSelectedId(id);
  }

  function finishInlineEdit(save = true) {
    if (inlineEdit.open && inlineEdit.id) {
      if (save) updateItem(inlineEdit.id, { text: inlineEdit.value });
    }
    setInlineEdit({ open: false, id: null, value: "", x: 0, y: 0, width: 200 });
  }

  function downloadSVG() {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true);
    clone.querySelectorAll("[data-ui]").forEach((n) => n.remove());
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(clone);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${paper}-design.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function downloadPNG(dpi = 300) {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    const scale = dpi / 96;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(svgSize.width * scale);
    canvas.height = Math.round(svgSize.height * scale);
    const ctx = canvas.getContext("2d");
    return new Promise((resolve) => {
      img.onload = () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((b) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(b);
          link.download = `${paper}-design.png`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
          resolve(true);
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };
      img.src = url;
    });
  }

  function onCanvasPointerDown() {
    setSelectedId(null);
    finishInlineEdit(false);
  }

  useEffect(() => {
    if (items.length && !selectedId) setSelectedId(items[items.length - 1].id);
  }, [items]);

  // Get selected item
  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <div
        className="d-flex flex-column align-items-center gap-3 bg-white z-10 shadow-md"
        style={{
          position: "fixed",
          height: "100%",
          width: "5%",
        }}
      >
        <Button
          icon={<SettingOutlined />}
          type={drawerType === "paper" ? "primary" : "default"}
          onClick={() => openDrawer("paper")}
          title="Paper Settings"
        />
        <Button
          icon={<EditOutlined />}
          type={drawerType === "text" ? "primary" : "default"}
          disabled={!selectedId}
          onClick={() => openDrawer("text")}
          title="Text Settings"
        />
        <Button
          icon={<EditOutlined />}
          type={drawerType === "layers" ? "primary" : "default"}
          onClick={() => openDrawer("layers")}
          title="Layers"
        />
        <Button
          icon={<DownloadOutlined />}
          type={drawerType === "export" ? "primary" : "default"}
          onClick={() => openDrawer("export")}
          title="Export"
        />
        <Divider className="my-2 w-10" />
        <Button
          icon={<FileTextOutlined />}
          type="default"
          onClick={addText}
          title="Add Text"
        />
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="flex-1 ml-16 d-flex items-center justify-content-center bg-gray-100 p-4 overflow-hidden"
      >
        <div className="flex items-center justify-center w-full h-full">
          <svg
            ref={svgRef}
            width={svgSize.width}
            height={svgSize.height}
            viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
            xmlns="http://www.w3.org/2000/svg"
            onPointerDown={onCanvasPointerDown}
            style={{
              background: "#fff",
              borderRadius: 6,
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <rect
              x={0}
              y={0}
              width={svgSize.width}
              height={svgSize.height}
              rx={8}
              ry={8}
              fill="#fff"
              stroke="#e5e7eb"
              data-ui
            />
            <rect
              x={Math.round(svgSize.width * 0.03)}
              y={Math.round(svgSize.height * 0.03)}
              width={Math.round(svgSize.width * 0.94)}
              height={Math.round(svgSize.height * 0.94)}
              fill="none"
              stroke="#e6edf3"
              strokeDasharray="4 4"
              data-ui
            />

            {items.map((it) => (
              <text
                key={it.id}
                x={it.x}
                y={it.y}
                fontSize={it.fontSize}
                fontFamily={it.fontFamily}
                fontWeight={it.fontWeight}
                fontStyle={it.fontStyle}
                fill={it.fill}
                textAnchor={it.textAnchor}
                style={{
                  userSelect: "none",
                  cursor: selectedId === it.id ? "grabbing" : "grab",
                }}
                onPointerDown={(e) => onTextPointerDown(e, it.id)}
                onDoubleClick={(e) => onTextDoubleClick(e, it.id)}
              >
                {it.text}
              </text>
            ))}

            {selectedId &&
              (() => {
                const s = items.find((x) => x.id === selectedId);
                if (!s) return null;
                const approxW = Math.max(
                  80,
                  (s.text || "").length * (s.fontSize * 0.55)
                );
                const approxH = Math.max(s.fontSize * 1.2, 24);
                const left =
                  s.textAnchor === "middle" ? s.x - approxW / 2 : s.x;
                const top = s.y - approxH;
                return (
                  <g data-ui>
                    <rect
                      x={left - 6}
                      y={top - 6}
                      width={approxW + 12}
                      height={approxH + 12}
                      fill="none"
                      stroke="#60a5fa"
                      strokeDasharray="4 2"
                      rx={4}
                    />
                  </g>
                );
              })()}
          </svg>

          {inlineEdit.open && (
            <div
              style={{
                position: "absolute",
                left: inlineEdit.x,
                top: inlineEdit.y,
              }}
            >
              <input
                autoFocus
                value={inlineEdit.value}
                onChange={(e) =>
                  setInlineEdit((p) => ({ ...p, value: e.target.value }))
                }
                onBlur={() => finishInlineEdit(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") finishInlineEdit(true);
                  if (e.key === "Escape") finishInlineEdit(false);
                }}
                style={{
                  width: inlineEdit.width,
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid rgba(0,0,0,0.12)",
                  boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
                  background: "#fff",
                  zIndex: 9999,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Drawer for Settings */}
      <Drawer
        title={
          drawerType === "paper"
            ? "Paper Settings"
            : drawerType === "text"
            ? "Text Settings"
            : drawerType === "layers"
            ? "Layers"
            : drawerType === "export"
            ? "Export Options"
            : "Settings"
        }
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
        width={400}
        style={{ marginLeft: 64 }}
      >
        {drawerType === "paper" && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-sm font-medium mb-2">Paper Size</div>
              <select
                className="w-full border p-2 rounded"
                value={paper}
                onChange={(e) => setPaper(e.target.value)}
              >
                {Object.keys(PAPERS).map((k) => (
                  <option key={k} value={k}>
                    {PAPERS[k].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Canvas Size</div>
              <div className="text-xs text-gray-600">
                {svgSize.width} × {svgSize.height} px
              </div>
            </div>
            <Button type="primary" onClick={addText} className="w-full">
              Add Text Element
            </Button>
          </div>
        )}

        {drawerType === "text" && selectedItem && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-sm font-medium mb-2">Text Content</div>
              <input
                className="w-full border p-2 rounded"
                value={selectedItem.text}
                onChange={(e) =>
                  updateItem(selectedId, { text: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-2">Font Size</div>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={selectedItem.fontSize}
                  onChange={(e) =>
                    updateItem(selectedId, {
                      fontSize: Number(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Color</div>
                <input
                  type="color"
                  className="w-full h-10"
                  value={selectedItem.fill}
                  onChange={(e) =>
                    updateItem(selectedId, { fill: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Font Family</div>
              <select
                className="w-full border p-2 rounded"
                value={selectedItem.fontFamily}
                onChange={(e) =>
                  updateItem(selectedId, { fontFamily: e.target.value })
                }
              >
                <option value={"Arial, Helvetica, sans-serif"}>Arial</option>
                <option value={"Georgia, 'Times New Roman', Times, serif"}>
                  Georgia
                </option>
                <option value={"'Courier New', Courier, monospace"}>
                  Courier
                </option>
                <option value={"'Segoe UI', system-ui"}>System UI</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-2">Text Alignment</div>
                <select
                  className="w-full border p-2 rounded"
                  value={selectedItem.textAnchor}
                  onChange={(e) =>
                    updateItem(selectedId, { textAnchor: e.target.value })
                  }
                >
                  <option value="start">Left</option>
                  <option value="middle">Center</option>
                  <option value="end">Right</option>
                </select>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Font Weight</div>
                <select
                  className="w-full border p-2 rounded"
                  value={selectedItem.fontWeight}
                  onChange={(e) =>
                    updateItem(selectedId, {
                      fontWeight: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="400">Normal</option>
                  <option value="700">Bold</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className={`flex-1 p-2 border rounded ${
                  selectedItem.fontStyle === "italic"
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
                onClick={() =>
                  updateItem(selectedId, {
                    fontStyle:
                      selectedItem.fontStyle === "italic" ? "normal" : "italic",
                  })
                }
              >
                Italic
              </button>

              <button
                className="flex-1 p-2 bg-red-500 text-white rounded"
                onClick={() => deleteItem(selectedId)}
              >
                Delete
              </button>
            </div>

            <Button
              onClick={() => {
                bringToFront(selectedId);
              }}
            >
              Bring to Front
            </Button>
          </div>
        )}

        {drawerType === "layers" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Layers</div>
              <div className="text-xs text-gray-500">{items.length} items</div>
            </div>
            {items.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-4">
                No text items. Click "Add Text" to create one.
              </div>
            )}
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
              {items.map((it, idx) => (
                <div
                  key={it.id}
                  className={`p-3 border rounded flex items-center justify-between ${
                    selectedId === it.id ? "border-blue-500 bg-blue-50" : ""
                  }`}
                >
                  <div
                    className="flex-1"
                    onClick={() => setSelectedId(it.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="font-medium text-sm truncate">
                      {it.text || "(empty)"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {it.fontFamily.split(",")[0]} • {it.fontSize}px
                    </div>
                  </div>
                  <div className="flex flex-col ml-2">
                    <button
                      className="text-xs px-2 py-1 border rounded mb-1"
                      onClick={() => moveLayer(it.id, 1)}
                      disabled={idx === items.length - 1}
                    >
                      ↓
                    </button>
                    <button
                      className="text-xs px-2 py-1 border rounded"
                      onClick={() => moveLayer(it.id, -1)}
                      disabled={idx === 0}
                    >
                      ↑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {drawerType === "export" && (
          <div className="flex flex-col gap-4">
            <Button
              type="primary"
              onClick={downloadSVG}
              className="w-full"
              size="large"
            >
              Download SVG
            </Button>

            <Button
              onClick={() => downloadPNG(300)}
              className="w-full"
              size="large"
            >
              Download PNG (300 DPI)
            </Button>

            <div className="text-xs text-gray-500 mt-4">
              Note: For PDF export and advanced features, additional libraries
              are required.
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default SvgPaperEditor;
