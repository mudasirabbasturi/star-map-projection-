import { MdOutlineEditNote } from "react-icons/md";
const Title = ({
  titleStyles,
  showStyles,
  positions,
  handleMouseDown,
  showDrawer,
  drawerMode,
  content,
}) => {
  return (
    <>
      {showStyles.title && (
        <div
          className={`title hasIcon ${drawerMode === "title" ? "active" : ""}`}
          style={{
            top: `${positions.title.y}%`,
            width: `${titleStyles.width}%`,
            paddingTop: `${titleStyles.paddingTop}px`,
            paddingBottom: `${titleStyles.paddingBottom}px`,
            paddingLeft: `${titleStyles.paddingLeft}px`,
            paddingRight: `${titleStyles.paddingRight}px`,
            height: `${titleStyles.height}%`,
            backgroundColor: titleStyles.bgColor,
            color: titleStyles.textColor,
            fontSize: `${titleStyles.fontSize}vmin`,
            fontFamily: titleStyles.fontFamily,
            fontStyle: titleStyles.fontStyle,
            fontWeight: titleStyles.fontWeight,
            textTransform: titleStyles.textTransform,
            textDecoration: titleStyles.textDecoration,
            borderStyle: titleStyles.borderStyle,
            borderWidth: `${titleStyles.borderWidth}px`,
            borderRadius: `${titleStyles.borderRadius}%`,
            borderColor: titleStyles.borderColor,
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
