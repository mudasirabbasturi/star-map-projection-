// src/components/PosterCanvas.jsx
import { MdOutlineEditNote } from "react-icons/md";
import Map from "@components/Map";
import Content from "@components/Content";

const PosterCanvas = ({
  canvasRef,
  drawerMode,
  showDrawer,
  mapData,
  styles,
  content,
  onChangeContent,
  handleMouseDown,
  positions,
}) => {
  const { starsData, mwData, constData, centerRA } = mapData;

  return (
    <>
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
              transform: `translateY(${positions.map.y}px)`,
            }}
            onMouseDown={(e) => handleMouseDown(e, "map")}
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

          <Content
            content={content}
            onChangeContent={onChangeContent}
            contentStyle={styles.content}
            drawerMode={drawerMode}
            showDrawer={showDrawer}
            handleMouseDown={handleMouseDown}
            positions={positions}
          />
        </div>
      </div>
    </>
  );
};

export default PosterCanvas;
