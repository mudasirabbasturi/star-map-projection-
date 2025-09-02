// src/components/PosterCanvas.jsx
import { MdOutlineEditNote } from "react-icons/md";
import Map from "@components/Map";

const PosterCanvas = ({
  canvasRef,
  drawerMode,
  showDrawer,
  mapData,
  styles,
}) => {
  const { starsData, mwData, constData, centerRA } = mapData;

  return (
    <div
      ref={canvasRef}
      className={`poster glb ${drawerMode === "poster" ? "active" : ""}`}
      style={{
        minHeight: "100vh",
        background: styles.poster.bgColor,
        borderStyle: styles.poster.borderStyle,
        borderWidth: `${styles.poster.borderWidth}px`,
        borderRadius: `${styles.poster.borderRadius}%`,
        borderColor: styles.poster.borderColor,
      }}
    >
      <div className="editIconWrapper" onClick={() => showDrawer("poster")}>
        <MdOutlineEditNote className="editIcon" />
      </div>

      <div
        className={`posterWrapper glb ${
          drawerMode === "posterWrapper" ? "active" : ""
        }`}
        style={{
          width: `${styles.posterWrapper.width}%`,
          height: `${styles.posterWrapper.height}%`,
          background: styles.posterWrapper.bgColor,
          borderStyle: styles.posterWrapper.borderStyle,
          borderWidth: `${styles.posterWrapper.borderWidth}px`,
          borderRadius: `${styles.posterWrapper.borderRadius}%`,
          borderColor: styles.posterWrapper.borderColor,
        }}
      >
        <div
          className="editIconWrapper"
          onClick={() => showDrawer("posterWrapper")}
        >
          <MdOutlineEditNote className="editIcon" />
        </div>

        <div
          className={`map glb ${drawerMode === "map" ? "active" : ""}`}
          style={{
            width: `${styles.map.width}%`,
            height: `${styles.map.height}%`,
          }}
        >
          <div className="editIconWrapper" onClick={() => showDrawer("map")}>
            <MdOutlineEditNote className="editIcon" />
          </div>

          <Map
            mapStyle={styles.map}
            starsData={starsData}
            mwData={mwData}
            constData={constData}
            centerRA={centerRA}
          />
        </div>
      </div>
    </div>
  );
};

export default PosterCanvas;
