import React, { useState } from "react";
import { Input } from "antd";
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
  return (
    <div
      className={`content glb ${drawerMode === "content" ? "active" : ""}`}
      style={{
        transform: `translateY(${positions.content.y}px)`,
        width: `${contentStyle.width}%`,
        height: `${contentStyle.height}%`,
        backgroundColor: `${contentStyle.bgColor}`,
        color: `${contentStyle.textColor}`,
        fontFamily: `${contentStyle.fontFamily}`,
        fontStyle: `${contentStyle.fontStyle}`,
        fontWeight: `${contentStyle.fontWeight}`,
        fontSize: `${contentStyle.fontSize}px`,
        textTransform: `${contentStyle.textTransform}`,
        textDecoration: `${contentStyle.textDecoration}`,
        borderStyle: `${contentStyle.borderStyle}`,
        borderWidth: `${contentStyle.borderWidth}px`,
        borderRadius: `${contentStyle.borderRadius}px`,
        borderColor: `${contentStyle.borderColor}`,
      }}
    >
      <div
        className="grabbingIconWrapper"
        onMouseDown={(e) => handleMouseDown(e, "content")}
      >
        <GoGrabber className="editIcon" />
      </div>
      <div className="editIconWrapper" onClick={() => showDrawer("content")}>
        <MdOutlineEditNote className="editIcon" />
      </div>

      {/* Draggable Nodes */}

      {/* Message */}
      {contentStyle.show.showMessage && (
        <div
          className="textNode message glb"
          style={{
            transform: `translateY(${positions.message.y}px)`,
            width: `${contentStyle.nodes.message.width}%`,
            backgroundColor: `${contentStyle.nodes.message.bgColor}`,
            color: `${contentStyle.nodes.message.textColor}`,
            fontFamily: `${contentStyle.nodes.message.fontFamily}`,
            fontStyle: `${contentStyle.nodes.message.fontStyle}`,
            fontWeight: `${contentStyle.nodes.message.fontWeight}`,
            fontSize: `${contentStyle.nodes.message.fontSize}px`,
            textTransform: `${contentStyle.nodes.message.textTransform}`,
            textDecoration: `${contentStyle.nodes.message.textDecoration}`,
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

      {/* Title */}
      {contentStyle.show.showTitle && (
        <div
          className="textNode title glb"
          style={{
            transform: `translateY(${positions.title.y}px)`,
            width: `${contentStyle.nodes.title.width}%`,
            backgroundColor: `${contentStyle.nodes.title.bgColor}`,
            color: `${contentStyle.nodes.title.textColor}`,
            fontFamily: `${contentStyle.nodes.title.fontFamily}`,
            fontStyle: `${contentStyle.nodes.title.fontStyle}`,
            fontWeight: `${contentStyle.nodes.title.fontWeight}`,
            fontSize: `${contentStyle.nodes.title.fontSize}px`,
            textTransform: `${contentStyle.nodes.title.textTransform}`,
            textDecoration: `${contentStyle.nodes.title.textDecoration}`,
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

      {/* Address */}
      {contentStyle.show.showAddress && (
        <div
          className="textNode address glb"
          style={{
            transform: `translateY(${positions.address.y}px)`,
            width: `${contentStyle.nodes.address.width}%`,
            backgroundColor: `${contentStyle.nodes.address.bgColor}`,
            color: `${contentStyle.nodes.address.textColor}`,
            fontFamily: `${contentStyle.nodes.address.fontFamily}`,
            fontStyle: `${contentStyle.nodes.address.fontStyle}`,
            fontWeight: `${contentStyle.nodes.address.fontWeight}`,
            fontSize: `${contentStyle.nodes.address.fontSize}px`,
            textTransform: `${contentStyle.nodes.address.textTransform}`,
            textDecoration: `${contentStyle.nodes.address.textDecoration}`,
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

      {/* Date */}
      {contentStyle.show.showDate && (
        <div
          className="textNode date glb"
          style={{
            transform: `translateY(${positions.date.y}px)`,
            width: `${contentStyle.nodes.date.width}%`,
            backgroundColor: `${contentStyle.nodes.date.bgColor}`,
            color: `${contentStyle.nodes.date.textColor}`,
            fontFamily: `${contentStyle.nodes.date.fontFamily}`,
            fontStyle: `${contentStyle.nodes.date.fontStyle}`,
            fontWeight: `${contentStyle.nodes.date.fontWeight}`,
            fontSize: `${contentStyle.nodes.date.fontSize}px`,
            textTransform: `${contentStyle.nodes.date.textTransform}`,
            textDecoration: `${contentStyle.nodes.date.textDecoration}`,
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

      {/* Coordinate */}
      {contentStyle.show.showCoordinate && (
        <div
          className="textNode coordinate glb"
          style={{
            transform: `translateY(${positions.coordinate.y}px)`,
            width: `${contentStyle.nodes.coordinate.width}%`,
            backgroundColor: `${contentStyle.nodes.coordinate.bgColor}`,
            color: `${contentStyle.nodes.coordinate.textColor}`,
            fontFamily: `${contentStyle.nodes.coordinate.fontFamily}`,
            fontStyle: `${contentStyle.nodes.coordinate.fontStyle}`,
            fontWeight: `${contentStyle.nodes.coordinate.fontWeight}`,
            fontSize: `${contentStyle.nodes.coordinate.fontSize}px`,
            textTransform: `${contentStyle.nodes.coordinate.textTransform}`,
            textDecoration: `${contentStyle.nodes.coordinate.textDecoration}`,
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
