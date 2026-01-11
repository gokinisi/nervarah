// js/form.js
const positiveMindBtn = document.getElementById("positiveMindBtn");
const trackInput = document.getElementById("track");

if (positiveMindBtn) {
  positiveMindBtn.addEventListener("click", () => {
    // Set the selected track
    if (trackInput) {
      trackInput.value = "practice_positive_mindset";
    }

    // OPTIONAL: store locally in case you want it post-checkout
    localStorage.setItem("nervarah_track", "practice_positive_mindset");

    // Redirect to Stripe Payment Link
    window.location.href =
      "https://buy.stripe.com/test_14AeVfgtA0LefrPfOB77O00";
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const statusEl = document.getElementById("signupStatus");
  const subscribeBtn = document.getElementById("subscribeBtn");


// Track selection buttons
const trackButtons = document.querySelectorAll(".track-btn");
const trackInput = document.getElementById("track");
const selectedTrackText = document.getElementById("selectedTrackText");

trackButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // UI: mark selected
    trackButtons.forEach((b) => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");

    // Data: set hidden input
    const track = btn.getAttribute("data-track") || "";
    if (trackInput) trackInput.value = track;

    // UI: show selection
    const label = btn.textContent.trim();
    if (selectedTrackText) selectedTrackText.textContent = `Selected: ${label}`;

    // Move user to signup form
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
  
if (!form) {
    console.error("Form not found: #signupForm");
    return;
  }
  if (!statusEl) {
    console.error("Status element not found: #signupStatus");
    return;
  }

  const sheetsUrl = form.dataset.sheetsUrl || "";
  const sheetsToken = form.dataset.sheetsToken || "";
  const stripeUrl = form.dataset.stripeUrl || "";

  let isSubmitting = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;

    statusEl.textContent = "Submitting...";
    if (subscribeBtn) subscribeBtn.disabled = true;

    const fullName = String(document.getElementById("name")?.value || "").trim();
    const phone = String(document.getElementById("phone")?.value || "").trim();
    const email = String(document.getElementById("email")?.value || "").trim();
    const focus = String(document.getElementById("focus")?.value || "").trim();

    if (fullName.length < 2) {
      statusEl.textContent = "Please enter your name.";
      isSubmitting = false;
      if (subscribeBtn) subscribeBtn.disabled = false;
      return;
    }
    if (!email.includes("@")) {
      statusEl.textContent = "Please enter a valid email.";
      isSubmitting = false;
      if (subscribeBtn) subscribeBtn.disabled = false;
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      statusEl.textContent = "Please enter a valid phone number.";
      isSubmitting = false;
      if (subscribeBtn) subscribeBtn.disabled = false;
      return;
    }

    if (!sheetsUrl) {
      statusEl.textContent = "Signup service is not configured.";
      isSubmitting = false;
      if (subscribeBtn) subscribeBtn.disabled = false;
      return;
    }

    try {
      const payload = {
        token: sheetsToken,
        fullName,
        email,
        phone,
        focus,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch(sheetsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let out = {};
      try {
        out = JSON.parse(text);
      } catch (err) {
        out = { message: text };
      }

      if (!res.ok) {
        throw new Error(out.error || `Signup failed (HTTP ${res.status})`);
      }

      statusEl.textContent = stripeUrl
        ? "Saved. Redirecting to checkout..."
        : "Saved. Thanks for signing up.";

      if (stripeUrl) {
        window.location.href = stripeUrl;
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = `Error: ${err?.message || "Request failed"}`;
      isSubmitting = false;
      if (subscribeBtn) subscribeBtn.disabled = false;
    }
  });
});
