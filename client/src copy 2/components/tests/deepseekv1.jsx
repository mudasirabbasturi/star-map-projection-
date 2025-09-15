import React, { useEffect, useRef, useState } from "react";

const SvgPaperEditor = () => {
  // Paper presets in mm (width x height)
  const PAPERS = {
    A4: { w: 210, h: 297, label: "A4 (210×297 mm)" },
    A5: { w: 148, h: 210, label: "A5 (148×210 mm)" },
    Letter: { w: 216, h: 279, label: "Letter (8.5×11 in)" },
    Legal: { w: 216, h: 356, label: "Legal (8.5×14 in)" },
    A3: { w: 297, h: 420, label: "A3 (297×420 mm)" },
    A2: { w: 420, h: 594, label: "A2 (420×594 mm)" },
  };

  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const inputRef = useRef(null);

  const [paper, setPaper] = useState("A4");
  const [orientation, setOrientation] = useState("portrait");
  const [svgSize, setSvgSize] = useState({ width: 900, height: 1200 });

  // SVG text items
  const [items, setItems] = useState([
    {
      id: "1",
      text: "Welcome to Your Poster",
      x: 450,
      y: 150,
      fontSize: 36,
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
      fontStyle: "normal",
      fill: "#2d3748",
      textAnchor: "middle",
    },
    {
      id: "2",
      text: "Design, Export, and Share",
      x: 450,
      y: 210,
      fontSize: 24,
      fontFamily: "'Inter', 'Segoe UI', system-ui",
      fontWeight: 400,
      fontStyle: "italic",
      fill: "#718096",
      textAnchor: "middle",
    },
  ]);

  const [selectedId, setSelectedId] = useState("1");
  const [history, setHistory] = useState([JSON.stringify(items)]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Dragging state
  const dragRef = useRef({
    dragging: false,
    id: null,
    startX: 0,
    startY: 0,
    startItem: null,
  });

  // Inline edit state
  const [inlineEdit, setInlineEdit] = useState({
    open: false,
    id: null,
    value: "",
    x: 0,
    y: 0,
    width: 200,
  });

  // Background options
  const [background, setBackground] = useState({
    type: "color",
    color: "#ffffff",
    gradient: { type: "linear", colors: ["#4F46E5", "#EC4899"], angle: 45 },
    image: null,
  });

  // Add to history helper
  const addToHistory = (newItems) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(newItems));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo/redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setItems(JSON.parse(history[historyIndex - 1]));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setItems(JSON.parse(history[historyIndex + 1]));
    }
  };

  // Create new text item
  const addText = () => {
    const id = Date.now().toString();
    const w = svgSize.width;
    const h = svgSize.height;
    const newItem = {
      id,
      text: "Double click to edit",
      x: Math.round(w / 2),
      y: Math.round(h / 2),
      fontSize: 28,
      fontFamily: "'Inter', 'Segoe UI', system-ui",
      fontWeight: 400,
      fontStyle: "normal",
      fill: "#2d3748",
      textAnchor: "middle",
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    setSelectedId(id);
    addToHistory(newItems);
  };

  // Update an item
  const updateItem = (id, patch) => {
    const newItems = items.map((it) =>
      it.id === id ? { ...it, ...patch } : it
    );
    setItems(newItems);
    addToHistory(newItems);
  };

  // Delete an item
  const deleteItem = (id) => {
    const newItems = items.filter((it) => it.id !== id);
    setItems(newItems);
    if (selectedId === id)
      setSelectedId(newItems.length > 0 ? newItems[0].id : null);
    addToHistory(newItems);
  };

  // Move layer up/down
  const moveLayer = (id, direction) => {
    const index = items.findIndex((item) => item.id === id);
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === items.length - 1)
    )
      return;

    const newItems = [...items];
    const targetIndex = index + direction;
    [newItems[index], newItems[targetIndex]] = [
      newItems[targetIndex],
      newItems[index],
    ];
    setItems(newItems);
    addToHistory(newItems);
  };

  // Bring to front/back
  const bringToFront = (id) => {
    const index = items.findIndex((item) => item.id === id);
    if (index === items.length - 1) return;

    const newItems = [...items];
    const item = newItems.splice(index, 1)[0];
    newItems.push(item);
    setItems(newItems);
    addToHistory(newItems);
  };

  const sendToBack = (id) => {
    const index = items.findIndex((item) => item.id === id);
    if (index === 0) return;

    const newItems = [...items];
    const item = newItems.splice(index, 1)[0];
    newItems.unshift(item);
    setItems(newItems);
    addToHistory(newItems);
  };

  // Responsive SVG sizing
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.max(300, Math.round(rect.width - 32));

      const paperData = PAPERS[paper];
      const ratio =
        orientation === "portrait"
          ? paperData.w / paperData.h
          : paperData.h / paperData.w;

      const height = Math.round(width / ratio);
      setSvgSize({ width, height });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [paper, orientation]);

  // Coordinate conversion
  const clientToSvg = (clientX, clientY) => {
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
  };

  // Pointer event handlers
  const onTextPointerDown = (e, id) => {
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
  };

  const onTextPointerMove = (e) => {
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
  };

  const onTextPointerUp = () => {
    dragRef.current.dragging = false;
    dragRef.current.id = null;
    window.removeEventListener("pointermove", onTextPointerMove);
    window.removeEventListener("pointerup", onTextPointerUp);
  };

  // Inline editing
  const onTextDoubleClick = (e, id) => {
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
  };

  const finishInlineEdit = (save = true) => {
    if (inlineEdit.open && inlineEdit.id && save) {
      updateItem(inlineEdit.id, { text: inlineEdit.value });
    }
    setInlineEdit({ open: false, id: null, value: "", x: 0, y: 0, width: 200 });
  };

  // Export functions
  const downloadSVG = () => {
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
    a.download = `${paper}-${orientation}-design.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = async (dpi = 300) => {
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
          link.download = `${paper}-${orientation}-design.png`;
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
  };

  // Background rendering
  const renderBackground = () => {
    if (background.type === "color") {
      return <rect width="100%" height="100%" fill={background.color} />;
    } else if (background.type === "gradient") {
      const gradientId = "bgGradient";
      const { type, colors, angle } = background.gradient;

      return (
        <>
          <defs>
            {type === "linear" ? (
              <linearGradient
                id={gradientId}
                gradientTransform={`rotate(${angle})`}
              >
                {colors.map((color, i) => (
                  <stop
                    key={i}
                    offset={`${(i * 100) / (colors.length - 1)}%`}
                    stopColor={color}
                  />
                ))}
              </linearGradient>
            ) : (
              <radialGradient id={gradientId}>
                {colors.map((color, i) => (
                  <stop
                    key={i}
                    offset={`${(i * 100) / (colors.length - 1)}%`}
                    stopColor={color}
                  />
                ))}
              </radialGradient>
            )}
          </defs>
          <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
        </>
      );
    }
    return <rect width="100%" height="100%" fill="#ffffff" />;
  };

  // Font options
  const fontOptions = [
    { label: "Inter", value: "'Inter', 'Segoe UI', system-ui" },
    { label: "Playfair Display", value: "'Playfair Display', Georgia, serif" },
    { label: "Roboto", value: "'Roboto', sans-serif" },
    { label: "Open Sans", value: "'Open Sans', sans-serif" },
    { label: "Montserrat", value: "'Montserrat', sans-serif" },
    { label: "Lora", value: "'Lora', serif" },
    { label: "Source Code Pro", value: "'Source Code Pro', monospace" },
  ];

  // Selected item
  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col">
      <header className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">SVG Poster Editor</h1>
        <p className="text-gray-600">
          Create beautiful, printable posters with SVG
        </p>
      </header>

      <div className="flex flex-1 gap-6">
        {/* Left sidebar - Controls */}
        <div className="w-80 flex flex-col gap-6">
          {/* Paper settings */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-lg mb-4">Paper Settings</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paper Size
              </label>
              <select
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={paper}
                onChange={(e) => setPaper(e.target.value)}
              >
                {Object.keys(PAPERS).map((key) => (
                  <option key={key} value={key}>
                    {PAPERS[key].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orientation
              </label>
              <div className="flex gap-2">
                <button
                  className={`flex-1 p-2 rounded-md ${
                    orientation === "portrait"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setOrientation("portrait")}
                >
                  Portrait
                </button>
                <button
                  className={`flex-1 p-2 rounded-md ${
                    orientation === "landscape"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setOrientation("landscape")}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background
              </label>
              <select
                className="w-full p-2 border rounded-md mb-2"
                value={background.type}
                onChange={(e) =>
                  setBackground({ ...background, type: e.target.value })
                }
              >
                <option value="color">Solid Color</option>
                <option value="gradient">Gradient</option>
              </select>

              {background.type === "color" && (
                <input
                  type="color"
                  value={background.color}
                  onChange={(e) =>
                    setBackground({ ...background, color: e.target.value })
                  }
                  className="w-full h-10"
                />
              )}
            </div>
          </div>

          {/* Text controls */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-lg mb-4">Text Controls</h3>

            <button
              className="w-full bg-blue-500 text-white p-2 rounded-md mb-4 hover:bg-blue-600 transition"
              onClick={addText}
            >
              + Add Text Element
            </button>

            {selectedItem && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Content
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={selectedItem.text}
                    onChange={(e) =>
                      updateItem(selectedId, { text: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Font Size
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={selectedItem.fontSize}
                      onChange={(e) =>
                        updateItem(selectedId, {
                          fontSize: parseInt(e.target.value) || 12,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Family
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedItem.fontFamily}
                    onChange={(e) =>
                      updateItem(selectedId, { fontFamily: e.target.value })
                    }
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Alignment
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Font Weight
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
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
                    className={`flex-1 p-2 rounded-md ${
                      selectedItem.fontStyle === "italic"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      updateItem(selectedId, {
                        fontStyle:
                          selectedItem.fontStyle === "italic"
                            ? "normal"
                            : "italic",
                      })
                    }
                  >
                    Italic
                  </button>

                  <button
                    className="flex-1 p-2 bg-red-500 text-white rounded-md"
                    onClick={() => deleteItem(selectedId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export panel */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-lg mb-4">Export</h3>

            <div className="flex gap-2 mb-4">
              <button
                className="flex-1 p-2 bg-gray-200 rounded-md disabled:opacity-50"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                Undo
              </button>
              <button
                className="flex-1 p-2 bg-gray-200 rounded-md disabled:opacity-50"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                Redo
              </button>
            </div>

            <button
              className="w-full bg-green-500 text-white p-2 rounded-md mb-2 hover:bg-green-600 transition"
              onClick={downloadSVG}
            >
              Download SVG
            </button>

            <button
              className="w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition"
              onClick={() => downloadPNG(300)}
            >
              Download PNG (300 DPI)
            </button>
          </div>
        </div>

        {/* Main canvas area */}
        <div className="flex-1 bg-gray-100 rounded-lg shadow-md p-4 flex flex-col">
          <div
            className="flex-1 flex items-center justify-center overflow-auto"
            ref={containerRef}
          >
            <div className="relative" style={{ width: svgSize.width }}>
              <svg
                ref={svgRef}
                width={svgSize.width}
                height={svgSize.height}
                viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
                xmlns="http://www.w3.org/2000/svg"
                className="bg-white rounded-lg shadow-lg"
                style={{ display: "block" }}
              >
                {/* Background */}
                {renderBackground()}

                {/* Margin guides */}
                <rect
                  x={svgSize.width * 0.05}
                  y={svgSize.height * 0.05}
                  width={svgSize.width * 0.9}
                  height={svgSize.height * 0.9}
                  fill="none"
                  stroke="rgba(0,0,0,0.1)"
                  strokeDasharray="4 4"
                  data-ui
                />

                {/* Text elements */}
                {items.map((item) => (
                  <text
                    key={item.id}
                    x={item.x}
                    y={item.y}
                    fontSize={item.fontSize}
                    fontFamily={item.fontFamily}
                    fontWeight={item.fontWeight}
                    fontStyle={item.fontStyle}
                    fill={item.fill}
                    textAnchor={item.textAnchor}
                    style={{
                      cursor: selectedId === item.id ? "grabbing" : "grab",
                      userSelect: "none",
                    }}
                    onPointerDown={(e) => onTextPointerDown(e, item.id)}
                    onDoubleClick={(e) => onTextDoubleClick(e, item.id)}
                  >
                    {item.text}
                  </text>
                ))}

                {/* Selection indicator */}
                {selectedItem && (
                  <rect
                    x={
                      selectedItem.x -
                      (selectedItem.textAnchor === "middle" ? 100 : 0)
                    }
                    y={selectedItem.y - selectedItem.fontSize}
                    width={200}
                    height={selectedItem.fontSize * 1.5}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    data-ui
                  />
                )}
              </svg>

              {/* Inline text editor */}
              {inlineEdit.open && (
                <input
                  ref={inputRef}
                  type="text"
                  className="absolute p-2 border border-blue-500 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    left: inlineEdit.x,
                    top: inlineEdit.y,
                    width: inlineEdit.width,
                    fontSize: "16px",
                    fontFamily: "inherit",
                  }}
                  value={inlineEdit.value}
                  onChange={(e) =>
                    setInlineEdit({ ...inlineEdit, value: e.target.value })
                  }
                  onBlur={() => finishInlineEdit(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") finishInlineEdit(true);
                    if (e.key === "Escape") finishInlineEdit(false);
                  }}
                  autoFocus
                />
              )}
            </div>
          </div>

          {/* Canvas info */}
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <div>
              Canvas: {svgSize.width} × {svgSize.height}px • {items.length}{" "}
              element(s)
            </div>
            <div>
              {paper} • {orientation}
            </div>
          </div>
        </div>

        {/* Right sidebar - Layers */}
        <div className="w-80 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-lg mb-4">Layers</h3>

          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No text elements. Click "Add Text Element" to start.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-3 border rounded-lg flex items-center cursor-pointer transition ${
                    selectedId === item.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-medium truncate"
                      style={{
                        fontFamily: item.fontFamily,
                        color: item.fill,
                        fontWeight: item.fontWeight,
                        fontStyle: item.fontStyle,
                      }}
                    >
                      {item.text || "(Empty)"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.fontFamily.split(",")[0].replace(/'/g, "")} •{" "}
                      {item.fontSize}px
                    </div>
                  </div>

                  <div className="flex flex-col ml-2">
                    <button
                      className="text-xs p-1 mb-1 rounded hover:bg-gray-200 disabled:opacity-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayer(item.id, -1);
                      }}
                      disabled={index === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      className="text-xs p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayer(item.id, 1);
                      }}
                      disabled={index === items.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SvgPaperEditor;
