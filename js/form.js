// js/form.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("smsNdaForm");
  const statusEl = document.getElementById("smsNdaStatus");
  const subscribeBtn = document.getElementById("subscribeBtn"); // optional

  if (!form) {
    console.error("Form not found: #smsNdaForm");
    return;
  }
  if (!statusEl) {
    console.error("Status element not found: #smsNdaStatus");
    return;
  }

  // Use a relative path so it works on both localhost and https://nervarah.com
  // Your backend must be deployed to serve this route (or you must proxy it).
  const CHECKOUT_ENDPOINT = "/api/create-checkout-session";

  // Prevent accidental double-submits
  let isSubmitting = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;

    statusEl.textContent = "Submitting...";
    if (subscribeBtn) subscribeBtn.disabled = true;

    // Gather form data
    const data = Object.fromEntries(new FormData(form).entries());

    // Checkboxes as explicit YES/NO
    const ndaAgreeChecked = !!document.getElementById("ndaAgree")?.checked;
    const smsConsentChecked = !!document.getElementById("smsConsent")?.checked;

    data.ndaAgree = ndaAgreeChecked ? "YES" : "NO";
    data.smsConsent = smsConsentChecked ? "YES" : "NO";

    // Audit context
    data.pageUrl = window.location.href;
    data.userAgent = navigator.userAgent;
    data.submittedAt = new Date().toISOString();

    // Basic validation
    if (!data.name || String(data.name).trim().length < 2) {
      statusEl.textContent = "Please enter your name.";
      isSubmitting = false;
      if (subscribeBtn) subscribeBtn.disabled = false;
      return;
    }
    if (!data.email || !String(data.email).includes("@")) {
      statusEl.textContent = "Please enter a valid email.";
      isSubmitting = false;
      if (subscribeBtn) subscribeBtn.disabled = false;
      return;
    }
    if (!data.phone || String(data.phone).replace(/\D/g, "").length < 10) {
      statusEl.textContent = "Please enter a valid phone number.";
      isSubmitting = false;
      if (subscribeBtn) subscribeBtn.disabled = false;
      return;
    }

    if (data.smsConsent !== "YES") {
      statusEl.textContent = "SMS consent is required.";
      isSubmitting = false;
      if (subscribeBtn) subscribeBtn.disabled = false;
      return;
    }
    if (data.ndaAgree !== "YES") {
      statusEl.textContent = "NDA acceptance is required.";
      isSubmitting = false;
      if (subscribeBtn) subscribeBtn.disabled = false;
      return;
    }

    try {
      // Send only what backend needs (avoid sending every form field if you add more later)
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        ndaAgree: data.ndaAgree,
        smsConsent: data.smsConsent,
        pageUrl: data.pageUrl,
        userAgent: data.userAgent,
        submittedAt: data.submittedAt,
      };

      const res = await fetch(CHECKOUT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const out = await res.json().catch(() => ({}));
      console.log("Checkout response:", res.status, out);

      if (!res.ok) {
        throw new Error(out.error || `Checkout failed (HTTP ${res.status})`);
      }
      if (!out.url) {
        throw new Error("Checkout URL missing from server response.");
      }

      statusEl.textContent = "Redirecting to secure checkout...";
      window.location.href = out.url;
    } catch (err) {
      console.error(err);
      statusEl.textContent = `Error: ${err?.message || "Request failed"}`;
      isSubmitting = false;
      if (subscribeBtn) subscribeBtn.disabled = false;
    }
  });
});

