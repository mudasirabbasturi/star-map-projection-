import { useState, Suspense, lazy } from "react";
import { MdEdit } from "react-icons/md";
const HeartSVG = lazy(() => import("@components/map/projections/HeartSVG"));
const Map = ({ showDrawer, styles }) => {
  return (
    <div
      className="map glb"
      style={{
        background: styles.map.bgColor,
        width: `${styles.map.width}%`,
        height: `${styles.map.height}%`,
        position: "relative",
      }}
    >
      <HeartSVG width={400} height={400} />
      <div className="editIconWrapper" onClick={() => showDrawer("map")}>
        <MdEdit className="editIcon" />
      </div>
    </div>
  );
};

export default Map;
