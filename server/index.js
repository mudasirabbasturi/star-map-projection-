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
    const { html, paperSize } = req.body;
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      // format: paperSize || "A4",
      format: paperSize,
      printBackground: true,
      // margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
    });
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="poster.pdf"`,
    });
    res.send(pdfBuffer);
    await browser.close();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});
