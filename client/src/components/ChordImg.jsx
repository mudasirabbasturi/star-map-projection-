import { MdOutlineEditNote } from "react-icons/md";
const ChordImg = ({
  styles,
  positions,
  handleMouseDown,
  showDrawer,
  drawerMode,
}) => {
  return (
    <>
      <div
        className={`couple_img hasIcon ${
          drawerMode === "couple_img" ? "active" : ""
        }`}
        style={{
          width: `${styles.couple_img.width}%`,
          top: `${positions.couple_img.y}%`,
        }}
        onMouseDown={(e) => handleMouseDown(e, "couple_img")}
      >
        <div className="iconWrapper" onClick={() => showDrawer("couple_img")}>
          <MdOutlineEditNote className="editIcon" />
        </div>
        <svg width="100%" height="100%" viewBox="0 0 200 200">
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
      </div>
    </>
  );
};
export default ChordImg;
