// scripts/payment.js
document.getElementById('payButton').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;

  if (!name || !phone || !email) {
    alert('Please fill in all fields.');
    return;
  }

  const response = await fetch('https://your-backend.onrender.com/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, email })
  });

  const data = await response.json();
  if (data.checkoutUrl) {
    window.location.href = data.checkoutUrl;
  } else {
    alert('Error starting payment, please try again.');
  }
});
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import twilio from "twilio";document.getElementById('payButton').addEventListener('click', () => {
  alert('Payment button clicked!');
});


dotenv.config();
const app = express();
app.use(bodyParser.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const headers = {
  "Square-Version": "2024-08-15",
  "Authorization": `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
  "Content-Type": "application/json"
};

// 1️⃣ Create Square Checkout Link
app.post("/create-checkout", async (req, res) => {
  const { name, phone, email } = req.body;
  try {
    const body = {
      idempotency_key: Date.now().toString(),
      order: {
        location_id: process.env.SQUARE_LOCATION_ID,
        line_items: [
          {
            name: "Motivational Text Membership",
            quantity: "1",
            base_price_money: { amount: 899, currency: "USD" }
          }
        ]
      },
      redirect_url: "https://nervarah.com/success.html"
    };

    const response = await fetch(`https://connect.squareup.com/v2/checkout`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    const result = await response.json();
    res.json({ checkoutUrl: result.checkout.checkout_page_url, name, phone, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Square checkout creation failed" });
  }
});

// 2️⃣ Webhook Endpoint: Payment Success → Send Twilio Text
app.post("/payment-success", async (req, res) => {
  const { phone, name } = req.body;
  try {
    await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
      body: `Hi ${name}! 🌞 Welcome to Nervarah Motivation — your first message arrives tomorrow morning.`
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send Twilio message" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import twilio from "twilio";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const headers = {
  "Square-Version": "2024-08-15",
  "Authorization": `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
  "Content-Type": "application/json"
};

// 1️⃣ Create Square Checkout Link
app.post("/create-checkout", async (req, res) => {
  const { name, phone, email } = req.body;
  try {
    const body = {
      idempotency_key: Date.now().toString(),
      order: {
        location_id: process.env.SQUARE_LOCATION_ID,
        line_items: [
          {
            name: "Motivational Text Membership",
            quantity: "1",
            base_price_money: { amount: 899, currency: "USD" }
          }
        ]
      },
      redirect_url: "https://nervarah.com/success.html"
    };

    const response = await fetch(`https://connect.squareup.com/v2/checkout`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    const result = await response.json();
    res.json({ checkoutUrl: result.checkout.checkout_page_url, name, phone, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Square checkout creation failed" });
  }
});

// 2️⃣ Webhook Endpoint: Payment Success → Send Twilio Text
app.post("/payment-success", async (req, res) => {
  const { phone, name } = req.body;
  try {
    await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
      body: `Hi ${name}! 🌞 Welcome to Nervarah Motivation — your first message arrives tomorrow morning.`
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send Twilio message" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { Vonage } from '@vonage/server-sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (frontend)
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Vonage
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

// Signup route
app.post('/signup', async (req, res) => {
  const { name, phone, motivation } = req.body;
  console.log(`📝 New signup: ${name}, ${phone}, ${motivation}`);

  let messageText = '';

  if (motivation === 'fitness') {
    messageText = `💪 ${name}, your Nervara journey begins! Small moves, big shifts — consistency builds power.`;
  } else if (motivation === 'mindset') {
    messageText = `🌞 ${name}, your thoughts shape your world. Speak to yourself with love today.`;
  } else if (motivation === 'love') {
    messageText = `💖 ${name}, radiate kindness — every small act opens your heart to more love.`;
  } else {
    messageText = `✨ ${name}, welcome to Nervara! Transformation starts one breath, one choice at a time.`;
  }

  try {
    const response = await vonage.sms.send({
      to: phone,
      from: process.env.VONAGE_NUMBER,
      text: messageText,
      type: 'unicode',
    });

    console.log('✅ SMS sent:', response);
    res.send(`✨ Nice! You’re signed up, ${name}! Your first motivational text is on its way.`);
  } catch (error) {
    console.error('❌ Error sending SMS:', error);
    res.status(500).send('Something went wrong sending your text. Check your Vonage credentials.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
import express from "express";
import twilio from "twilio";

const app = express();
app.use(express.json());

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_MESSAGING_SERVICE_SID
} = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function normalizePhone(p) {
  // Minimal normalization; you can strengthen later
  return (p || "").trim();
}

app.post("/api/sms-signup", async (req, res) => {
  try {
    const { fullName, email, phone, smsConsent, pageUrl } = req.body || {};

    if (!phone) return res.status(400).json({ ok: false, error: "Phone is required" });
    if (smsConsent !== "YES") return res.status(400).json({ ok: false, error: "SMS consent is required" });

    const to = normalizePhone(phone);

    // 1) Persist consent (Sheets/DB) BEFORE messaging (recommended)
    // TODO: write to Google Sheets / database with timestamp, pageUrl, etc.

    // 2) Send confirmation/welcome SMS
    await client.messages.create({
      messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID,
      to,
      body:
        "Nervarah: You’re subscribed to daily texts. Msg&data rates may apply. Reply STOP to unsubscribe, HELP for help.",
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});
export async function sendSmsStub({ to, body }) {
  console.log("STUB SMS (not sent):", { to, body });
  return { ok: true, provider: "stub" };
}


app.listen(3000, () => console.log("Server running on :3000"));

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");

    const expected = PropertiesService.getScriptProperties().getProperty("SIGNUP_TOKEN") || "";
    if (expected && body.token !== expected) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Unauthorized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Signups") || ss.getSheets()[0];

    sheet.appendRow([
      new Date().toISOString(),
      body.fullName || "",
      body.email || "",
      body.phone || "",
      body.ndaAgree || "",
      body.smsConsent || "",
      body.ndaVersion || "",
      body.pageUrl || "",
      body.userAgent || "",
      body.provider || "",
      body.notes || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}






























