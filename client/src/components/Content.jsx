import React, { useState } from "react";
import { MdOutlineEditNote } from "react-icons/md";
import { GoGrabber } from "react-icons/go";

const Content = ({
  content,
  onChangeContent,
  contentStyle,
  drawerMode,
  showDrawer,
  positions,
  handleMouseDown,
}) => {
  const [hoveredNode, setHoveredNode] = useState(null);

  const shouldShowLabel = (node) =>
    drawerMode === "content" || drawerMode === node || hoveredNode === node;

  // Merge styles for SVG text
  const getNodeStyle = (nodeKey) => {
    const nodeStyle = contentStyle.nodes?.[nodeKey] || {};
    const globalStyle = {
      textColor: contentStyle.textColor,
      fontFamily: contentStyle.fontFamily,
      fontStyle: contentStyle.fontStyle,
      fontWeight: contentStyle.fontWeight,
      fontSize: contentStyle.fontSize,
      textTransform: contentStyle.textTransform,
      textDecoration: contentStyle.textDecoration,
    };

    const getValue = (key) =>
      nodeStyle[key] !== undefined && nodeStyle[key] !== ""
        ? nodeStyle[key]
        : globalStyle[key];

    return {
      fill: getValue("textColor"),
      fontFamily: getValue("fontFamily"),
      fontStyle: getValue("fontStyle"),
      fontWeight: getValue("fontWeight"),
      fontSize: `${getValue("fontSize")}px`,
      textTransform: getValue("textTransform"),
      textDecoration: getValue("textDecoration"),
    };
  };

  const renderNode = (nodeKey, label, text) => {
    if (!contentStyle.show[`show${label}`]) return null;

    const y = positions[nodeKey]?.y || 0;

    return (
      <g
        key={nodeKey}
        className={`svgTextNode ${nodeKey} glb ${
          drawerMode === nodeKey ? "active" : ""
        }`}
        onMouseDown={(e) => handleMouseDown(e, nodeKey)}
        onMouseEnter={() => setHoveredNode(nodeKey)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        <text
          x="50%"
          y={`${y}px`}
          textAnchor="middle"
          dominantBaseline="middle"
          style={getNodeStyle(nodeKey)}
        >
          {text}
        </text>
        {/* Edit icon overlay (outside SVG space, optional) */}
        <foreignObject x="90%" y={y - 10} width="30" height="30">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="editIconWrapper"
            onClick={() => showDrawer(nodeKey)}
          >
            <MdOutlineEditNote className="editIcon" />
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <svg
      className={`content glb ${drawerMode === "content" ? "active" : ""}`}
      width="100%"
      height="100%"
      viewBox="0 0 1200 1200"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background border/frame */}
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={contentStyle.bgColor}
        stroke={contentStyle.borderColor}
        strokeWidth={contentStyle.borderWidth}
        rx={contentStyle.borderRadius}
      />

      {/* Grab icon as overlay */}
      <foreignObject x="10" y="10" width="30" height="30">
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="grabbingIconWrapper"
          onMouseDown={(e) => handleMouseDown(e, "content")}
        >
          <GoGrabber className="editIcon" />
        </div>
      </foreignObject>

      {/* Edit icon as overlay */}
      <foreignObject x="50" y="10" width="30" height="30">
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="editIconWrapper"
          onClick={() => showDrawer("content")}
        >
          <MdOutlineEditNote className="editIcon" />
        </div>
      </foreignObject>

      {/* Render all text nodes */}
      {renderNode("message", "Message", content.message)}
      {renderNode("title", "Title", content.title)}
      {renderNode("address", "Address", content.address)}
      {renderNode("date", "Date", content.date)}
      {renderNode("coordinate", "Coordinate", content.coordinate)}
    </svg>
  );
};

export default Content;
