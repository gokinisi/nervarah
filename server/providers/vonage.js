const apiKey = process.env.VONAGE_API_KEY;
const apiSecret = process.env.VONAGE_API_SECRET;
const from = process.env.VONAGE_FROM || "Nervarah";

export async function sendSms({ to, body }) {
  const cleanTo = String(to || "").trim();
  const text = String(body || "").trim();

  if (!apiKey || !apiSecret) throw new Error("Missing VONAGE_API_KEY / VONAGE_API_SECRET.");
  if (!cleanTo) throw new Error("Missing destination phone number.");
  if (!text) throw new Error("Missing SMS body text.");

  const params = new URLSearchParams({
    api_key: apiKey,
    api_secret: apiSecret,
    to: cleanTo,
    from,
    text
  });

  const resp = await fetch("https://rest.nexmo.com/sms/json", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });

  const data = await resp.json();
  const msg = data?.messages?.[0];
  const status = msg?.status; // "0" = success

  if (status !== "0") {
    const errText = msg?.["error-text"] || "Vonage SMS failed";
    throw new Error(`Vonage SMS failed (status=${status}): ${errText}`);
  }

  return { ok: true, provider: "vonage", messageId: msg?.["message-id"] };
}
