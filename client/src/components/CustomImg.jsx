import { MdOutlineEditNote } from "react-icons/md";
// import Content from "./Content";
const CustomImg = ({
  styles,
  positions,
  handleMouseDown,
  showDrawer,
  drawerMode,
  content,
}) => {
  return (
    <>
      <div
        className={`CustomImg hasIcon ${
          drawerMode === "CustomImg" ? "active" : ""
        }`}
        style={{
          top: `${positions.CustomImg.y}%`,
          width: `${styles.CustomImg.width}%`,
          height: `${styles.CustomImg.height}%`,
          backgroundColor: styles.CustomImg.bgColor,
        }}
        onMouseDown={(e) => handleMouseDown(e, "CustomImg")}
      >
        <div className="iconWrapper" onClick={() => showDrawer("CustomImg")}>
          <MdOutlineEditNote className="editIcon" />
        </div>
        <svg
          width={`${styles.CustomImg.imgDimention}%`}
          height={`${styles.CustomImg.imgDimention}%`}
          viewBox="0 0 200 200"
        >
          <defs>
            <clipPath id="circleClip">
              <circle cx="100" cy="100" r="100" />
            </clipPath>
          </defs>

          <image
            href="https://picsum.photos/800/600?random=1"
            width="100%"
            height="100%"
            clipPath="url(#circleClip)"
            preserveAspectRatio="xMidYMid slice"
          />
        </svg>
        <div
          className="custom_img_txt pt-2"
          style={{
            fontFamily: styles.CustomImg.fontFamily,
            fontStyle: styles.CustomImg.fontStyle,
            fontWeight: styles.CustomImg.fontWeight,
            fontSize: `${styles.CustomImg.fontSize}vmin`,
            color: styles.CustomImg.textColor,
            textTransform: styles.CustomImg.textTransform,
            textDecoration: styles.CustomImg.textDecoration,
          }}
        >
          {styles.show.imgTxt_1 && (
            <div className="imgTxt imgTxt_1" style={{ textAlign: "center" }}>
              {content.text1}
            </div>
          )}
          {styles.show.imgTxt_2 && (
            <div className="imgTxt imgTxt_2" style={{ textAlign: "center" }}>
              {content.text2}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default CustomImg;
