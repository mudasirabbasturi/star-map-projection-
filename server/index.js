const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.post("/api/screenshot", async (req, res) => {
  try {
    const { html } = req.body;

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // A4 page size at 300 DPI: 2480x3508 pixels
    await page.setViewport({
      width: 2480,
      height: 3508,
      deviceScaleFactor: 1,
    });

    await page.setContent(html, { waitUntil: "networkidle0" });

    // -----------------------------
    // Option 1: PNG
    // -----------------------------

    const screenshot = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: 2480, height: 3508 },
      omitBackground: false,
    });
    res.set("Content-Type", "image/png");
    res.send(screenshot);

    // -----------------------------
    // Option 2: PDF
    // -----------------------------

    // const pdfBuffer = await page.pdf({
    //   format: "A4",
    //   printBackground: true,
    //   width: "210mm",
    //   height: "297mm",
    // });
    // res.set("Content-Type", "application/pdf");
    // res.send(pdfBuffer);

    // -----------------------------
    // Option 3: SVG (vector)
    // -----------------------------
    // const svgContent = await page.$eval("svg", (el) => el.outerHTML);
    // res.set("Content-Type", "image/svg+xml");
    // res.send(svgContent);

    await browser.close();
  } catch (error) {
    console.error("Error generating screenshot:", error);
    res.status(500).send("Error generating screenshot");
  }
});

app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});
