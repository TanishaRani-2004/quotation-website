// Generate quotation number
let quotationNo = "BE-" + new Date().getFullYear() + "-" + Date.now().toString().slice(-4);
document.getElementById("quotationNo").innerText = quotationNo;

/* ---------- CALCULATIONS ---------- */
function calculateRow(el) {
  const row = el.closest("tr");
  const qty = parseFloat(row.cells[3].children[0].value) || 0;
  const rate = parseFloat(row.cells[5].children[0].value) || 0;

  const total = qty * rate;
  row.querySelector(".row-total").innerText = total.toFixed(2);

  calculateGrandTotal();
}

function calculateGrandTotal() {
  let grand = 0;
  document.querySelectorAll(".row-total").forEach(td => {
    grand += parseFloat(td.innerText) || 0;
  });
  document.getElementById("grandTotal").innerText = grand.toFixed(2);
}

/* ---------- ROW HANDLING ---------- */
function addRow() {
  const tbody = document.querySelector("#quotationTable tbody");
  const rowCount = tbody.rows.length + 1;

  const row = tbody.insertRow();
  row.innerHTML = `
    <td>${rowCount}</td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="number" oninput="calculateRow(this)"></td>
    <td><input type="number"></td>
    <td><input type="number" oninput="calculateRow(this)"></td>
    <td class="row-total">0.00</td>
    <td class="action-col no-print">
      <button class="action-btn" onclick="deleteRow(this)">✖</button>
    </td>
  `;
}

function deleteRow(btn) {
  btn.closest("tr").remove();
  calculateGrandTotal();
}

/* ---------- SAVE QUOTATION ---------- */
function saveQuotation() {
  calculateGrandTotal(); // 🔥 VERY IMPORTANT

  let items = [];
  document.querySelectorAll("#quotationTable tbody tr").forEach(tr => {
    items.push({
      area: tr.cells[1].children[0].value,
      description: tr.cells[2].children[0].value,
      qty: tr.cells[3].children[0].value,
      mrp: tr.cells[4].children[0].value,
      rate: tr.cells[5].children[0].value,
      total: tr.cells[6].innerText
    });
  });

  let data = {
    quotationNo: quotationNo,   // ✅ CONSISTENT KEY
    date: document.getElementById("date").value,
    name: document.getElementById("customerName").value,
    phone: document.getElementById("phone").value,
    total: document.getElementById("grandTotal").innerText,
    items: items
  };

  fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(() => alert("Quotation saved successfully"));
}

