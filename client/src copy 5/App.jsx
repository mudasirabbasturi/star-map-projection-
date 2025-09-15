import React, { useRef, useState } from "react";
import { Drawer } from "antd";
import { MdOutlineEditNote } from "react-icons/md";
import PosterSetting from "./components/setting/PosterSetting";
import TextSetting from "./components/setting/TextSetting";
import Sidebar from "./components/sidebar/Sidebar";
import { capture } from "./components/screenshot/Screenshot";
import Text from "./components/text/Text";

// Hooks
import usePosterStyles from "./hooks/usePosterStyles";
import usePosterContent from "./hooks/usePosterContent";
import useDrawerState from "./hooks/useDrawerState";

const App = () => {
  const { styles, updateStyles } = usePosterStyles();
  const { content, updateContent } = usePosterContent();
  const { open, drawerMode, showDrawer, closeDrawer } = useDrawerState();
  const posterRef = useRef(null);

  // 🆕 Manage text elements here
  const [texts, setTexts] = useState([]);
  const [activeText, setActiveText] = useState(null);

  const handleScreenShot = async () => {
    await capture(posterRef, styles, content);
  };
  const handleExport = () => console.log("Export logic...");
  const handleImport = () => console.log("Import logic...");

  const getBaseBackground = () => {
    if (styles.bgType === "solid") return styles.bgColor;
    if (styles.bgType === "gradient") {
      if (styles.bgGradientType === "linear") {
        return `linear-gradient(${
          styles.bgGradientAngle
        }deg, ${styles.bgGradientColors.join(", ")})`;
      }
      if (styles.bgGradientType === "radial") {
        return `radial-gradient(${styles.bgGradientColors.join(", ")})`;
      }
      if (styles.bgGradientType === "conic") {
        return `conic-gradient(from ${
          styles.bgGradientAngle
        }deg, ${styles.bgGradientColors.join(", ")})`;
      }
    }
    return "#fff";
  };

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
      pointerEvents: "none",
    };
  };

  return (
    <div className="app-container">
      <Sidebar
        loading={false}
        showDrawer={showDrawer}
        handleScreenShot={handleScreenShot}
        handleExport={handleExport}
        handleImport={handleImport}
      />

      {/* Poster Preview */}
      <div
        ref={posterRef}
        className={`poster hasIcon ${drawerMode === "poster" ? "active" : ""}`}
        style={{
          border: `${styles.borderWidth}px ${styles.borderStyle} ${styles.borderColor}`,
          borderRadius: styles.borderRadius,
          background: getBaseBackground(),
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={getImageOverlayStyle()} />
        {texts.map(
          (t, i) =>
            t.visible && (
              <Text
                key={t.id}
                text={t}
                isActive={i === activeText}
                onClick={() => {
                  setActiveText(i);
                  showDrawer("text");
                }}
              />
            )
        )}
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
        {drawerMode === "poster" ? (
          <PosterSetting
            styles={styles}
            updateStyles={updateStyles}
            content={content}
            onChangeContent={updateContent}
          />
        ) : drawerMode === "text" ? (
          <TextSetting
            texts={texts}
            setTexts={setTexts}
            activeText={activeText}
            setActiveText={setActiveText}
          />
        ) : null}
      </Drawer>
    </div>
  );
};

export default App;
