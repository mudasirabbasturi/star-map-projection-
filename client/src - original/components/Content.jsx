import React, { useState } from "react";
import { MdOutlineEditNote } from "react-icons/md";
import { GoGrabber } from "react-icons/go";

const Content = ({
  content,
  contentStyle,
  drawerMode,
  showDrawer,
  positions,
  handleMouseDown,
}) => {
  const [hoveredNode, setHoveredNode] = useState(null);

  const shouldShowLabel = (node) =>
    drawerMode === "content" || drawerMode === node || hoveredNode === node;

  const getNodeStyle = (nodeKey) => {
    const nodeStyle = contentStyle.nodes?.[nodeKey] || {};
    return {
      backgroundColor: nodeStyle.bgColor || contentStyle.bgColor,
      color: nodeStyle.textColor || contentStyle.textColor,
      fontFamily: nodeStyle.fontFamily || contentStyle.fontFamily,
      fontStyle: nodeStyle.fontStyle || contentStyle.fontStyle,
      fontWeight: nodeStyle.fontWeight || contentStyle.fontWeight,
      fontSize:
        (nodeStyle.fontSize && `${nodeStyle.fontSize}px`) ||
        `${contentStyle.fontSize}px`,
      textTransform: nodeStyle.textTransform || contentStyle.textTransform,
      textDecoration: nodeStyle.textDecoration || contentStyle.textDecoration,
      width: nodeStyle.width ? `${nodeStyle.width}%` : "auto",
    };
  };

  return (
    <div
      className={`content glb ${drawerMode === "content" ? "active" : ""}`}
      style={{
        transform: `translateY(${positions.content.y}px)`,
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
      {/* Drag handle + edit button for whole content */}
      <div
        className="grabbingIconWrapper"
        onMouseDown={(e) => handleMouseDown(e, "content")}
      >
        <GoGrabber className="editIcon" />
      </div>
      <div className="editIconWrapper" onClick={() => showDrawer("content")}>
        <MdOutlineEditNote className="editIcon" />
      </div>

      {/* Message Node */}
      {contentStyle.show.showMessage && (
        <div
          className="textNode message glb"
          style={{
            transform: `translateY(${positions.message.y}px)`,
            ...getNodeStyle("message"),
          }}
          onMouseDown={(e) => handleMouseDown(e, "message")}
          onMouseEnter={() => setHoveredNode("message")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {shouldShowLabel("message") && (
            <span className="text-info fst-italic small">Message: </span>
          )}
          {content.message}
          <div
            className="editIconWrapper"
            onClick={() => showDrawer("message")}
          >
            <MdOutlineEditNote className="editIcon" />
          </div>
        </div>
      )}

      {/* Title Node */}
      {contentStyle.show.showTitle && (
        <div
          className="textNode title glb"
          style={{
            transform: `translateY(${positions.title.y}px)`,
            ...getNodeStyle("title"),
          }}
          onMouseDown={(e) => handleMouseDown(e, "title")}
          onMouseEnter={() => setHoveredNode("title")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {shouldShowLabel("title") && (
            <span className="text-info fst-italic small">Title: </span>
          )}
          {content.title}
          <div className="editIconWrapper" onClick={() => showDrawer("title")}>
            <MdOutlineEditNote className="editIcon" />
          </div>
        </div>
      )}

      {/* Address Node */}
      {contentStyle.show.showAddress && (
        <div
          className="textNode address glb"
          style={{
            transform: `translateY(${positions.address.y}px)`,
            ...getNodeStyle("address"),
          }}
          onMouseDown={(e) => handleMouseDown(e, "address")}
          onMouseEnter={() => setHoveredNode("address")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {shouldShowLabel("address") && (
            <span className="text-info fst-italic small">Address: </span>
          )}
          {content.address}
          <div
            className="editIconWrapper"
            onClick={() => showDrawer("address")}
          >
            <MdOutlineEditNote className="editIcon" />
          </div>
        </div>
      )}

      {/* Date Node */}
      {contentStyle.show.showDate && (
        <div
          className="textNode date glb"
          style={{
            transform: `translateY(${positions.date.y}px)`,
            ...getNodeStyle("date"),
          }}
          onMouseDown={(e) => handleMouseDown(e, "date")}
          onMouseEnter={() => setHoveredNode("date")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {shouldShowLabel("date") && (
            <span className="text-info fst-italic small">Date: </span>
          )}
          {content.date}
          <div className="editIconWrapper" onClick={() => showDrawer("date")}>
            <MdOutlineEditNote className="editIcon" />
          </div>
        </div>
      )}

      {/* Coordinate Node */}
      {contentStyle.show.showCoordinate && (
        <div
          className="textNode coordinate glb"
          style={{
            transform: `translateY(${positions.coordinate.y}px)`,
            ...getNodeStyle("coordinate"),
          }}
          onMouseDown={(e) => handleMouseDown(e, "coordinate")}
          onMouseEnter={() => setHoveredNode("coordinate")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {shouldShowLabel("coordinate") && (
            <span className="text-info fst-italic small">Coordinate: </span>
          )}
          {content.coordinate}
          <div
            className="editIconWrapper"
            onClick={() => showDrawer("coordinate")}
          >
            <MdOutlineEditNote className="editIcon" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
