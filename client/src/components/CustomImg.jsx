import { MdOutlineEditNote } from "react-icons/md";
// import Content from "./Content";
const CustomImg = ({
  imgStyles,
  showStyles,
  positions,
  handleMouseDown,
  showDrawer,
  drawerMode,
  content,
}) => {
  return (
    <>
      {showStyles.CustomImg && (
        <div
          className={`CustomImg hasIcon ${
            drawerMode === "CustomImg" ? "active" : ""
          }`}
          style={{
            top: `${positions.CustomImg.y}%`,
            width: `${imgStyles.width}%`,
            height: `${imgStyles.height}%`,
            backgroundColor: imgStyles.bgColor,
          }}
          onMouseDown={(e) => handleMouseDown(e, "CustomImg")}
        >
          <div className="iconWrapper" onClick={() => showDrawer("CustomImg")}>
            <MdOutlineEditNote className="editIcon" />
          </div>
          <svg
            width={`${imgStyles.imgDimention}%`}
            height={`${imgStyles.imgDimention}%`}
            viewBox="0 0 200 200"
          >
            <defs>
              <clipPath id="circleClip">
                <circle cx="100" cy="100" r="100" />
              </clipPath>
            </defs>

            <image
              href={imgStyles.imgSrc}
              width="100%"
              height="100%"
              clipPath="url(#circleClip)"
              preserveAspectRatio="xMidYMid slice"
              style={{ objectFit: "cover" }}
            />
          </svg>
          <div
            className="custom_img_txt"
            style={{
              fontFamily: imgStyles.fontFamily,
              fontStyle: imgStyles.fontStyle,
              fontWeight: imgStyles.fontWeight,
              fontSize: `${imgStyles.fontSize}vmin`,
              color: imgStyles.textColor,
              textTransform: imgStyles.textTransform,
              textDecoration: imgStyles.textDecoration,
              paddingTop: `${imgStyles.paddingTop}%`,
            }}
          >
            {showStyles.imgTxt_1 && (
              <div className="imgTxt imgTxt_1" style={{ textAlign: "center" }}>
                {content.text1}
              </div>
            )}
            {showStyles.imgTxt_2 && (
              <div className="imgTxt imgTxt_2" style={{ textAlign: "center" }}>
                {content.text2}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default CustomImg;
