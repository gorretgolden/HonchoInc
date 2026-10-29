# HONCHO INC: Trader System Prototype

A clickable, white-label prototype for traders who import goods from China to Uganda.

**Live:** https://gorretgolden.github.io/HonchoInc/

## How to open

- **Quick view:** double-click `index.html`. It opens in any browser (Chrome works best) and runs offline. Only the fonts need internet.
- **For development:** the `source/` folder has the same app split into `index.html`, `styles.css` and `app.js`.

## Screens

| Screen | What it does |
|---|---|
| Today | Daily overview, route strip from China to your store, urgent actions |
| Shipments | 10-stage journey (sea via Mombasa and Malaba, or air via Entebbe), documents, deposit and balance |
| Goods matching | Count packages against the packing list, flag short, extra and damaged, write a claim in English or Chinese |
| Stock & costs | Stock levels, margins, days left, landed cost calculator with URA taxes, reorder back to China |
| Social & bookings | Upload a product photo, preview posts with your logo, inquiry inbox, bookings with deposits |
| Push & promos | Notifications, WhatsApp and SMS campaigns, audiences, scheduling, automations |
| My assistant | Daily brief, task timeline, quick add ("call supplier at 3pm"), money due, contacts |
| Brand & plan | Business name, logo upload, brand colour, connected channels, subscription plans |

Switch the **business type** at the top (Electronics, Fashion, Hardware, Beauty, Auto spares, Household) to load data for a different kind of trader.

## Notes

- All data is sample data. Phone numbers are placeholders.
- Tax rates and the exchange rate are editable examples. Confirm them with your clearing agent.
- Brand settings (name, logo, colour) are saved in the browser. Other data resets on reload.

## Suggested production stack

- Frontend: Next.js (web) and Flutter (mobile app)
- Backend: NestJS with PostgreSQL, one tenant per trader business
- Integrations: WhatsApp Business API, Meta Graph API (Instagram and Facebook), TikTok, Africa's Talking (SMS), Firebase Cloud Messaging (push), MTN MoMo and Airtel Money (deposits)
