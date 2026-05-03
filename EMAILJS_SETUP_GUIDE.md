# EmailJS Setup Guide for ListedPEI

You have 2 templates. The lead template handles BOTH website mockup requests and grant quiz leads.

---

## Step 1: Confirm Your Service

Go to **Email > Services** in your EmailJS dashboard.

Make sure you have a service with this ID:
```
service_h4bsc9r
```

---

## Step 2: Template 1 — Kit Delivery (`template_htd2ktn`)

You already have this template. Confirm the settings match:

| Setting | Value |
|---------|-------|
| **Template ID** | `template_htd2ktn` |
| **Subject** | `{{business_name}} — Your ListedPEI Profile Kit` |
| **To** | `{{to_email}}` |
| **From Name** | `ListedPEI` |
| **Reply To** | `{{reply_to}}` |

**Body variables your template should reference:**
```
{{to_name}}, {{business_name}}, {{category}}, {{city}},
{{long_description}}, {{short_description}}, {{google_posts}},
{{review_positive}}, {{review_neutral}}, {{review_negative}},
{{faqs}}, {{keywords_primary}}, {{keywords_local}}, {{keywords_longtail}},
{{photo_tips}}, {{categories}}
```

---

## Step 3: Template 2 — Lead Capture (`template_0jbjlks`)

You already have this template. It now handles **both** website mockup requests AND grant quiz leads.

| Setting | Value |
|---------|-------|
| **Template ID** | `template_0jbjlks` |
| **Subject** | `🚀 New Lead: {{from_name}}` |
| **To** | `peiwebstudio@gmail.com` |
| **From Name** | `{{from_name}}` |
| **Reply To** | `{{reply_to}}` |

### Important: Make the body work for BOTH flows

Use EmailJS conditional syntax `{{#if variable}}` so empty fields are hidden.

**Paste this as your HTML body:**

```html
<h2>🚀 New Lead from ListedPEI</h2>

<h3>Contact</h3>
<p><strong>Name:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Reply To:</strong> {{reply_to}}</p>

{{#if business_name}}
<h3>Website Mockup Request</h3>
<p><strong>Business:</strong> {{business_name}}</p>
<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Website Status:</strong> {{website_status}}</p>
{{/if}}

{{#if business_type}}
<h3>Grant Quiz Results</h3>
<p><strong>Business Type:</strong> {{business_type}}</p>
<p><strong>Business Age:</strong> {{business_age}}</p>
<p><strong>Employees:</strong> {{employees}}</p>
<p><strong>Has Website:</strong> {{has_website}}</p>
<p><strong>Funding Goal:</strong> {{funding_goal}}</p>
<p><strong>Matched Grants:</strong> {{matched_grants}}</p>
{{/if}}

<h3>Message</h3>
<pre style="white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:8px;">{{message}}</pre>

<hr>
<p>Submitted via <a href="https://listedpei.ca">listedpei.ca</a></p>
```

**All variables this template should support:**
```
{{from_name}}, {{from_email}}, {{reply_to}},
{{business_name}}, {{phone}}, {{website_status}},
{{business_type}}, {{business_age}}, {{employees}},
{{has_website}}, {{funding_goal}}, {{matched_grants}},
{{message}}
```

> The `{{#if}}` blocks hide sections that don't have data. Website mockup emails show "Website Mockup Request" section. Grant quiz emails show "Grant Quiz Results" section.

---

## Step 4: Verify Your Public Key

Go to **Account > General**

Your Public Key should be:
```
IfHK4WEIzlYDYwDhi
```

---

## Step 5: Final `.env` Check

Your `.env` should look like this:

```env
VITE_EMAILJS_SERVICE_ID=service_h4bsc9r
VITE_EMAILJS_KIT_TEMPLATE_ID=template_htd2ktn
VITE_EMAILJS_LEAD_TEMPLATE_ID=template_0jbjlks
VITE_EMAILJS_PUBLIC_KEY=IfHK4WEIzlYDYwDhi
```

---

## Step 6: Test All 3 Flows

| Test | What to Do | Expected Result |
|------|-----------|----------------|
| **Kit Delivery** | Run through the form, enter your email on the results page | You receive an email with subject `Your Business — Your ListedPEI Profile Kit` |
| **Website Lead** | Check "I need a website" in Step 2, submit mockup form on results page | Email arrives at `peiwebstudio@gmail.com` with "Website Mockup Request" section filled |
| **Grant Lead** | Go to `/grants`, complete quiz, submit email | Email arrives at `peiwebstudio@gmail.com` with "Grant Quiz Results" section filled |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "EmailJS not configured" toast | Check `.env` values match your EmailJS dashboard exactly |
| Emails not arriving | Check spam folder; verify sender email is authenticated in EmailJS |
| Missing variables in email | Make sure template variable names match the code exactly (case-sensitive) |
| Template ID mismatch | Update `.env` to match the Template ID shown in EmailJS dashboard |
| Both sections showing in same email | Make sure you're using `{{#if variable_name}}...{{/if}}` syntax |
