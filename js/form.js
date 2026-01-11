// js/form.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("smsNdaForm");
  const statusEl = document.getElementById("smsNdaStatus");

  if (!form) {
    console.error("Form not found: #smsNdaForm");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    statusEl.textContent = "Submitting...";

    const data = Object.fromEntries(new FormData(form).entries());

    // Convert checkboxes into explicit YES/NO fields
    data.ndaAgree = document.getElementById("ndaAgree").checked ? "YES" : "NO";
    data.smsConsent = document.getElementById("smsConsent").checked ? "YES" : "NO";

    // Add audit context (useful for consent proof)
    data.pageUrl = window.location.href;
    data.userAgent = navigator.userAgent;

    if (data.smsConsent !== "YES") {
      statusEl.textContent = "SMS consent is required.";
      return;
    }
    if (data.ndaAgree !== "YES") {
      statusEl.textContent = "NDA acceptance is required.";
      return;
    }

    try {
const ENDPOINT = "http://localhost:4242/api/sms-signup";
document.addEventListener(...)
const
import
document.
fetch

 {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const out = await res.json().catch(() => ({}));
      console.log("Signup response:", res.status, out);

      if (!res.ok || !out.ok) {
        throw new Error(out.error || "Signup failed");
      }

      statusEl.textContent = "Success. Check your phone for a confirmation text.";
      form.reset();
    }} catch (err) {
  console.error("❌ sms-signup error:", err);
  return res.status(500).json({
    ok: false,
    error: err?.message || "Unknown error",
    code: err?.code,
    status: err?.status,
    moreInfo: err?.moreInfo
  });
}

    }
  });
});
const ENDPOINT = "http://localhost:4242/api/sms-signup";

nano js/form.js



