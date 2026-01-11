import express from "express";
import bodyParser from "body-parser";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const stripe = new Stripe(process.envsk_test_51SOeDVQfuXXaj6J5vbJvZoL0yLcESKq1Gr9JacfTkFKVB93TBAv1wTbfGtlu0bnvYjNOtv1zhQpsaXKxoaeC62og00nXbWfb69);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Iris Motivational Texts",
              description: "Daily Nervarah affirmations for energy, purpose & focus.",
            },
            unit_amount: 899, // $8.99 in cents
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: "https://nervarah.com/?success=true",
      cancel_url: "https://nervarah.com/?canceled=true",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Stripe server running on port 3000");
});
import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.static("public"));
app.use(express.json());

// Route for checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Nervarah Beta Membership",
              description: "Discounted beta user rate for early access to Nervarah app.",
            },
            unit_amount: 4900, // $49.00 (in cents)
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success.html",
      cancel_url: "http://localhost:3000/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => console.log("Server running on http://localhost:4242"));
// server/server.js — Nervarah Beta Payment Setup
import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.static("public"));
app.use(express.json());

// Create Stripe Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Nervarah Beta Access",
              description:
                "Discounted beta membership for early users of the Nervarah platform.",
            },
            unit_amount: 4900, // $49.00 USD
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success.html",
      cancel_url: "http://localhost:3000/cancel.html",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
import { sendSmsStub } from "./smsStub.js";
// Later: import { sendSmsTelnyx } from "./smsTelnyx.js" etc.

export function getMessenger() {
  const provider = (process.env.SMS_PROVIDER || "stub").toLowerCase();

  if (provider === "stub") {
    return async ({ to, body }) => sendSmsStub({ to, body });
  }

  // Example placeholder for later:
  // if (provider === "telnyx") return async ({to, body}) => sendSmsTelnyx({to, body});

  throw new Error(`Unsupported SMS_PROVIDER: ${provider}`);
}
import { getMessenger } from "./providers/index.js";

const sendMessage = getMessenger();

app.post("/api/sms-signup", async (req, res) => {
  // validate, store consent...
  // Instead of Twilio:
  await sendMessage({ to: req.body.phone, body: "Welcome to Nervarah daily texts." });

  res.json({ ok: true, note: "Queued (stub provider). Will deliver when SMS is enabled." });
});



app.listen(4242, () => console.log("✅ Server running on http://localhost:4242"));
app.post("/api/sms-signup", async (req, res) => {

