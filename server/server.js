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

