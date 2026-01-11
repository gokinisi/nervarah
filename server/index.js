import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getSmsSender } from "./providers/index.js";
import { appendJson, nowIso } from "./storage.js";

dotenv.config({ path: new URL("./.env", import.meta.url).pathname });

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://nervarah.com"],
  methods: ["GET", "POST"],
}));

app.use(express.json());
app.get("/debug-env", (req, res) => {
  res.json({
    smsProvider: process.env.SMS_PROVIDER || null,
    hasVonageKey: Boolean(process.env.VONAGE_API_KEY),
    hasVonageSecret: Boolean(process.env.VONAGE_API_SECRET),
    from: process.env.VONAGE_FROM || null,
  });
});



const PORT = Number(process.env.PORT || 4242);
const sendSms = getSmsSender();

function normalizePhone(p) {
  return String(p || "").trim();
}

app.get("/health", (req, res) => {
  res.json({ ok: true, provider: process.env.SMS_PROVIDER || "stub" });
});

app.post("/api/sms-signup", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      ndaAgree,
      smsConsent,
      ndaVersion,
      pageUrl,
      userAgent
    } = req.body || {};

    const to = normalizePhone(phone);

    if (!to) return res.status(400).json({ ok: false, error: "Phone is required." });
    if (smsConsent !== "YES") return res.status(400).json({ ok: false, error: "SMS consent is required." });
    if (ndaAgree !== "YES") return res.status(400).json({ ok: false, error: "NDA acceptance is required." });

    const subscriber = {
      id: `sub_${Date.now()}`,
      createdAt: nowIso(),
      fullName: fullName || "",
      email: email || "",
      phone: to,
      status: "ACTIVE",
      consent: {
        smsConsent,
        ndaAgree,
        ndaVersion: ndaVersion || "",
        pageUrl: pageUrl || "",
        userAgent: userAgent || ""
      }
    };

    await appendJson("subscribers.json", subscriber);

    await sendSms({
      to,
      body: "Nervarah: You’re subscribed to daily texts. Reply STOP to unsubscribe, HELP for help."
    });

    res.json({ ok: true, provider: process.env.SMS_PROVIDER || "stub" });
  } catch (err) {
    console.error("❌ signup error:", err);
    res.status(500).json({ ok: false, error: err?.message || "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Nervarah server running on http://localhost:${PORT} (provider=${process.env.SMS_PROVIDER || "stub"})`);
});



