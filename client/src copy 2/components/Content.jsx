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

  // Merge global + node-specific styles with proper inheritance
  const getNodeStyle = (nodeKey) => {
    const nodeStyle = contentStyle.nodes?.[nodeKey] || {};
    const globalStyle = {
      bgColor: contentStyle.bgColor,
      textColor: contentStyle.textColor,
      fontFamily: contentStyle.fontFamily,
      fontStyle: contentStyle.fontStyle,
      fontWeight: contentStyle.fontWeight,
      fontSize: contentStyle.fontSize,
      textTransform: contentStyle.textTransform,
      textDecoration: contentStyle.textDecoration,
    };

    // Function to get the value with proper inheritance
    const getValue = (key) => {
      const nodeValue = nodeStyle[key];
      // If node has a value, use it, otherwise use global value
      return nodeValue !== undefined && nodeValue !== ""
        ? nodeValue
        : globalStyle[key];
    };

    return {
      transform: `translateY(${positions[nodeKey]?.y || 0}px)`,
      width: nodeStyle.width ? `${nodeStyle.width}%` : "auto",
      backgroundColor: getValue("bgColor"),
      color: getValue("textColor"),
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

    return (
      <div
        key={nodeKey}
        className={`textNode ${nodeKey} glb ${
          drawerMode === nodeKey ? "active" : ""
        }`}
        style={getNodeStyle(nodeKey)}
        onMouseDown={(e) => handleMouseDown(e, nodeKey)}
        onMouseEnter={() => setHoveredNode(nodeKey)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        {shouldShowLabel(nodeKey) && (
          <span className="text-info fst-italic small">{label}: </span>
        )}
        {text}
        <div className="editIconWrapper" onClick={() => showDrawer(nodeKey)}>
          <MdOutlineEditNote className="editIcon" />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`content glb ${drawerMode === "content" ? "active" : ""}`}
      style={{
        transform: `translateY(${positions.content?.y || 0}px)`,
        width: `${contentStyle.width}%`,
        height: `${contentStyle.height}%`,
        backgroundColor: contentStyle.bgColor,
        color: contentStyle.textColor,
        fontFamily: contentStyle.fontFamily,
        fontStyle: contentStyle.fontStyle,
        fontWeight: contentStyle.fontWeight,
        fontSize: `${contentStyle.fontSize}px`,
        textTransform: contentStyle.textTransform,
        textDecoration: contentStyle.textDecoration,
        borderStyle: contentStyle.borderStyle,
        borderWidth: `${contentStyle.borderWidth}px`,
        borderRadius: `${contentStyle.borderRadius}px`,
        borderColor: contentStyle.borderColor,
      }}
    >
      {/* Grab + Edit icons for content */}
      <div
        className="grabbingIconWrapper"
        onMouseDown={(e) => handleMouseDown(e, "content")}
      >
        <GoGrabber className="editIcon" />
      </div>
      <div className="editIconWrapper" onClick={() => showDrawer("content")}>
        <MdOutlineEditNote className="editIcon" />
      </div>

      {/* Render all nodes */}
      {renderNode("message", "Message", content.message)}
      {renderNode("title", "Title", content.title)}
      {renderNode("address", "Address", content.address)}
      {renderNode("date", "Date", content.date)}
      {renderNode("coordinate", "Coordinate", content.coordinate)}
    </div>
  );
};

export default Content;
