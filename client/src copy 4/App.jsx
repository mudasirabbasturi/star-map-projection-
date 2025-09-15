import React, { useState } from "react";
import PosterSetting from "./components/setting/PosterSetting";
import { Spin, Drawer } from "antd";
import { MdOutlineEditNote } from "react-icons/md";
const App = () => {
  const [styles, setStyles] = useState({
    paperSize: "A4",

    // Background
    bgType: "solid", // "solid" | "gradient"
    bgColor: "#020202ff",
    bgGradientType: "linear",
    bgGradientAngle: 90,
    bgGradientColors: ["#a80077ff", "#66ff00"],

    // Image
    bgImage: "https://picsum.photos/800/600",
    bgImageMode: "cover", // cover | contain | stretch
    bgImageOpacity: 1,

    // Border
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 0,
    borderColor: "#ffffff",
  });

  const [content, setContent] = useState({
    downloadType: "png",
    fileName: "poster",
  });

  const updateStyles = (key, value) => {
    setStyles((prev) => ({ ...prev, [key]: value }));
  };

  const onChangeContent = (key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  // Background style for the base poster (color/gradient only)
  const getBaseBackground = () => {
    if (styles.bgType === "solid") {
      return styles.bgColor;
    } else if (styles.bgType === "gradient") {
      if (styles.bgGradientType === "linear") {
        return `linear-gradient(${
          styles.bgGradientAngle
        }deg, ${styles.bgGradientColors.join(", ")})`;
      } else if (styles.bgGradientType === "radial") {
        return `radial-gradient(${styles.bgGradientColors.join(", ")})`;
      } else if (styles.bgGradientType === "conic") {
        return `conic-gradient(from ${
          styles.bgGradientAngle
        }deg, ${styles.bgGradientColors.join(", ")})`;
      }
    }
    return "#fff";
  };

  // Background style for the image overlay
  const getImageOverlayStyle = () => {
    if (!styles.bgImage) return {};
    let backgroundSize = "cover";
    if (styles.bgImageMode === "contain") backgroundSize = "contain";
    if (styles.bgImageMode === "stretch") backgroundSize = "100% 100%";

    return {
      backgroundImage: `url(${styles.bgImage})`,
      backgroundSize,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      opacity: styles.bgImageOpacity,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: styles.borderRadius,
      pointerEvents: "none", // don’t block UI
    };
  };

  const [open, setOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState(null);
  const showDrawer = (mode) => {
    setOpen(true);
    setDrawerMode(mode);
  };
  const closeDrawer = () => {
    setOpen(false);
    setDrawerMode(null);
  };

  return (
    <div className="app-container">
      {/* Poster Preview */}
      <div
        className={`poster hasIcon ${drawerMode === "poster" ? "active" : ""}`}
        style={{
          border: `${styles.borderWidth}px ${styles.borderStyle} ${styles.borderColor}`,
          borderRadius: styles.borderRadius,
          background: getBaseBackground(),
        }}
      >
        {/* Image overlay */}
        <div style={getImageOverlayStyle()} />
        <div className="iconWrapper" onClick={() => showDrawer("poster")}>
          <MdOutlineEditNote className="editIcon" />
        </div>
      </div>

      {/* Settings Drawer */}
      <Drawer
        open={open}
        onClose={closeDrawer}
        mask={false}
        placement="left"
        title="Poster Setting"
      >
        <PosterSetting
          styles={styles}
          updateStyles={updateStyles}
          content={content}
          onChangeContent={onChangeContent}
        />
      </Drawer>
    </div>
  );
};

export default App;
