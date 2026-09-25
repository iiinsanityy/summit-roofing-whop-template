# SUMMIT ROOFING CO. — Whop Website Template

Live: https://summit-roofing-co-9655.whop.site

Austin's Roof Done Right — Built on Whop Websites. Whop Payments Only.

## Features
- Services: Repair, Replacement, Inspection (SEO-tracked)
- 3 Plans: $149 Inspection, $500 Deposit (saves card off_session), $899 Emergency Tarping
- Whop Elements: Checkout + ExpressCheckoutElement (Apple Pay/Google Pay) + PaymentElement (Cards, Klarna, Afterpay, Affirm) + BrandingElement
- Financing bar auto-surfaces via Whop
- Service Area + Trust & Reviews
- Estimate form → whop.leads.create()
- Final balance → whop.invoices.create() with payment_method_id: pm_xxx off_session

## Stack
- Whop Websites (TanStack Start + React)
- @whop/elements-react + @whop/elements
- Tailwind-style inline (no build deps)

## Quick Start
```bash
# create whop app
whop apps create summit-roofing

# replace src/routes/index.tsx with this repo's src/routes/index.tsx
cp src/routes/index.tsx ~/summit-roofing-co/summit-roofing-co-9655/src/routes/index.tsx

cd ~/summit-roofing-co/summit-roofing-co-9655
rm -rf src/routes/api .tanstack dist
whop apps deploy
```

## API Mocks (for hackathon demo without backend keys)
- Leads: console.log('[whop.leads.create]', data) + track estimate_requested
- Invoices: console.log('[whop.invoices.create]', {payment_method_id: pm_xxx, amount: 750000}) + off_session charge
- Tracking: whop.track page_view, service_viewed, deposit_started, checkout_completed

In production with real Whop keys, replace mocks with:
```ts
await fetch('/api/leads', {method:'POST', body: JSON.stringify(data)})
await fetch('/api/invoices', {method:'POST', body: JSON.stringify({payment_method_id, amount})})
```

## Config
Swap COMPANY object for any roofing company - no structural changes needed.

## License
MIT - Reusable template
