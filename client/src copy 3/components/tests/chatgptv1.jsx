import React, { useEffect, useRef, useState } from "react";

export default function SvgPaperEditor() {
  // Paper presets in mm (width x height)
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

  // SVG text items: pure SVG data
  const [items, setItems] = useState([
    // starter item for convenience
  ]);
  const [selectedId, setSelectedId] = useState(null);

  // dragging state for text elements
  const dragRef = useRef({
    dragging: false,
    id: null,
    startX: 0,
    startY: 0,
    startItem: null,
  });

  // inline edit input state (HTML input overlaid on SVG)
  const [inlineEdit, setInlineEdit] = useState({
    open: false,
    id: null,
    value: "",
    x: 0,
    y: 0,
    width: 200,
  });

  // Layer reorder helpers
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

  // create new text item centered horizontally, near bottom
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
      textAnchor: "middle", // center by default
    };
    setItems((s) => [...s, newItem]);
    setSelectedId(id);
  }

  function deleteItem(id) {
    setItems((s) => s.filter((it) => it.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  // update an item by id
  function updateItem(id, patch) {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  // responsive: compute svg width from container and height by ratio
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.max(300, Math.round(rect.width - 32)); // padding compensation
      const ratio = PAPERS[paper].w / PAPERS[paper].h;
      const height = Math.round(width / ratio);
      setSvgSize({ width, height });
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [paper]);

  // pointer handlers for dragging text items
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

  // convert client coords to svg coords
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

  // double click to open inline editor
  function onTextDoubleClick(e, id) {
    e.stopPropagation();
    const it = items.find((x) => x.id === id);
    if (!it) return;
    const svgBox = svgRef.current.getBoundingClientRect();
    // compute client position of text's svg coord
    const pt = svgRef.current.createSVGPoint();
    pt.x = it.x;
    pt.y = it.y - it.fontSize; // place input above baseline roughly
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

  // export SVG/PNG
  function downloadSVG() {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true);
    // remove selection outlines / UI if any
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

  // handle click on empty canvas to deselect
  function onCanvasPointerDown() {
    setSelectedId(null);
    finishInlineEdit(false);
  }

  // helpful: select first item when items change if none selected
  useEffect(() => {
    if (items.length && !selectedId) setSelectedId(items[items.length - 1].id);
  }, [items]);

  // small utility to bring an item to front (end of array)
  function bringToFront(id) {
    setItems((s) => {
      const idx = s.findIndex((it) => it.id === id);
      if (idx === -1) return s;
      const it = s[idx];
      const arr = s.slice(0, idx).concat(s.slice(idx + 1));
      return [...arr, it];
    });
  }

  // render
  return (
    <div className="p-4 flex gap-4" style={{ minHeight: 520 }}>
      {/* left controls */}
      <div className="w-72 flex flex-col gap-3">
        <div className="bg-white p-3 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Paper</h3>
            <div className="text-xs text-gray-500">Ratio</div>
          </div>
          <select
            className="w-full border p-1 rounded mb-2"
            value={paper}
            onChange={(e) => setPaper(e.target.value)}
          >
            {Object.keys(PAPERS).map((k) => (
              <option key={k} value={k}>
                {PAPERS[k].label}
              </option>
            ))}
          </select>

          <div className="flex gap-2 mb-2">
            <button className="px-3 py-1 border rounded" onClick={addText}>
              ➕ Add Text
            </button>
            <button
              className="px-3 py-1 border rounded"
              onClick={() => {
                if (selectedId) bringToFront(selectedId);
              }}
            >
              Bring front
            </button>
          </div>

          <div className="text-xs text-gray-600">
            Canvas: {svgSize.width} × {svgSize.height}
          </div>
        </div>

        {/* Layers panel */}
        <div className="bg-white p-3 rounded shadow flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Layers</h4>
            <div className="text-xs text-gray-500">{items.length}</div>
          </div>
          {items.length === 0 && (
            <div className="text-sm text-gray-500">
              No text items. Click Add Text.
            </div>
          )}
          <div className="flex flex-col gap-2">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className={`p-2 border rounded flex items-center justify-between ${
                  selectedId === it.id ? "ring-2 ring-indigo-300" : ""
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
                  >
                    ↓
                  </button>
                  <button
                    className="text-xs px-2 py-1 border rounded"
                    onClick={() => moveLayer(it.id, -1)}
                  >
                    ↑
                  </button>
                </div>
                <div className="flex flex-col ml-2">
                  <button
                    className="text-xs px-2 py-1 border rounded mb-1"
                    onClick={() => {
                      setSelectedId(it.id);
                      deleteItem(it.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* main canvas area */}
      <div
        className="flex-1 bg-gray-100 p-4 rounded-lg flex flex-col"
        ref={containerRef}
      >
        <div className="flex-1 flex items-start justify-center overflow-auto">
          <div style={{ width: svgSize.width }}>
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
              }}
            >
              {/* paper frame */}
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

              {/* margin guide */}
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

              {/* render text items in order (first = bottom, last = top) */}
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

              {/* selection visual: simple rect around selected item */}
              {selectedId &&
                (() => {
                  const s = items.find((x) => x.id === selectedId);
                  if (!s) return null;
                  // approximate text width by fontSize * charcount * 0.6
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

            {/* inline edit input overlay */}
            {inlineEdit.open && (
              <div style={{ position: "relative", marginTop: -svgSize.height }}>
                <div
                  style={{
                    width: svgSize.width,
                    height: svgSize.height,
                    position: "relative",
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
                      position: "absolute",
                      left: inlineEdit.x,
                      top: inlineEdit.y,
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
              </div>
            )}
          </div>
        </div>

        {/* bottom toolbar: per-item styling */}
        <div className="mt-3 bg-white p-3 rounded shadow">
          {selectedId ? (
            (() => {
              const s = items.find((x) => x.id === selectedId);
              if (!s)
                return (
                  <div className="text-sm text-gray-500">
                    Select a text item to edit.
                  </div>
                );
              return (
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Text</div>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={s.text}
                      onChange={(e) =>
                        updateItem(s.id, { text: e.target.value })
                      }
                    />
                  </div>

                  <div style={{ width: 140 }}>
                    <div className="text-xs text-gray-500">Font size</div>
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1"
                      value={s.fontSize}
                      onChange={(e) =>
                        updateItem(s.id, {
                          fontSize: Number(e.target.value) || 1,
                        })
                      }
                    />
                  </div>

                  <div style={{ width: 180 }}>
                    <div className="text-xs text-gray-500">Font family</div>
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={s.fontFamily}
                      onChange={(e) =>
                        updateItem(s.id, { fontFamily: e.target.value })
                      }
                    >
                      <option value={"Arial, Helvetica, sans-serif"}>
                        Arial
                      </option>
                      <option
                        value={"Georgia, 'Times New Roman', Times, serif"}
                      >
                        Georgia
                      </option>
                      <option value={"'Courier New', Courier, monospace"}>
                        Courier
                      </option>
                      <option value={"'Segoe UI', system-ui"}>System UI</option>
                    </select>
                  </div>

                  <div style={{ width: 110 }}>
                    <div className="text-xs text-gray-500">Color</div>
                    <input
                      type="color"
                      className="w-full"
                      value={s.fill}
                      onChange={(e) =>
                        updateItem(s.id, { fill: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Style</div>
                    <div className="flex gap-1 mt-1">
                      <button
                        className={`px-2 py-1 border rounded ${
                          s.fontWeight === 700 ? "bg-gray-900 text-white" : ""
                        }`}
                        onClick={() =>
                          updateItem(s.id, {
                            fontWeight: s.fontWeight === 700 ? 400 : 700,
                          })
                        }
                      >
                        B
                      </button>
                      <button
                        className={`px-2 py-1 border rounded ${
                          s.fontStyle === "italic"
                            ? "bg-gray-900 text-white"
                            : ""
                        }`}
                        onClick={() =>
                          updateItem(s.id, {
                            fontStyle:
                              s.fontStyle === "italic" ? "normal" : "italic",
                          })
                        }
                      >
                        I
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Align</div>
                    <div className="flex gap-1 mt-1">
                      <button
                        className={`px-2 py-1 border rounded ${
                          s.textAnchor === "start" ? "bg-gray-200" : ""
                        }`}
                        onClick={() =>
                          updateItem(s.id, { textAnchor: "start" })
                        }
                      >
                        L
                      </button>
                      <button
                        className={`px-2 py-1 border rounded ${
                          s.textAnchor === "middle" ? "bg-gray-200" : ""
                        }`}
                        onClick={() =>
                          updateItem(s.id, { textAnchor: "middle" })
                        }
                      >
                        C
                      </button>
                      <button
                        className={`px-2 py-1 border rounded ${
                          s.textAnchor === "end" ? "bg-gray-200" : ""
                        }`}
                        onClick={() => updateItem(s.id, { textAnchor: "end" })}
                      >
                        R
                      </button>
                    </div>
                  </div>

                  <div className="ml-2">
                    <button
                      className="px-3 py-1 border rounded"
                      onClick={() => {
                        bringToFront(s.id);
                      }}
                    >
                      Bring front
                    </button>
                    <button
                      className="px-3 py-1 border rounded ml-2 text-red-600"
                      onClick={() => deleteItem(s.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-sm text-gray-500">
              No text selected — click a text on the paper or add a new one.
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button className="px-3 py-1 border rounded" onClick={downloadSVG}>
              Download SVG
            </button>
            <button
              className="px-3 py-1 border rounded"
              onClick={() => downloadPNG(300)}
            >
              Download PNG (300 DPI)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
