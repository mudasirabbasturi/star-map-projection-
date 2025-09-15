import { useState } from "react";

export default function usePosterStyles() {
  const [styles, setStyles] = useState({
    paperSize: "A4",
    bgType: "solid",
    bgColor: "#020202ff",
    bgGradientType: "linear",
    bgGradientAngle: 90,
    bgGradientColors: ["#a80077ff", "#66ff00"],
    bgImage: "https://picsum.photos/800/600",
    bgImageMode: "cover",
    bgImageOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 0,
    borderColor: "#ffffff",

    // 🆕 Default text styles
    textFontFamily: "Arial",
    textFontSize: 24,
    textColor: "#000000",
    textAlign: "left",
    textWeight: "normal",
    textStyle: "normal", // italic, normal
  });

  const updateStyles = (key, value) => {
    setStyles((prev) => ({ ...prev, [key]: value }));
  };

  return { styles, updateStyles };
}
