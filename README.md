# Web4U Marketing Website

Premium multi-page marketing website for a web design studio.

## Project Summary

This is a static website built with semantic HTML and modern CSS, focused on:

- Strong first impression and premium visual design
- Clear conversion paths to contact and consultation
- Mobile responsiveness and smooth UI interactions
- Basic SEO and social sharing readiness

## Pages

- `index.html` - Home (hero, services, featured work, testimonials, FAQ, CTA)
- `about.html` - Company profile and business details
- `services.html` - Service plans and pricing
- `process.html` - Delivery process
- `contact.html` - Project brief form (FormSubmit integration)
- `404.html` - Custom not-found page
- `thank-you.html` - Post-submission confirmation page

## Tech Stack

- HTML5
- CSS3 (custom properties, gradients, motion, responsive media queries)
- Vanilla JavaScript (`main.js`) for form UX enhancement

## Key Features

- Premium visual language: layered shadows, gradients, glass-style header
- Conversion-focused homepage sections: proof, testimonials, FAQ, final CTA
- WhatsApp and click-to-call actions
- Interview-friendly form UX:
  - Client-side phone validation
  - Submit button state change (`Sending...`)
  - Live status feedback
- Analytics-ready event tracking:
  - `call_click`
  - `whatsapp_click`
  - `form_submit`

## SEO and Deployment Readiness

- Open Graph + Twitter card tags
- Canonical tags
- `robots.txt`
- `sitemap.xml`
- Structured data (`ProfessionalService`) on home page
- Custom `favicon.svg`

Note:
- Replace `https://your-domain.com` values in `robots.txt`, `sitemap.xml`, and `site-config.js` when domain is finalized.

## Contact Form

The contact form posts to FormSubmit:

- Endpoint: `https://formsubmit.co/ashbinsanthosh65@gmail.com`
- No backend required for MVP
- Includes honeypot field for basic spam mitigation

## Analytics Setup (GA4)

Google Analytics is configured via `site-config.js` with placeholder ID `G-XXXXXXXXXX`.

To activate:

1. Create a GA4 property and get your Measurement ID.
2. Replace `G-XXXXXXXXXX` with your real ID in `site-config.js`.
3. Deploy and verify in GA dashboard:
   - `Reports -> Realtime`
   - `Reports -> Engagement -> Events`

## Localization

Business details are currently localized to:

- Perinthalmanna, Malappuram, Kerala, India
- IST timezone
- Indian phone and INR pricing format

## Run Locally

Open `index.html` directly in browser, or serve with any static server.

Example:

```bash
npx serve .
```

## Interview Talking Points

- Why static-first architecture was chosen
- How conversion flow was improved (hero -> proof -> CTA -> form)
- Balance between aesthetics and performance
- SEO baseline setup before real domain
- Progressive enhancement via small JS only where needed
