const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const port = 3001;

// ---------------------- Helpers ----------------------
function sanitizeFileName(name) {
  return name
    .replace(/[^a-z0-9_\- ]/gi, "")
    .replace(/\s+/g, "_")
    .trim();
}

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

// ✅ Dynamic storage base (works in web + Electron)
function getAppDataPath(appName = "starmap-desktop") {
  if (process.platform === "win32")
    return path.join(process.env.APPDATA, appName);
  if (process.platform === "darwin")
    return path.join(process.env.HOME, "Library", "Preferences", appName);
  return path.join(process.env.HOME, ".local", "share", appName);
}

const FILES_BASE = path.join(getAppDataPath(), "files");

// Create all necessary directories
const directories = [
  FILES_BASE,
  path.join(FILES_BASE, "posters"),
  path.join(FILES_BASE, "styles"),
  path.join(FILES_BASE, "customImgs"),
  path.join(FILES_BASE, "json"),
  path.join(FILES_BASE, "imgs", "starmap", "default"),
];

directories.forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
});

// Copy default files if they don't exist (you'll need to place your default files here)
const defaultFiles = {
  json: [
    {
      source: path.join(__dirname, "server", "json", "stars.6.json"),
      dest: path.join(FILES_BASE, "json", "stars.6.json"),
    },
    {
      source: path.join(__dirname, "server", "json", "mw.json"),
      dest: path.join(FILES_BASE, "json", "mw.json"),
    },
    {
      source: path.join(
        __dirname,
        "server",
        "json",
        "constellations.lines.json"
      ),
      dest: path.join(FILES_BASE, "json", "constellations.lines.json"),
    },
  ],
  imgs: [
    {
      source: path.join(
        __dirname,
        "server",
        "imgs",
        "starmap",
        "default",
        "couple.jpg"
      ),
      dest: path.join(FILES_BASE, "imgs", "starmap", "default", "couple.jpg"),
    },
  ],
};

// Copy default files if source exists and destination doesn't
Object.values(defaultFiles).forEach((fileType) => {
  fileType.forEach((file) => {
    if (fs.existsSync(file.source) && !fs.existsSync(file.dest)) {
      fs.copyFileSync(file.source, file.dest);
    }
  });
});

// ---------------------- Middleware ----------------------
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files from FILES_BASE
app.use("/files", express.static(FILES_BASE));

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

// 📸 Screenshot / Export as file
app.post("/api/screenshot", async (req, res) => {
  try {
    const { html, paperSize, fileName, downloadType } = req.body;
    const safeName = sanitizeFileName(fileName || "poster");

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
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

    const folderPath = path.join(FILES_BASE, "posters");
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
      url: `/files/posters/${finalFileName}`,
    });
  } catch (error) {
    console.error("Error generating file:", error);
    res.status(500).json({ success: false, message: "Error generating file" });
  }
});

// 🎨 Export styles as JSON
app.post("/api/export-style", (req, res) => {
  try {
    const { positions, styles, content } = req.body;
    const safeName = sanitizeFileName(content.fileName || "poster");

    const folderPath = path.join(FILES_BASE, "styles");
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
      url: `/files/styles/${finalFileName}`,
    });
  } catch (error) {
    console.error("Error exporting style:", error);
    res.status(500).json({ success: false, message: "Export failed" });
  }
});

// 📂 List saved files
app.get("/api/files/:type", (req, res) => {
  try {
    const { type } = req.params; // posters, styles, customImgs, etc.
    const folderPath = path.join(FILES_BASE, type);

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

// 🗑 Delete a file
app.delete("/api/files/:type/:fileName", (req, res) => {
  try {
    const { type, fileName } = req.params;
    const folderPath = path.join(FILES_BASE, type);
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

// 📤 Upload custom images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(FILES_BASE, "customImgs");
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = sanitizeFileName(
      file.originalname.replace(/\.[^/.]+$/, "")
    );
    const { fileName } = getUniqueFilePath(
      path.join(FILES_BASE, "customImgs"),
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

// Serve JSON files directly
app.get("/api/json/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(FILES_BASE, "json", filename);

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, message: "JSON file not found" });
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error("Error serving JSON file:", err);
    res
      .status(500)
      .json({ success: false, message: "Error serving JSON file" });
  }
});

app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
  console.log(`Files base directory: ${FILES_BASE}`);
});
