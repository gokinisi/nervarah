// form.js — Nervarah site form handler

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = "Submitting...";

    setTimeout(() => {
      alert("Thank you! Your submission has been received.");
      form.reset();
      btn.disabled = false;
      btn.textContent = "Submit";
    }, 1000);
  });
});
const SHEET_NAME = "Signatures";

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Create header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name / Company",
        "Email",
        "Typed Signature",
        "Signed Date",
        "Agreed",
        "NDA Version",
        "Page URL",
        "User Agent"
      ]);
    }

    const body = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      body.fullName || "",
      body.email || "",
      body.signature || "",
      body.signedDate || "",
      body.agree || "",
      body.ndaVersion || "",
      body.pageUrl || "",
      body.userAgent || ""
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
