const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const TEMPLATE_FIELDS = {
  kit: new Set([
    "to_email", "to_name", "from_name", "reply_to", "business_name", "category", "city",
    "long_description", "short_description", "google_posts", "review_positive", "review_neutral",
    "review_negative", "faqs", "grant_results", "grant_details", "keywords_primary",
    "keywords_local", "keywords_longtail", "photo_tips", "categories",
  ]),
  lead: new Set([
    "to_email", "from_name", "from_email", "reply_to", "business_name", "phone",
    "website_status", "business_type", "business_age", "employees", "has_website",
    "funding_goal", "matched_grants", "message",
  ]),
};

function getConfig() {
  return {
    serviceId: process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID,
    publicKey: process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
    kitTemplateId: process.env.EMAILJS_KIT_TEMPLATE_ID || process.env.VITE_EMAILJS_KIT_TEMPLATE_ID,
    leadTemplateId: process.env.EMAILJS_LEAD_TEMPLATE_ID || process.env.VITE_EMAILJS_LEAD_TEMPLATE_ID,
    supportEmail: process.env.SUPPORT_EMAIL || "peiwebstudio@gmail.com",
  };
}

export function isValidEmail(value) {
  return /^\S+@\S+\.\S+$/.test(String(value || "").trim());
}

function cleanParams(kind, params) {
  const allowed = TEMPLATE_FIELDS[kind];
  const cleaned = {};
  let totalLength = 0;

  for (const [key, value] of Object.entries(params || {})) {
    if (!allowed.has(key)) continue;
    const text = String(value ?? "").replace(/\0/g, "").slice(0, 12_000);
    totalLength += text.length;
    if (totalLength > 60_000) throw new Error("Email content is too large.");
    cleaned[key] = text;
  }
  return cleaned;
}

export function emailConfigStatus() {
  const config = getConfig();
  return {
    configured: Boolean(config.serviceId && config.publicKey && config.kitTemplateId && config.leadTemplateId),
    kitConfigured: Boolean(config.serviceId && config.publicKey && config.kitTemplateId),
    leadConfigured: Boolean(config.serviceId && config.publicKey && config.leadTemplateId),
  };
}

export async function sendTemplateEmail(kind, params) {
  if (!TEMPLATE_FIELDS[kind]) throw new Error("Unsupported email type.");
  const config = getConfig();
  const templateId = kind === "kit" ? config.kitTemplateId : config.leadTemplateId;
  if (!config.serviceId || !config.publicKey || !templateId) {
    const error = new Error("Email delivery is not configured yet.");
    error.statusCode = 503;
    throw error;
  }

  const templateParams = cleanParams(kind, params);
  if (kind === "lead") templateParams.to_email = config.supportEmail;
  if (!isValidEmail(templateParams.to_email)) {
    const error = new Error("Enter a valid email address.");
    error.statusCode = 400;
    throw error;
  }

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: templateId,
      user_id: config.publicKey,
      ...(config.privateKey ? { accessToken: config.privateKey } : {}),
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    console.error(`EmailJS delivery failed (${response.status}):`, detail);
    const error = new Error("Email delivery failed. Please try again.");
    error.statusCode = 502;
    throw error;
  }

  return { success: true };
}
