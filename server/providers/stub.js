export async function sendSms({ to, body }) {
  console.log("🟡 STUB SMS (not sent):", { to, body });
  return { provider: "stub", to, queued: true };
}
