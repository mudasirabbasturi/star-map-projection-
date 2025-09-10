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
  A0: { width: 9933, height: 14043 }, // 841 x 1189 mm
  A1: { width: 7016, height: 9933 }, // 594 x 841 mm
  A2: { width: 4961, height: 7016 }, // 420 x 594 mm
  A3: { width: 3508, height: 4961 }, // 297 x 420 mm
  A4: { width: 2480, height: 3508 }, // 210 x 297 mm
  A5: { width: 1748, height: 2480 }, // 148 x 210 mm
  A6: { width: 1240, height: 1748 }, // 105 x 148 mm
  Letter: { width: 2550, height: 3300 }, // 8.5 x 11 in
  Legal: { width: 2550, height: 4200 }, // 8.5 x 14 in
};

app.post("/api/screenshot", async (req, res) => {
  try {
    const { html, paperSize, fileName, downloadType } = req.body;
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
    const folderPath = path.join(
      __dirname,
      "../client/public/files",
      downloadType,
      paperSize
    );
    fs.mkdirSync(folderPath, { recursive: true });
    const filePath = path.join(folderPath, `${fileName}.${downloadType}`);
    fs.writeFileSync(filePath, buffer);
    console.log("✅ File saved:", filePath);
    res.json({
      success: true,
      fileName: `${fileName}.${downloadType}`,
      folder: `/files/${downloadType}/${paperSize}`,
      url: `http://localhost:5173/files/${downloadType}/${paperSize}/${fileName}.${downloadType}`,
    });
  } catch (error) {
    console.error("Error generating file:", error);
    res.status(500).send("Error generating file");
  }
});

app.post("/api/export-style", (req, res) => {
  try {
    const { positions, styles, content } = req.body;
    const folderPath = path.join(
      __dirname,
      "../client/public/files/styles",
      styles.paperSize
    );
    fs.mkdirSync(folderPath, { recursive: true });

    const fileName = `${content.fileName}Styles.json`;
    const filePath = path.join(folderPath, fileName);

    fs.writeFileSync(
      filePath,
      JSON.stringify({ positions, styles, content }, null, 2)
    );

    res.json({
      success: true,
      fileName,
      url: `http://localhost:5173/files/styles/${styles.paperSize}/${fileName}`,
    });
  } catch (error) {
    console.error("Error exporting style:", error);
    res.status(500).json({ success: false, message: "Export failed" });
  }
});

app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});
