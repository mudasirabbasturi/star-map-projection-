import { MdOutlineEditNote } from "react-icons/md";
const Content = ({
  contentStyles,
  showStyles,
  positions,
  handleMouseDown,
  showDrawer,
  drawerMode,
  content,
}) => {
  return (
    <>
      {showStyles.content && (
        <div
          className={`content hasIcon ${
            drawerMode === "content" ? "active" : ""
          }`}
          style={{
            width: `${contentStyles.width}%`,
            height: `${contentStyles.height}%`,
            paddingTop: `${contentStyles.paddingTop}px`,
            paddingBottom: `${contentStyles.paddingBottom}px`,
            paddingLeft: `${contentStyles.paddingLeft}px`,
            paddingRight: `${contentStyles.paddingRight}px`,
            backgroundColor: contentStyles.bgColor,
            top: `${positions.content.y}%`,
            color: contentStyles.textColor,
            fontSize: `${contentStyles.fontSize}vmin`,
            fontFamily: contentStyles.fontFamily,
            fontStyle: contentStyles.fontStyle,
            fontWeight: contentStyles.fontWeight,
            textTransform: contentStyles.textTransform,
            textDecoration: contentStyles.textDecoration,
            borderStyle: contentStyles.borderStyle,
            borderWidth: `${contentStyles.borderWidth}px`,
            borderRadius: `${contentStyles.borderRadius}%`,
            borderColor: contentStyles.borderColor,
          }}
          onMouseDown={(e) => handleMouseDown(e, "content")}
        >
          <div className="iconWrapper" onClick={() => showDrawer("content")}>
            <MdOutlineEditNote className="editIcon" />
          </div>
          {showStyles.address && (
            <div className="address">{content.address}</div>
          )}
          {showStyles.date && (
            <div className="date">
              {content.date}
              {showStyles.time && <span className="ms-1">{content.time}</span>}
            </div>
          )}
          {showStyles.message && (
            <div className="message">{content.message}</div>
          )}
          {showStyles.coordinate && (
            <div className="coordinate">{content.coordinate}</div>
          )}
        </div>
      )}
    </>
  );
};
export default Content;
