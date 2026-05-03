# EmailJS Template Debug — Variables Showing Blank

## Most Common Cause

**The variable names in your EmailJS template don't EXACTLY match what the code sends.**

EmailJS is case-sensitive. `{{business_name}}` is NOT the same as `{{businessName}}` or `{{Business Name}}`.

---

## Step 1: Check Your Template Variable Names

In your EmailJS dashboard, go to **Email > Templates > template_htd2ktn > Edit**.

Look at the **Subject** and **Body**. Every `{{...}}` must match this list exactly:

### Kit Template (`template_htd2ktn`) — Variables the code sends:
```
{{to_email}}
{{to_name}}
{{from_name}}
{{reply_to}}
{{business_name}}
{{category}}
{{city}}
{{long_description}}
{{short_description}}
{{google_posts}}
{{review_positive}}
{{review_neutral}}
{{review_negative}}
{{faqs}}
{{keywords_primary}}
{{keywords_local}}
{{keywords_longtail}}
{{photo_tips}}
{{categories}}
```

### Lead Template (`template_0jbjlks`) — Variables the code sends:
```
{{to_email}}
{{from_name}}
{{from_email}}
{{reply_to}}
{{business_name}}
{{phone}}
{{website_status}}
{{message}}
{{business_type}}
{{business_age}}
{{employees}}
{{has_website}}
{{funding_goal}}
{{matched_grants}}
```

**Any mismatch = blank output.**

---

## Step 2: Use This Bulletproof Test Body

Replace your template body with this plain text version (no HTML, no conditionals):

### For Kit Template (`template_htd2ktn`):

```
Hi {{to_name}},

Business: {{business_name}}
Category: {{category}}
City: {{city}}

LONG DESCRIPTION:
{{long_description}}

SHORT DESCRIPTION:
{{short_description}}

GOOGLE POSTS:
{{google_posts}}

REVIEWS:
Positive: {{review_positive}}
Neutral: {{review_neutral}}
Negative: {{review_negative}}

FAQs:
{{faqs}}

KEYWORDS:
Primary: {{keywords_primary}}
Local: {{keywords_local}}
Long-tail: {{keywords_longtail}}

PHOTO TIPS:
{{photo_tips}}

CATEGORIES:
{{categories}}
```

### For Lead Template (`template_0jbjlks`):

```
New Lead from ListedPEI

Name: {{from_name}}
Email: {{from_email}}
Reply To: {{reply_to}}

Website Mockup Info:
Business: {{business_name}}
Phone: {{phone}}
Website Status: {{website_status}}

Grant Quiz Info:
Business Type: {{business_type}}
Business Age: {{business_age}}
Employees: {{employees}}
Has Website: {{has_website}}
Funding Goal: {{funding_goal}}
Matched Grants: {{matched_grants}}

Message:
{{message}}
```

**Copy-paste EXACTLY.** Don't add spaces inside `{{ }}`. Don't change underscores to dashes.

---

## Step 3: Check Browser Console for Errors

1. Open your site
2. Open browser DevTools (F12) → **Console** tab
3. Submit the form
4. Look for red errors like:
   - `"EmailJS Error: ..."`
   - `"template_xxx not found"`
   - `"public key invalid"`

Screenshot any errors and send them.

---

## Step 4: Verify Template ID Match

Make 100% sure your `.env` matches your EmailJS dashboard:

```env
VITE_EMAILJS_SERVICE_ID=service_h4bsc9r
VITE_EMAILJS_KIT_TEMPLATE_ID=template_htd2ktn
VITE_EMAILJS_LEAD_TEMPLATE_ID=template_0jbjlks
VITE_EMAILJS_PUBLIC_KEY=IfHK4WEIzlYDYwDhi
```

Go to **Email > Templates** in EmailJS. The Template ID is shown in the list. It must match `.env` exactly.

---

## Quick Test

If you want to test if EmailJS itself is working, paste this in your browser console (on your site):

```js
emailjs.send("service_h4bsc9r", "template_htd2ktn", {
  to_email: "your-email@example.com",
  to_name: "Test",
  business_name: "Test Business",
  category: "Restaurant",
  city: "Charlottetown",
  long_description: "This is a test",
  short_description: "Short test",
  google_posts: "Post 1\nPost 2",
  review_positive: "Thanks!",
  review_neutral: "Thanks for feedback",
  review_negative: "We're sorry",
  faqs: "Q: Test? A: Yes",
  keywords_primary: "test",
  keywords_local: "test pei",
  keywords_longtail: "test in charlottetown",
  photo_tips: "Tip 1",
  categories: "Restaurant"
}, "IfHK4WEIzlYDYwDhi").then(() => console.log("Sent!")).catch(e => console.error(e));
```

Replace `your-email@example.com` with your real email. If you get the email with all fields filled, EmailJS is working.
