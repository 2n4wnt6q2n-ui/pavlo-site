# Project Conversation Notes — September 8, 2026

Saved from voice session so we can pick up after lunch.

## PAVLO pet shop (pavlo-site)
- Repo is healthy: code, data/site.json, and config are all on main.
- Live deployment at pavlo-site.vercel.app is down — returns DEPLOYMENT_NOT_FOUND 404. Needs reconnecting the Vercel account or a fresh deploy.
- The temporary-prompt-monsoon preview is the one currently serving. Checkout is explicitly off in site.json, so the shop is a preview catalog with no real stock or purchases — that's why products read as unavailable.
- Products live in CJ Dropshipping and other dropshippers; stock isn't available right now and Stripe wasn't understood/connected yet.
- Decision: PAVLO Projects is being shut down soon because it was no longer handled correctly. No need to fix Stripe if we're pulling the plug — just shut it down cleanly and stop paying for a dead store.
- If we do try Stripe later: use the native Vercel Marketplace integration (no manual key copying). Add Stripe under the project Integrations, link sandbox or existing account, it provisions env vars automatically. Then add products/prices in Stripe and wire the site's checkout route to create a Checkout Session. Connecting Stripe alone won't make buttons work if the checkout route isn't coded.
- Tutorials to self-serve:
  - Official: https://vercel.com/kb/guide/how-to-deploy-a-next-js-online-store-with-stripe
  - Video: search YouTube for "FinOps x AI Stripe Project step-by-step" by NextWork (~17 min).

## Northline Studio / Hold Fast Designs
- Site is built and in the repo (index, services, contact, request pages). Lead-gen automation has never run — zero leads, no drafts sent. Next scheduled run is October 31; emails held until the designer page launches.
- Domain bought: holdfastdesigns (US-only operation).
- Conflict check: Hold Fast Designs is an active Australian timber furniture maker (holdfastdesigns.com.au, Sunshine Coast) — custom tables, vanities, benchtops from reclaimed hardwood. Same name, same design space.
- Owning the .com doesn't settle it; .com.au + Instagram give them the stronger claim if we target Australia. US-only with clear branding = low risk. Recommended: trademark search before investing more in the name. Bing Webmaster Tools registration is fine for indexing but doesn't protect the name.
- Currently one service active; the other is being shut down.

## Open items to continue
- Reconnect Vercel or redeploy pavlo-site, or formally retire it.
- Decide final call on PAVLO shutdown vs. Stripe fix.
- Trademark search on Hold Fast Designs for US use.
- Launch the designer page so the Northline lead automation can start running.
