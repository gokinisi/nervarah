import { sendSms as sendStub } from "./stub.js";
import { sendSms as sendVonage } from "./vonage.js";

export function getSmsSender() {
  const provider = (process.env.SMS_PROVIDER || "stub").toLowerCase();
  if (provider === "stub") return sendStub;
  if (provider === "vonage") return sendVonage;
  throw new Error(`Unsupported SMS_PROVIDER: ${provider}`);
}
