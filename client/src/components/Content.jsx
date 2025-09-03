import { MdOutlineEditNote } from "react-icons/md";
import { GoGrabber } from "react-icons/go";

const Content = ({
  contentStyle,
  drawerMode,
  showDrawer,
  positions,
  handleMouseDown,
}) => {
  return (
    <div
      className={`content glb ${drawerMode === "content" ? "active" : ""}`}
      style={{
        transform: `translateY(${positions.content.y}px)`,
        width: `${contentStyle.width}%`,
        height: `${contentStyle.height}%`,
        bgColor: `${contentStyle.bgColor}`,
        textColor: `${contentStyle.textColor}`,
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
      {contentStyle.show.showMessage && (
        <div
          className="textNode message"
          style={{ transform: `translateY(${positions.message.y}px)` }}
          onMouseDown={(e) => handleMouseDown(e, "message")}
        >
          OUR LUCKY STARS
        </div>
      )}
      {contentStyle.show.showTitle && (
        <div
          className="textNode title"
          style={{ transform: `translateY(${positions.title.y}px)` }}
          onMouseDown={(e) => handleMouseDown(e, "title")}
        >
          Magical Night Sky
        </div>
      )}
      {contentStyle.show.showAddress && (
        <div
          className="textNode address"
          style={{ transform: `translateY(${positions.address.y}px)` }}
          onMouseDown={(e) => handleMouseDown(e, "address")}
        >
          London, United Kingdom
        </div>
      )}
      {contentStyle.show.showDate && (
        <div
          className="textNode date"
          style={{ transform: `translateY(${positions.date.y}px)` }}
          onMouseDown={(e) => handleMouseDown(e, "date")}
        >
          20th September 2021
        </div>
      )}
      {contentStyle.show.showCoordinate && (
        <div
          className="textNode coordinate"
          style={{ transform: `translateY(${positions.coordinate.y}px)` }}
          onMouseDown={(e) => handleMouseDown(e, "coordinate")}
        >
          51.5073° N, 0.1276° W
        </div>
      )}
      {/* <div
        className={`${
          contentStyle.show.showMessage === true ? "d-block" : "d-none"
        } textNode message`}
        style={{ transform: `translateY(${positions.message.y}px)` }}
        onMouseDown={(e) => handleMouseDown(e, "message")}
      >
        OUR LUCKY STARS
      </div>

      <div
        className={`${
          contentStyle.show.showTitle === true ? "d-block" : "d-none"
        } textNode title`}
        style={{ transform: `translateY(${positions.title.y}px)` }}
        onMouseDown={(e) => handleMouseDown(e, "title")}
      >
        Magical Night Sky
      </div>

      <div
        className={`${
          contentStyle.show.showAddress === true ? "d-block" : "d-none"
        } textNode address`}
        style={{ transform: `translateY(${positions.address.y}px)` }}
        onMouseDown={(e) => handleMouseDown(e, "address")}
      >
        London, United Kingdom
      </div>

      <div
        className={`${
          contentStyle.show.showDate === true ? "d-block" : "d-none"
        } textNode date`}
        style={{ transform: `translateY(${positions.date.y}px)` }}
        onMouseDown={(e) => handleMouseDown(e, "date")}
      >
        20th September 2021
      </div>

      <div
        className={`${
          contentStyle.show.showCoordinate === true ? "d-block" : "d-none"
        } textNode coordinate`}
        style={{ transform: `translateY(${positions.coordinate.y}px)` }}
        onMouseDown={(e) => handleMouseDown(e, "coordinate")}
      >
        51.5073° N, 0.1276° W
      </div> */}
    </div>
  );
};

export default Content;
