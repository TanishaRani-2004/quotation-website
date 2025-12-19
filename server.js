const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = "quotations.json";

/* ---------- HOME PAGE ---------- */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
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

  res.send({ success: true });
});

/* ---------- GET ALL QUOTATIONS ---------- */
app.get("/quotations", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json([]);
  const quotations = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(quotations);
});

/* ---------- GET SINGLE QUOTATION ---------- */
app.get("/quotation/:id", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json(null);

  const quotations = JSON.parse(fs.readFileSync(DATA_FILE));
  const quotation = quotations.find(q => q.id === req.params.id);
  res.json(quotation);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

