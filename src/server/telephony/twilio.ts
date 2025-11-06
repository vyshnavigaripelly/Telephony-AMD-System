import Twilio from "twilio";

let cachedClient: Twilio | null = null;

export function createTwilioClient() {
  if (cachedClient) return cachedClient;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set");
  }

  cachedClient = Twilio(accountSid, authToken, {
    lazyLoading: true
  });

  return cachedClient;
}
