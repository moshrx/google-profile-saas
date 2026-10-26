async function sendEmail(type, params) {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, params }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Email delivery failed. Please try again.");
  return payload;
}

export function sendKitEmail(params) {
  return sendEmail("kit", params);
}

export function sendLeadEmail(params) {
  return sendEmail("lead", params);
}
