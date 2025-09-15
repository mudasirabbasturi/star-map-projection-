const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
const sizeMap = {
  A0: { width: 9933, height: 14043 },
  A1: { width: 7016, height: 9933 },
  A2: { width: 4961, height: 7016 },
  A3: { width: 3508, height: 4961 },
  A4: { width: 2480, height: 3508 },
  A5: { width: 1748, height: 2480 },
  A6: { width: 1240, height: 1748 },
  Letter: { width: 2550, height: 3300 },
  Legal: { width: 2550, height: 4200 },
};

function sanitizeFileName(name) {
  return name
    .replace(/[^a-z0-9_\- ]/gi, "")
    .replace(/\s+/g, "_")
    .trim();
}

// 🔁 Ensure unique filename like Windows
function getUniqueFilePath(folderPath, baseName, ext) {
  let counter = 0;
  let filePath;
  let fileName;

  do {
    fileName =
      counter === 0 ? `${baseName}.${ext}` : `${baseName} (${counter}).${ext}`;
    filePath = path.join(folderPath, fileName);
    counter++;
  } while (fs.existsSync(filePath));

  return { filePath, fileName };
}

// 📸 Screenshot / Export as file
app.post("/api/screenshot", async (req, res) => {
  try {
    const { html, paperSize, fileName, downloadType } = req.body;
    const safeName = sanitizeFileName(fileName || "poster");

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    let buffer;
    if (downloadType === "pdf") {
      buffer = await page.pdf({
        format: paperSize,
        printBackground: true,
        margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
      });
    } else if (downloadType === "png" || downloadType === "jpeg") {
      const { width, height } = sizeMap[paperSize] || {
        width: 2480,
        height: 3508,
      };
      await page.setViewport({ width, height });
      buffer = await page.screenshot({
        fullPage: false,
        omitBackground: false,
        type: downloadType,
      });
    } else {
      throw new Error("Unsupported download type");
    }
    await browser.close();

    const folderPath = path.join(__dirname, "../client/public/files/posters");
    fs.mkdirSync(folderPath, { recursive: true });

    const { filePath, fileName: finalFileName } = getUniqueFilePath(
      folderPath,
      safeName,
      downloadType
    );

    fs.writeFileSync(filePath, buffer);

    res.json({
      success: true,
      fileName: finalFileName,
      folder: `/files/posters`,
      url: `http://localhost:5173/files/posters/${finalFileName}`,
    });
  } catch (error) {
    console.error("Error generating file:", error);
    res.status(500).send("Error generating file");
  }
});

// 🎨 Export styles as JSON
app.post("/api/export-style", (req, res) => {
  try {
    const { positions, styles, content } = req.body;
    const safeName = sanitizeFileName(content.fileName || "poster");

    const folderPath = path.join(__dirname, "../client/public/files/styles");
    fs.mkdirSync(folderPath, { recursive: true });

    const { filePath, fileName: finalFileName } = getUniqueFilePath(
      folderPath,
      `${safeName}Styles`,
      "json"
    );

    fs.writeFileSync(
      filePath,
      JSON.stringify({ positions, styles, content }, null, 2)
    );

    console.log("✅ Style saved:", filePath);

    res.json({
      success: true,
      fileName: finalFileName,
      folder: `/files/styles`,
      url: `http://localhost:5173/files/styles/${finalFileName}`,
    });
  } catch (error) {
    console.error("Error exporting style:", error);
    res.status(500).json({ success: false, message: "Export failed" });
  }
});

// 📂 List saved files
app.get("/api/files/:type", (req, res) => {
  try {
    const { type } = req.params; // posters or styles
    const folderPath = path.join(__dirname, "../client/public/files", type);
    if (!fs.existsSync(folderPath)) {
      return res.json({ success: true, files: [] });
    }
    const files = fs.readdirSync(folderPath);
    res.json({ success: true, files });
  } catch (err) {
    console.error("Error reading files:", err);
    res.status(500).json({ success: false, message: "Failed to list files" });
  }
});

app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});
