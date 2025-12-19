const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = "quotations.json";

/* ---------- HOME ---------- */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ---------- SAVE QUOTATION ---------- */
app.post("/save", (req, res) => {
  const data = req.body;

  let quotations = [];
  if (fs.existsSync(DATA_FILE)) {
    quotations = JSON.parse(fs.readFileSync(DATA_FILE));
  }

  quotations.push(data);
  fs.writeFileSync(DATA_FILE, JSON.stringify(quotations, null, 2));

  res.json({ success: true });
});

/* ---------- GET ALL ---------- */
app.get("/quotations", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json([]);
  res.json(JSON.parse(fs.readFileSync(DATA_FILE)));
});

/* ---------- GET SINGLE (FIXED) ---------- */
app.get("/quotation/:qno", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json(null);

  const quotations = JSON.parse(fs.readFileSync(DATA_FILE));
  const quotation = quotations.find(q => q.quotationNo === req.params.qno);

  res.json(quotation || null);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

