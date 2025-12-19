const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

/* ✅ DEFAULT HOME PAGE */
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html");
});

/* ✅ AUTO QUOTATION NUMBER */
function getNextQuotationNo() {
    let year = new Date().getFullYear();
    let count = 1;

    if (fs.existsSync("quotations.json")) {
        let data = JSON.parse(fs.readFileSync("quotations.json"));
        count = data.length + 1;
    }

    return `BE-${year}-${String(count).padStart(3, "0")}`;
}

app.get("/nextQuotationNo", (req, res) => {
    res.send(getNextQuotationNo());
});

/* ✅ SAVE QUOTATION */
app.post("/save", (req, res) => {
    let data = [];
    if (fs.existsSync("quotations.json")) {
        data = JSON.parse(fs.readFileSync("quotations.json"));
    }
    data.push(req.body);
    fs.writeFileSync("quotations.json", JSON.stringify(data, null, 2));
    res.sendStatus(200);
});

/* ✅ GET ALL QUOTATIONS */
app.get("/quotations", (req, res) => {
    if (fs.existsSync("quotations.json")) {
        res.sendFile(__dirname + "/quotations.json");
    } else {
        res.json([]);
    }
});

/* ✅ GET SINGLE QUOTATION BY NUMBER */
app.get("/quotation/:qno", (req, res) => {
    if (!fs.existsSync("quotations.json")) {
        return res.json(null);
    }

    let data = JSON.parse(fs.readFileSync("quotations.json"));
    let quotation = data.find(q => q.quotationNo === req.params.qno);
    res.json(quotation);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
