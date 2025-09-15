import { MdOutlineEditNote } from "react-icons/md";
const Title = ({
  styles,
  positions,
  handleMouseDown,
  showDrawer,
  drawerMode,
  content,
}) => {
  return (
    <>
      {styles.show.title && (
        <div
          className={`title hasIcon ${drawerMode === "title" ? "active" : ""}`}
          style={{
            top: `${positions.title.y}%`,
            width: `${styles.content.title.width}%`,
            height: `${styles.content.title.height}%`,
            backgroundColor: styles.content.title.bgColor,
            color: styles.content.title.textColor,
            fontSize: `${styles.content.title.fontSize}px`,
            fontFamily: styles.content.title.fontFamily,
            fontStyle: styles.content.title.fontStyle,
            fontWeight: styles.content.title.fontWeight,
            textTransform: styles.content.title.textTransform,
            textDecoration: styles.content.title.textDecoration,
            borderStyle: styles.content.title.borderStyle,
            borderWidth: `${styles.content.title.borderWidth}px`,
            borderRadius: `${styles.content.title.borderRadius}%`,
            borderColor: styles.content.title.borderColor,
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, "title");
          }}
        >
          <div className="iconWrapper" onClick={() => showDrawer("title")}>
            <MdOutlineEditNote className="editIcon" />
          </div>
          {content.title}
        </div>
      )}
    </>
  );
};
export default Title;
