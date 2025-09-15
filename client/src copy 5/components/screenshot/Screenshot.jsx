export async function capture(canvasRef, styles, content) {
  if (!canvasRef.current) return;

  try {
    const htmlContent = canvasRef.current.outerHTML;
    const cssText = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch {
          return "";
        }
      })
      .join("\n");

    const fullHTML = `<html>
      <head>
        <meta charset="UTF-8">
        <style>${cssText}</style>
      </head>
      <body>${htmlContent}</body>
      </html>`;

    const response = await fetch("http://localhost:3001/api/screenshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: fullHTML,
        paperSize: styles.paperSize,
        fileName: content.fileName,
        downloadType: content.downloadType,
      }),
    });

    if (!response.ok) throw new Error("Failed to capture screenshot");
    const data = await response.json();

    window.open(data.url, "_blank");
    console.log("✅ File saved:", data);
    return data;
  } catch (err) {
    console.error("Error capturing screenshot:", err);
    alert("❌ Error saving file: " + err.message);
    throw err;
  }
}
