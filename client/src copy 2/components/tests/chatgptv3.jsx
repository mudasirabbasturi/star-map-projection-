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

  // Multiple text layers
  const [layers, setLayers] = useState([
    {
      id: 1,
      x: 100,
      y: 200,
      text: "Type here",
      fontSize: 24,
      color: "#111827",
    },
  ]);
  const [selectedId, setSelectedId] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const svgRef = useRef(null);

  // Add new text layer
  const addTextLayer = () => {
    const id = Date.now();
    const newLayer = {
      id,
      x: PRESENTATION_WIDTH / 2 - 100,
      y: presentationHeight - 80,
      text: "New text",
      fontSize: 20,
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
        style={{ position: "absolute" }}
      >
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addTextLayer}
          block
        >
          Add Text
        </Button>

        <div className="mt-4">
          {layers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => setSelectedId(layer.id)}
              style={{
                border:
                  selectedId === layer.id
                    ? "2px solid #1677ff"
                    : "1px solid #ddd",
                padding: "8px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <input
                type="text"
                value={layer.text}
                onChange={(e) =>
                  updateLayer(layer.id, { text: e.target.value })
                }
                className="w-full border px-2 py-1 rounded"
              />
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  value={layer.fontSize}
                  onChange={(e) =>
                    updateLayer(layer.id, { fontSize: Number(e.target.value) })
                  }
                  className="w-20 border px-2 py-1 rounded"
                />
                <input
                  type="color"
                  value={layer.color}
                  onChange={(e) =>
                    updateLayer(layer.id, { color: e.target.value })
                  }
                />
              </div>
            </div>
          ))}
        </div>

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
            <text
              key={layer.id}
              x={layer.x}
              y={layer.y}
              fontSize={layer.fontSize}
              fill={layer.color}
              textAnchor="middle"
              style={{ cursor: "move", userSelect: "none" }}
            >
              {layer.text}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
