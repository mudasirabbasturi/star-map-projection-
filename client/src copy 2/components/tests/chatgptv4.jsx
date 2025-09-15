import React, { useRef, useState, useEffect } from "react";
import { Drawer, Button } from "antd";
import { PlusOutlined, FontSizeOutlined } from "@ant-design/icons";

export default function SvgPaperEditor() {
  const PAPERS = {
    A4: { w: 210, h: 297, label: "A4 (210×297 mm)" },
    A5: { w: 148, h: 210, label: "A5 (148×210 mm)" },
    Letter: { w: 216, h: 279, label: "Letter (8.5×11 in approx)" },
    Legal: { w: 216, h: 356, label: "Legal (8.5×14 in approx)" },
  };

  const [paper, setPaper] = useState("A4");
  const PRESENTATION_WIDTH = 900;
  const paperRatio = PAPERS[paper].w / PAPERS[paper].h;
  const presentationHeight = Math.round(PRESENTATION_WIDTH / paperRatio);

  const [layers, setLayers] = useState([
    {
      id: 1,
      x: PRESENTATION_WIDTH / 2,
      y: presentationHeight - 100,
      text: "Type here",
      fontSize: 28,
      color: "#111827",
    },
  ]);
  const [selectedId, setSelectedId] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dragging, setDragging] = useState(null);
  const svgRef = useRef(null);

  // Add new text layer
  const addTextLayer = () => {
    const id = Date.now();
    const newLayer = {
      id,
      x: PRESENTATION_WIDTH / 2,
      y: presentationHeight - 80,
      text: "New text",
      fontSize: 22,
      color: "#111827",
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedId(id);
  };

  // Update layer
  const updateLayer = (id, updates) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  // Mouse events for dragging
  const handleMouseDown = (e, id) => {
    setSelectedId(id);
    setDragging({ id, offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());

    updateLayer(dragging.id, { x: cursor.x, y: cursor.y });
  };

  const handleMouseUp = () => setDragging(null);

  // Export SVG
  function downloadSVG() {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
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

  const selectedLayer = layers.find((l) => l.id === selectedId);

  return (
    <div className="p-4 relative flex">
      {/* Floating toggle button */}
      <Button
        type="primary"
        icon={<FontSizeOutlined />}
        style={{
          position: "fixed",
          left: "1%",
          top: "70%",
          zIndex: 1000,
        }}
        onClick={() => setDrawerOpen(true)}
      >
        Text
      </Button>

      {/* Ant Design Drawer as Sidebar */}
      <Drawer
        title="Text Layers"
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mask={false}
        maskClosable={false}
        closable={false}
        width={300}
      >
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addTextLayer}
          block
        >
          Add Text
        </Button>

        {selectedLayer && (
          <div className="mt-6">
            <label className="block mb-1">Text</label>
            <input
              type="text"
              value={selectedLayer.text}
              onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />
            <label className="block mt-3 mb-1">Font Size</label>
            <input
              type="number"
              value={selectedLayer.fontSize}
              onChange={(e) =>
                updateLayer(selectedLayer.id, { fontSize: Number(e.target.value) })
              }
              className="w-24 border px-2 py-1 rounded"
            />
            <label className="block mt-3 mb-1">Color</label>
            <input
              type="color"
              value={selectedLayer.color}
              onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })}
            />
          </div>
        )}

        <Button className="mt-6" onClick={downloadSVG} block>
          Download SVG
        </Button>
      </Drawer>

      {/* Main Canvas */}
      <div className="d-flex justify-content-center align-items-center">
        <svg
          ref={svgRef}
          width={PRESENTATION_WIDTH}
          height={presentationHeight}
          viewBox={`0 0 ${PRESENTATION_WIDTH} ${presentationHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          className="rounded shadow"
          style={{ background: "#fff" }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <rect
            x={0}
            y={0}
            width={PRESENTATION_WIDTH}
            height={presentationHeight}
            fill="#ffffff"
            stroke="#e5e7eb"
          />

          {/* Render text layers */}
          {layers.map((layer) => (
            <g key={layer.id}>
              {selectedId === layer.id && (
                <rect
                  x={layer.x - layer.text.length * (layer.fontSize / 4)}
                  y={layer.y - layer.fontSize}
                  width={layer.text.length * (layer.fontSize / 2)}
                  height={layer.fontSize * 1.2}
                  fill="none"
                  stroke="#1677ff"
                  strokeDasharray="4"
                />
              )}
              <text
                x={layer.x}
                y={layer.y}
                fontSize={layer.fontSize}
                fill={layer.color}
                textAnchor="middle"
                style={{ cursor: "move", userSelect: "none" }}
                onMouseDown={(e) => handleMouseDown(e, layer.id)}
              >
                {layer.text}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
