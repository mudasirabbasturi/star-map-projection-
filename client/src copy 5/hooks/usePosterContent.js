import { useState } from "react";

export default function usePosterContent() {
  const [content, setContent] = useState({
    downloadType: "png",
    fileName: "poster",
  });

  const updateContent = (key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  return { content, updateContent };
}
