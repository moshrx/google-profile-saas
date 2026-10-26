function stripStars(value) {
  return typeof value === "string" ? value.replace(/\*\*/g, "") : value;
}

function truncate(value, maximum) {
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length <= maximum) return text;
  const sentenceEnd = text.lastIndexOf(". ", maximum - 3);
  return sentenceEnd > maximum * 0.7 ? text.slice(0, sentenceEnd + 1) : `${text.slice(0, maximum - 3)}...`;
}

export async function generateProfile(formData) {
  const response = await fetch("/api/generate-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Failed to generate profile.");

  return {
    longDescription: truncate(stripStars(payload.longDescription), 750) || "Description not available.",
    shortDescription: truncate(stripStars(payload.shortDescription), 250) || "Short description not available.",
    googlePosts: Array.isArray(payload.googlePosts) ? payload.googlePosts.map(stripStars) : [],
    reviewResponses: {
      positive: stripStars(payload.reviewResponses?.positive) || "",
      neutral: stripStars(payload.reviewResponses?.neutral) || "",
      negative: stripStars(payload.reviewResponses?.negative) || "",
    },
    categories: Array.isArray(payload.categories) ? payload.categories : [],
    faqs: Array.isArray(payload.faqs) ? payload.faqs.map((item) => ({ q: stripStars(item.q), a: stripStars(item.a) })) : [],
    photoTips: Array.isArray(payload.photoTips) ? payload.photoTips.map(stripStars) : [],
    competitorKeywords: payload.competitorKeywords || { primary: [], local: [], longTail: [] },
  };
}
