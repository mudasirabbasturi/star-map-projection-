import { useState, useRef, Suspense } from "react";
import { Spin, Drawer } from "antd";
import PosterSetting from "./PosterSetting";

const PAPER_SIZES = {
  A0: { w: 3177.6, h: 4492.8 },
  A1: { w: 2244.6, h: 3177.6 },
  A2: { w: 1587.3, h: 2244.6 },
  A3: { w: 1122.3, h: 1587.3 },
  A4: { w: 793.7, h: 1122.3 },
  A5: { w: 558.8, h: 793.7 },
  A6: { w: 396.9, h: 558.8 },
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const [styles, setStyles] = useState({
    paperSize: "A4",

    // Background
    bgType: "solid", // solid | gradient
    bgColor: "#020202",
    bgGradientColors: ["#a80077", "#66ff00"],
    bgGradientType: "linear",
    bgGradientAngle: 90,

    // Background image
    bgImage: null, // url string
    bgImageMode: "cover", // cover | contain | 100% 100%
    bgImageOpacity: 1,

    // Border
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 0,
    borderColor: "#ffffff",
  });

  const [content, setContent] = useState({
    downloadType: "pdf",
    fileName: "poster",
  });

  const updateStyles = (key, value) => {
    setStyles((prev) => ({ ...prev, [key]: value }));
  };

  const onChangeContent = (key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  // Build background layers
  const buildBackground = () => {
    let base =
      styles.bgType === "solid"
        ? styles.bgColor
        : `linear-gradient(${
            styles.bgGradientAngle
          }deg, ${styles.bgGradientColors.join(", ")})`;

    if (styles.bgImage) {
      // Add image layer on top of color/gradient
      return `${base}, url(${styles.bgImage})`;
    }
    return base;
  };

  const { w, h } = PAPER_SIZES[styles.paperSize] || PAPER_SIZES["A4"];

  return (
    <div className="app-container">
      <div className="main-body">
        <Spin spinning={loading} tip="Generating poster..." size="large">
          <Suspense fallback={<div>Loading Poster...</div>}>
            <div
              ref={canvasRef}
              className="poster"
              style={{
                width: w,
                height: h,
                position: "relative",

                background: buildBackground(),
                backgroundSize: styles.bgImage ? styles.bgImageMode : "auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",

                // For image opacity, overlay a color with alpha
                ...(styles.bgImage && styles.bgImageOpacity < 1
                  ? {
                      backgroundImage: `linear-gradient(rgba(0,0,0,${
                        1 - styles.bgImageOpacity
                      }), rgba(0,0,0,${1 - styles.bgImageOpacity})), url(${
                        styles.bgImage
                      })`,
                      backgroundBlendMode: "normal",
                      backgroundSize: styles.bgImageMode,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }
                  : {}),

                border: `${styles.borderWidth}px ${styles.borderStyle} ${styles.borderColor}`,
                borderRadius: styles.borderRadius,
              }}
            ></div>
          </Suspense>
        </Spin>
      </div>

      {/* Settings Drawer */}
      <Drawer open={true} placement="left" title="Poster Setting" width={300}>
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
