import { MdOutlineEditNote } from "react-icons/md";
const Content = ({
  styles,
  positions,
  handleMouseDown,
  showDrawer,
  drawerMode,
  content,
}) => {
  return (
    <>
      {styles.show.content && (
        <div
          className={`content hasIcon ${
            drawerMode === "content" ? "active" : ""
          }`}
          style={{
            width: `${styles.content.width}%`,
            height: `${styles.content.height}%`,
            paddingTop: `${styles.content.paddingTop}px`,
            paddingBottom: `${styles.content.paddingBottom}px`,
            paddingLeft: `${styles.content.paddingLeft}px`,
            paddingRight: `${styles.content.paddingRight}px`,
            backgroundColor: styles.content.bgColor,
            top: `${positions.content.y}%`,
            color: styles.content.textColor,
            fontSize: `${styles.content.fontSize}vmin`,
            fontFamily: styles.content.fontFamily,
            fontStyle: styles.content.fontStyle,
            fontWeight: styles.content.fontWeight,
            textTransform: styles.content.textTransform,
            textDecoration: styles.content.textDecoration,
            borderStyle: styles.content.borderStyle,
            borderWidth: `${styles.content.borderWidth}px`,
            borderRadius: `${styles.content.borderRadius}%`,
            borderColor: styles.content.borderColor,
          }}
          onMouseDown={(e) => handleMouseDown(e, "content")}
        >
          <div className="iconWrapper" onClick={() => showDrawer("content")}>
            <MdOutlineEditNote className="editIcon" />
          </div>
          {styles.show.address && (
            <div className="address">{content.address}</div>
          )}
          {styles.show.date && (
            <div className="date">
              {content.date}
              {styles.show.time && <span className="ms-1">{content.time}</span>}
            </div>
          )}
          {styles.show.message && (
            <div className="message">{content.message}</div>
          )}
          {styles.show.coordinate && (
            <div className="coordinate">{content.coordinate}</div>
          )}
        </div>
      )}
    </>
  );
};
export default Content;
