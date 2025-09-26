const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const app = express();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const port = 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  "/files",
  express.static(path.join(__dirname, "../client/public/files"))
);

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

app.post("/api/screenshot", async (req, res) => {
  try {
    const { html, paperSize, fileName, downloadType } = req.body;
    const safeName = fileName?.replace(/[^a-z0-9_\- ]/gi, "_") || "poster";
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
    } else {
      const { width, height } = sizeMap[paperSize] || sizeMap["A4"];
      await page.setViewport({ width, height });
      buffer = await page.screenshot({ type: downloadType });
    }
    await browser.close();
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}.${downloadType}"`
    );
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(buffer);
  } catch (error) {
    console.error("Error generating file:", error);
    res.status(500).send("Error generating file");
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(
      __dirname,
      "../client/public/files/customImgs"
    );
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = sanitizeFileName(
      file.originalname.replace(/\.[^/.]+$/, "")
    );
    const { fileName } = getUniqueFilePath(
      path.join(__dirname, "../client/public/files/customImgs"),
      safeName,
      ext.replace(".", "")
    );
    cb(null, fileName);
  },
});

const upload = multer({ storage });

app.post("/api/upload/custom-img", upload.single("file"), (req, res) => {
  res.json({
    success: true,
    fileName: req.file.filename,
    url: `/files/customImgs/${req.file.filename}`,
  });
});

// 🗑 Delete a file
app.delete("/api/files/:type/:fileName", (req, res) => {
  try {
    const { type, fileName } = req.params;
    const folderPath = path.join(__dirname, "../client/public/files", type);
    const filePath = path.join(folderPath, fileName);
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }
    fs.unlinkSync(filePath);
    res.json({ success: true, message: `${fileName} deleted successfully` });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ success: false, message: "Failed to delete file" });
  }
});

app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});
