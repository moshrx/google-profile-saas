import { jsPDF } from "jspdf";

/**
 * Enhanced PDF Export with Keywords & Photo Tips (Feature 2 & 3)
 */
export function exportPDF(result, formData) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const PAGE_W = doc.internal.pageSize.getWidth();
  const PAGE_H = doc.internal.pageSize.getHeight();
  const MARGIN = 48;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  let y = MARGIN;

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function checkPageBreak(neededHeight = 40) {
    if (y + neededHeight > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function drawLine() {
    checkPageBreak(10);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 16;
  }

  function addText(text, opts = {}) {
    const {
      fontSize = 10,
      color = [30, 41, 59],
      bold = false,
      indent = 0,
      maxWidth = CONTENT_W,
    } = opts;

    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    doc.setFont("helvetica", bold ? "bold" : "normal");

    const lines = doc.splitTextToSize(text, maxWidth - indent);
    const lineHeight = fontSize * 1.5;

    checkPageBreak(lines.length * lineHeight + 8);
    doc.text(lines, MARGIN + indent, y);
    y += lines.length * lineHeight + 4;
  }

  function addSectionHeader(title) {
    checkPageBreak(48);
    y += 12;
    doc.setFillColor(22, 163, 74);
    doc.roundedRect(MARGIN, y, 4, 20, 2, 2, "F");
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text(title, MARGIN + 12, y + 14);
    y += 36;
  }

  function addLabel(label) {
    addText(label, { fontSize: 9, color: [100, 116, 139], bold: true });
  }

  // ── Header Banner ────────────────────────────────────────────────────────────
  doc.setFillColor(21, 128, 61);
  doc.rect(0, 0, PAGE_W, 100, "F");
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Your Google Business Profile Kit", MARGIN, 44);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(`${formData.businessName} · ${formData.city}, PEI`, MARGIN, 66);
  y = 120;

  // ── Details ─────────────────────────────────────────────────────────────────
  addSectionHeader("Business Details");
  const details = [
    ["Business Name", formData.businessName],
    ["Category", formData.category],
    ["Location", `${formData.city}, PEI, Canada`],
    ["Website", formData.website || "—"],
    ["Social Media", formData.socialLinks || "—"],
  ];
  for (const [label, value] of details) {
    addText(`${label}:  ${value}`, { fontSize: 10, indent: 4 });
  }
  drawLine();

  // ── Keywords (Feature 3) ─────────────────────────────────────────────────────
  addSectionHeader("Target Keywords (Local SEO Strategy)");
  const k = result.competitorKeywords;
  addLabel("PRIMARY KEYWORDS");
  addText(k.primary.join(", "), { fontSize: 10, indent: 4 });
  y += 4;
  addLabel("LOCAL KEYWORDS");
  addText(k.local.join(", "), { fontSize: 10, indent: 4 });
  y += 4;
  addLabel("LONG-TAIL KEYWORDS");
  addText(k.longTail.join(", "), { fontSize: 10, indent: 4 });
  drawLine();

  // ── Descriptions ────────────────────────────────────────────────────────────
  addSectionHeader("Google Profile Descriptions");
  addLabel("LONG DESCRIPTION (Up to 750 chars)");
  addText(result.longDescription, { fontSize: 10, indent: 4 });
  y += 8;
  addLabel("SHORT DESCRIPTION (Up to 250 chars)");
  addText(result.shortDescription, { fontSize: 10, indent: 4 });
  drawLine();

  // ── Photo Tips (Feature 2) ───────────────────────────────────────────────────
  addSectionHeader("Photo Strategy & Tips");
  (result.photoTips || []).forEach((tip, i) => {
    addText(`Tip ${i + 1}: ${tip}`, { fontSize: 10, indent: 8 });
    y += 4;
  });
  drawLine();

  // ── Google Posts ────────────────────────────────────────────────────────────
  addSectionHeader("Google Posts (Ready-to-Publish)");
  result.googlePosts.forEach((post, i) => {
    addLabel(`GOOGLE POST ${i + 1}`);
    addText(post, { fontSize: 9, indent: 4 });
    y += 8;
  });
  drawLine();

  // ── Reviews ─────────────────────────────────────────────────────────────────
  addSectionHeader("Review Response Templates");
  addLabel("POSITIVE RESPONSE (5-Star)");
  addText(result.reviewResponses.positive, { fontSize: 10, indent: 4 });
  y += 8;
  addLabel("NEUTRAL RESPONSE (3-Star)");
  addText(result.reviewResponses.neutral, { fontSize: 10, indent: 4 });
  y += 8;
  addLabel("NEGATIVE RESPONSE (1-Star)");
  addText(result.reviewResponses.negative, { fontSize: 10, indent: 4 });
  drawLine();

  // ── FAQs ────────────────────────────────────────────────────────────────────
  addSectionHeader("Common Profile FAQs");
  (result.faqs || []).forEach((faq, i) => {
    addLabel(`Q&A PAIR ${i + 1}`);
    addText(`Question: ${faq.q}`, { fontSize: 10, indent: 8, bold: true });
    addText(`Answer: ${faq.a}`, { fontSize: 10, indent: 12 });
    y += 12;
  });

  // ── Categories ───────────────────────────────────────────────────────────────
  drawLine();
  addSectionHeader("Suggested Categories");
  result.categories.forEach((cat, i) => {
    const prefix = i === 0 ? "PRIMARY CATEGORY:" : "SECONDARY CATEGORY:";
    addText(`${prefix}  ${cat}`, { fontSize: 10, indent: 4 });
    y += 4;
  });

  // ── Page Info ───────────────────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`ListedPEI · Generated for ${formData.businessName} · Page ${p} of ${totalPages}`, PAGE_W / 2, PAGE_H - 20, { align: "center" });
  }

  const safeName = formData.businessName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`listedpei_kit_${safeName}.pdf`);
}
