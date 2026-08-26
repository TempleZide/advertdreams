# Competitive Landscape: Who Already Sells This Bundle, and at What Price

Research for [#25](https://github.com/TempleZide/advertdreams/issues/25). Every price verified **2026-08-24** against a live page or a regulatory filing unless marked otherwise. Markers used throughout: `[P]` vendor or regulator primary source, `[B]` published benchmark, `[3P]` third-party estimate, **UNVERIFIED** where a claim could not be confirmed and is stated rather than guessed.

---

## Answer

**The gap is a price gap, not a feature gap, and the price gap is brutal.** The full bundle already exists and its floor is **$600–$800 per month before ad spend**. Meanwhile **52% of US small businesses have a total monthly marketing budget under $1,000, and businesses with ten or fewer employees are 55% more likely to be under $500** — and that figure includes their ad spend. The incumbent bundle costs more than the customer's entire budget, which is why **only 34% of SMBs now work with any marketing partner, down from 60% the year before**.

Four findings bear directly on decisions this map has already taken.

**1. advertdreams has to land at roughly $99–$249 per month all-in excluding spend**, which means effectively zero human touch per customer. Any design that assumes a human reviews creative, tunes campaigns, or onboards a customer is priced out of its own market before it starts.

**2. Every layer of the bundle is already at or near zero margin except one: the account and billing plumbing.** The website is $10–$18/mo. AI ad creative is free — Meta's, TikTok's, and Canva's free tier all do it. Publishing and optimisation is $14–$99/mo. Of roughly twenty ad tools examined, **essentially none handle the ad account or payment plumbing on the customer's behalf**; they all say "connect your existing ad account", which is precisely the step a mom-and-pop cannot do. That plumbing is the only defensible piece, and also the piece with the most platform-policy risk.

**3. TikTok is programmatically easier than Meta, and Meta is the half that matters.** TikTok has a real ad-account creation endpoint available in the US. Meta caps API ad account creation at five, and the scaled path — 2-Tier Business Manager — is gated behind a Meta representative. The Meta half of advertdreams is gated on a business-development conversation, not on writing code.

**4. TikTok is the wrong second channel for these two verticals in 2026.** SMB TikTok adoption fell from 34% to 22% year over year while Facebook rose above 90%. TikTok's own budget floor means a single 31-day ad group costs **$620 minimum** — more than the entire monthly marketing budget of most target customers. And for excavating contractors the real channel is Google Local Services Ads, not social.

---

## 1. Who already does the whole bundle

**This space is crowded and it is owned.** GoDaddy and Wix own the cheap self-serve end. Hibu, Scorpion, LocalIQ, Townsquare Interactive and Broadly own the human-managed end. Thryv owns the mid-market software end and is losing it. Podium, Angi and Thumbtack are adjacent rather than competing — see the boundary notes below.

| Vendor | What is in the bundle | Price/mo | Contract | Ad spend | Customer |
|---|---|---|---|---|---|
| **Broadly** | Website live in under 7 days, AI receptionist, reviews, social posting, 70+ listings | **$799** `[P]` | **None** — "cancel at any time with no cancellation fees, no penalty, and no minimum term" | **Separate, optional add-on**; Google and Meta ads are not in the base fee | Home services |
| **Hibu** | Smart Site, Search, Display, Social (FB/IG), Reviews, LSAs | No published price. BBB complaints: Hibu One **$629**, plus Local Ranking $560, plus SAP $80; another at **$2,745.82/mo** total | "typically 6 to 12 months" `[P]` | **Separate** — one complainant details $600/mo of Google ads on top | Local service SMB, sold door to door |
| **Thryv** | Starter: AI website builder, 60+ listings, AI reviews, tracking numbers. Signature adds SEO and social management. Amplify adds Ads/Brand/Search/Social "Boosts" | **$99 / $399 / custom** `[P]` | Under 12 months auto-renews monthly; **3-day refund window then none**; 30-day notice; no self-serve cancel `[P]` | Ads appear only in the custom **Amplify** tier | SMB, 215K clients |
| **Scorpion** | Website on a proprietary CMS, SEO, PPC, lead tracking | No published price; the pricing URL 404s. Floor **$800 plus $1,000 setup** per BBB; typical **$1,500–$5,000+** `[3P]` | 12-month standard | Separate | Home services, legal, larger contractors |
| **LocalIQ** (Gannett) | Managed search, social and display; websites; listings; a free tools tier | Free self-serve tools ($9.99–$14.99 listings); managed campaigns quote-only, low thousands `[3P]` | Per-campaign agreement | Separate | Local SMB. **Inaugural TikTok Channel Sales Partner, January 2026** |
| **Townsquare Interactive** | Website, SEO, listings, social | No published price; the pricing page is a form. BBB reports **$299–$700/mo** | The 10-K says "Most of our contracts with subscribers are terminable upon short or no notice" `[P]`, which contradicts third-party claims of a 12-month term | Separate | SMBs outside the top 50 markets, under 20 employees, under $5M revenue `[P]` |
| **Marketing 360** | Software plus web design plus ad credits | No published price. `[3P]`: ~$65 Basics, ~$395 full platform, ad credits at $1/credit, custom sites $3,000–$20,000 | `[3P]`: 6-month default, 12 for website-only | **Ad credits model** | SMB |
| **GoDaddy** | Websites + Marketing including **Google Smart Campaign at Premium and above**; separate Digital Marketing plans; **Marketing Services Premium is humans running your Meta ads** | W+M Basic **$9.99 intro / $16.99 renewal**, Premium **$14.99 / $29.99** `[3P]`. Digital Marketing **$21.99 / $32.99 / $89.99** `[P]`. Marketing Services Premium: **price hidden behind a phone number** | Intro-price cliff at renewal | Separate | Mom-and-pop |
| **Wix** | Site plus **self-serve Meta ads run from the dashboard, AI manages the campaign** | **$17.77–$159.77/mo** on annual billing `[P]` | Annual prepay | Separate, paid to Meta | DIY SMB |
| **Yelp Ads** | CPC placement only. No website, no ad creative from your media, no Meta or TikTok | "as little as $5 a day" (~$150/mo) `[P]`. Real burn $400–$1,000/mo per BBB complaints | **None** — "Can you cancel? No. You are free to cancel at any time" `[P]` | It *is* the ad spend | Local SMB. 510K paying locations, **down 3% year over year** `[P]` |

### The boundary cases

**Podium is not in this market.** Its product is messaging, reviews, phone, payments and AI reception — no website building, no campaign management. It is worth studying only for its contract terms, which are the harshest found: 12-month initial term, auto-renew, fees non-refundable, and on early termination "Client will be responsible for the Fees due for the entire Subscription Term" — the full balance accelerates ([legal.podium.com](https://legal.podium.com/)).

**Angi and Thumbtack are lead marketplaces, and the distinction matters commercially.** An agency sells reach and the business owns the customer relationship. A marketplace sells a contact, resells it, and owns the demand. The 2026 data says the marketplace model is under real strain:

- **Angi killed its advertising product entirely.** From the FY2025 10-K filed 20 February 2026: "In the fourth quarter of 2025, the Company deprecated the advertising offering… Future advertising revenue will be de minimis." **US Advertising revenue in Q2 2026 was $0, against $64.2M in Q2 2025** ([SEC](https://www.sec.gov/Archives/edgar/data/1705110/000170511026000078/angi-20260630.htm)).
- Derived from Angi's own disclosed volumes, revenue per lead went **$24.88 (FY24) to $29.07 (FY25) to $40.57 (Q2 2026)**, a 47% year-over-year increase, while **Average Monthly Active Pros fell to 105K in H1 2026, down 19%**. Pros are being charged more and leaving.
- Angi's Pro Agreement effective 12 May 2026 states "Will I have to pay for the lead if I do not win the job? A. Yes", permits **fee increases up to 10% per term**, and references an **early termination fee whose amount is never published** ([legal.angi.com](https://legal.angi.com/#sppterms)). BBB records **1,840 complaints in three years**. An FTC consent order in January 2023 ran to $7.2M ([ftc.gov](https://www.ftc.gov/news-events/news/press-releases/2023/01/ftc-order-requires-homeadvisor-pay-72-million-stop-deceptively-marketing-its-leads-home)).
- **Thumbtack** lets the pro set the per-lead price on a slider and caps competition: "we limit the number of pros a customer can contact to five in the first four hours" ([help.thumbtack.com](https://help.thumbtack.com/article/set-lead-prices)). No subscription. Refunds are "made at our sole discretion" and go to Thumbtack balance, not the card.

**Two more not in the original brief that matter more than most of the above:**

- **Tiger Pistol** — a badged Meta Business Partner since 2013 and a TikTok publishing partner, which "automates the individual local business partner ad account connection process" across Facebook, Instagram, TikTok, Google, Amazon and CTV ([tigerpistol.com](https://tigerpistol.com/platform-overview/)). This is the closest existing thing to advertdreams' technical core. **It sells to brands, franchises and resellers, not to individual SMBs.** No published pricing.
- **Vendasta** — a white-label platform letting anyone resell websites, ads and listings under their own brand at **$99 / $499 / $999 per month** `[3P]`. This is the "anyone can start this company on Tuesday" datapoint.

---

## 2. The website half alone

| Vendor | Monthly-billed | Annual-billed | Cheapest usable tier | AI build | Runs ads? |
|---|---|---|---|---|---|
| Squarespace | $25 / $39 / $65 / $139 `[P]` | $228 / $348 / $588 / $1,188 per year `[P]` | **Basic $25** | Blueprint AI — real generated copy and layout | No |
| Wix | $24 / $36 / $46 / $172 `[3P]` | **$17.77** / $29.77 / $39.77 / $159.77 `[P]` | **Light $17.77** | Genuine prompt to multi-page generation | **Yes — self-serve Meta ads** |
| GoDaddy W+M | $21.99 / $39.99 / $44.99 `[3P]` | $9.99 / $14.99 / $20.99 intro, renewing at **$16.99 / $29.99 / $34.99** `[3P]` | Basic $9.99 in year one | Airo wizard plus generated copy and logo | **Yes — Google Smart Campaign at Premium and above, plus human-managed Meta ads** |
| Durable | $25 / $49 `[P]` | $22 / $41 `[P]` | **Launch $25** | Real 30-second generation | No — writes ad *copy* only |
| B12 | $49 / $78 `[P]` | not published | **$49** | Roughly two-minute draft; humans via a marketplace add-on | No |
| Hostinger | $11.99 / $18.99 / $27.99 `[P]` | **$2.99/mo on a 48-month prepay**, renewing at $10.99 `[P]` | Premium, $143.52 up front | Prompt to first version | No |
| Framer | not published | **$10 / $30** `[P]` | **Basic $10** | No — a design tool | No |

**Google Business Profile free websites are dead.** 21.7 million `business.site` sites stopped working on 1 March 2024, dumping millions of US small businesses into the paid market with no site.

**Wix ADI was retired on 10 November 2024** ([support.wix.com](https://support.wix.com/en/article/adi-sites-no-longer-supported)) and rebuilt as the AI Website Builder, which claims a "complete site structure—including relevant pages, layout and on-brand copy." Every mainstream builder shipped an equivalent within a year. **Nobody has a moat in generation.**

The 2026 "AI builds your site" tier is real but metered, and the metering is the tell that the underlying capability is worth nothing: Squarespace gives 10 one-time / 20 / 40 / 120 credits per month; **Hostinger Premium gets 5**; B12 gives 200/month; Durable gives 50 images. Credits are what you sell when the product is free.

**The realistic floor for a custom-domain site in year two is $10–$17/mo plus about $20/yr for the domain — call it $150–$200 per year all-in.** Anything a bundle charges above that for the website component is being charged for something else.

**Only two builders execute advertising.** Wix runs self-serve Meta and Instagram campaigns from the site dashboard where "the algorithm takes care of 24/7 campaign management", with **no TikTok** ([wix.com](https://www.wix.com/features/facebook-ads)). GoDaddy bundles Google Smart Campaign from the Premium tier at "no price increase" ([godaddy.com](https://www.godaddy.com/help/what-is-a-google-smart-campaign-41303)) and separately sells **Marketing Services Premium**, where humans run Facebook and Instagram campaigns including a professional photo shoot ([basicservices.godaddy.com](https://basicservices.godaddy.com/premium-plan/)) — price not published, hidden behind a phone number. Squarespace, Durable, B12, Hostinger and Framer all stop at generating ad *copy*.

**Caveat:** godaddy.com returned HTTP 403 to every automated fetch, including curl with browser headers. All GoDaddy Websites + Marketing and Airo prices above are third-party. Wix and Framer monthly-billed rates are also third-party, since both pages default to the annual toggle.

---

## 3. The ad half alone

| Tool | What it automates | Own photos in? | Entry price | Owns account and billing? | TikTok |
|---|---|---|---|---|---|
| **Meta Advantage+** | Creative generation plus delivery and budget optimisation | Yes — enhances yours or generates new | **Free** | You need your own | No |
| **TikTok Smart+ / Symphony** | Creative generation plus targeting, bid and creative automation | Yes — your assets or a product URL | **Free** | You need your own | Yes |
| **Canva Grow** | AI creative, publish into *existing* campaigns, analytics | Yes | **$0 on the Free tier** | **No — explicitly refuses to create accounts** | **Yes** |
| **Pencil** | Creative generation, one-click launch, tracking | Yes — brand kit plus 3–5 product and lifestyle images | **$14** | No — OAuth | **Yes** |
| **Creatify** | AI-avatar creative plus an AI Media Buyer that builds targeting, sets budgets and rotates creative | Partly — avatar-first, but you can bring a digital twin from your own footage | **$0 free / $39** | No — OAuth | **Yes** |
| **AdCreative.ai** | Creative generation, push to connected accounts | Yes — product photoshoots from your photos | **$39** | No — OAuth | **No** (Meta, Google, LinkedIn) |
| **Icon.com** | **Human** UGC production plus one-click launch to Meta | Human-filmed, not your footage | **$1,000** | No | Not yet |
| **Arcads** | AI-actor video generation | A custom AI actor can hold your product | No public price | Unverified | Claimed, **UNVERIFIED** |
| **Madgicx** | Creative generation, publishing, budget and bid automation. **Meta only** | Yes — drag-and-drop product and lifestyle photos | **~$99** below $2.5K spend `[3P]`, scaling with spend | No — needs Business Manager admin | Reporting only |
| **Smartly** | Enterprise creative automation and media buying | Yes | No public price; ~2–4% of spend `[3P]` | No | Yes |
| **Zocket** | Creative, publish, optimise, **plus agency ad accounts** | Yes | **$99** per its Shopify listing | **Claims yes** — whitelisted accounts, top-up through Zocket. **Site 404s to fetchers, UNVERIFIED** | Yes |
| **Plai** | Campaign creation, AI creative, "Optimize For Me" across 15 platforms | Yes, imports your media | **$97 Brand / $297 Agency white-label** `[P]` | **No — "Requires existing ad accounts"** | Yes |
| **Scalify** | Cross-platform Meta and TikTok launching plus AI creative | Partly | **$29** annual `[P]` | Unverified | Yes |
| **Bïrch** (ex-Revealbot) | Bulk publishing, rule-based budget and bid. **No creative generation** | Pulls existing files from Drive | **$49** including $10K of spend | No — OAuth | Full |
| **AdRoll** | Programmatic DSP plus a social layer | You supply creative | No subscription fee; media markup undisclosed | **Split** — yes for its own display and CTV, **no for social**: "all social spend is billed directly by the respective channels" | Yes |

### The two conclusions that matter

**AI ad creative is a commodity and the platforms are giving it away.** Meta's video generation tools reached a **$10 billion revenue run-rate in Q4 2025, with quarter-over-quarter growth nearly three times faster than overall ads revenue** ([about.fb.com](https://about.fb.com/news/2026/01/2026-ai-drives-performance/)). Advantage+ Creative "enhances your existing assets or generates brand new ones from scratch" inside Ads Manager at no charge. TikTok Symphony Creative Studio is free to all logged-in business users and ingests your own assets or a URL. **Canva's $0 tier already does AI ad creation and publishes to Meta and TikTok** ([canva.com/pricing](https://www.canva.com/pricing/)). Building "we turn your photos into ads" as the differentiator is building something three trillion-dollar platforms hand out free.

**Almost nobody does the plumbing.** Canva states it outright: "You must already have an advertising account connected… Creating new advertising accounts isn't supported in Canva" ([help doc](https://www.canva.com/help/publish-to-tiktok/)). Plai: "Requires existing ad accounts." Madgicx integrates with existing accounts rather than creating them. AdRoll will act as agent of record for its own display inventory but **not for Meta or TikTok**. Zocket is the only tool claiming the full agency model, and its evidence is weak.

**Worth watching if you build rather than buy:** Meta shipped **Ads AI Connectors** — an MCP server plus CLI — on 29 April 2026, offering natural-language campaign creation, catalog management and reporting, with **no developer app and no App Review**, because the advertiser authenticates their own account. Everything it creates lands **PAUSED** with no override ([facebook.com/business/news](https://www.facebook.com/business/news/meta-ads-ai-connectors)). Free during open beta; post-beta pricing unannounced.

---

## 4. Platform mechanics: TikTok and Meta

### TikTok: this is buildable

**Ad account creation — yes.** `POST https://business-api.tiktok.com/open_api/v1.3/bc/advertiser/create/`. Verbatim: "Use this endpoint to create an auction ad account in the **Agency** or **Direct** Business Center. You need to be an Admin user of the Business Center" ([docs](https://business-api.tiktok.com/portal/docs?id=1739939020318721)).

- **The US is on the supported-country list.** Business Center types are `NORMAL`, `DIRECT`, `AGENCY`, `SELF_SERVICE`, `SELF_SERVICE_AGENCY`. `qualification_info`, including the client's website, is required for AGENCY types.
- **Quotas:** a maximum of **10,000 ad accounts per user** across all Business Centers, plus per-BC daily and total creation quotas that "vary based on the Business Center type" — **exact numbers not published, UNVERIFIED**. This is the constraint that would bite first at onboarding scale.
- Getting an agency Business Center is **self-serve**: signup asks you to pick "I am an agency" or "I am an advertiser", and each user can create **up to 30 Business Centers**.
- Ownership is explicit: "Since the Business Center owns these ad accounts, you can securely grant and revoke access for team members and partners without ever sharing login credentials." Each account carries the **client's** legal entity, and a verified certificate **auto-approves subsequent accounts for the same client** ([help centre](https://ads.tiktok.com/help/article/create-ad-accounts-in-business-center)).
- Identity verification, including **individual** identity verification — relevant for solo hairstylists — is API-driven.

**Video upload — yes.** `POST /open_api/v1.3/file/video/ad/upload/`. A 500MB direct-upload limit, 9:16 / 16:9 / 1:1, .mp4/.mov/.mpeg/.avi, with chunked upload available. **Smart Fix** auto-repairs low-resolution and illegal-size uploads, which is genuinely useful for phone-shot job-site and salon footage. **Ad review takes "about 24 hours" and re-triggers on every creative or targeting edit** ([review FAQ](https://ads.tiktok.com/help/article/ad-review-faq)). A `CUSTOMIZED_USER` identity can be created via API, so a salon with no TikTok handle is not blocked.

**Lead generation — mostly, with one gap.** There is **no REST endpoint to create an Instant Form**. The workaround is the **TIP Editor SDK**, which embeds TikTok's page builder in your own UI — a real front-end build, and **not supported in Sandbox**. Once a form exists, lead delivery is genuinely real-time: `POST /subscription/subscribe/` with `subscribe_entity: "LEAD"`, HMAC-SHA256-signed webhooks, batches up to 1000, 24-hour retries. Hard constraint: "only ad account **admins** can create and query lead download tasks or download the leads."

**OAuth and review.** Developer app review takes 2–3 business days, and each scope increase another 2–3 days; a maximum of 5 apps per developer. The advertiser authorization flow requires the client to log in, approve scopes **and complete an emailed verification code**. The resulting **access token does not expire**. If your own Business Center created the account, one BC-admin token covers all of them, and the email-code step applies only when onboarding a client's pre-existing account.

**Rate limits** run from Basic at 10 QPS / 600 QPM / 864,000 QPD to Ultimate at 50 / 3,000 / 4,320,000. **Upgrades are self-service, one level at a time** — no partner badge required. **Sandbox exists** but excludes every `/bc/*` endpoint, all lead endpoints, webhooks and the TIP SDK, so the two riskiest parts of the build can only be tested in production.

**TikTok Marketing Partners in 2026.** Four badge categories: Agency, Creative, Measurement, and Marketing Technology ([marketing partners](https://ads.tiktok.com/business/en-US/marketing-partners)). On **12 January 2026 TikTok launched the Channel Sales Partner Program**, sitting under Marketing Technology and explicitly aimed at SMB platforms: "partners that meet TikTok's technical, operational, and go-to-market standards while driving SMB adoption and investment through their platforms at scale… supporting a minimum of **1,000 active advertisers** and often over 10,000." The verticals named are "home services, automotive, retail, real estate, and local services." **Inaugural partners include LocalIQ and Scorpion** ([TikTok blog](https://ads.tiktok.com/business/en-US/blog/channel-sales-partners)). The badge gates nothing needed to start — but two of the incumbents from section 1 already have the TikTok integration advertdreams would be building.

**Pooling advertisers is permitted; funding is the soft spot.** No published rule prevents one Business Center holding many unrelated advertisers, and TikTok documents the agency case directly. Spend can be funded from BC balance via `POST /bc/transfer/`, which requires the Finance Manager role, plus Balance Sharing. **But** `transfer_level: BC` requires Monthly Invoicing, which requires "an active TikTok Ads account in good standing for at least six months with positive payment history" ([credit line doc](https://ads.tiktok.com/help/article/credit-line)). Multiple Payment Portfolios per client is allowlist-only. Separately, a July 2026 agency guide states "New Billing Sharing requests are no longer possible in the US, EU, and Israel (updated July 2024)" ([leadsie](https://www.leadsie.com/blog/ultimate-guide-to-tiktok-business-center-for-marketing-agencies)); this could not be confirmed on TikTok's own pages, so treat it as **UNVERIFIED** and confirm manually before designing around pooled billing.

### Meta, for contrast

| Capability | Status |
|---|---|
| Create ad account | `POST /{business_id}/adaccount` with `end_advertiser`, `media_agency`, `partner` — but **"limited to 5 ad accounts"** via API ([docs](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/ad-accounts)) |
| Agency access to client accounts | `POST /{BUSINESS_ID}/client_ad_accounts` with `permitted_tasks`; the owner approves in Business Settings |
| Scaled SMB model | **2-Tier Business Manager** — a parent BM creates "hundreds or thousands" of child BMs, and "the Parent Business Manager pays for the Child Business Managers' ad activity and bills their clients separately." Explicitly for "you manage ad campaigns for a large number of SMBs." **"Access to these APIs is limited. Contact your Meta representative to request access"** ([docs](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)) |
| System users | 1 standard plus 1 admin at Standard/Limited Access; **10 plus 1 at Advanced/Full**. TikTok has no system-user equivalent |
| Access tiers | "'Standard Access' is now Limited Access, and 'Advanced Access' is now Full Access." Limited is "heavily rate-limited… For development only. Not for production apps running for live advertisers." Full Access requires **at least 500 Marketing API calls in the last 15 days with under a 15% error rate** ([docs](https://developers.facebook.com/docs/marketing-api/overview/authorization)) |
| Third-party funding of spend | Extended credit with `owning_credit_allocation_configs` — one business allocates its line of credit to others |
| Lead retrieval | `GET /{FORM_ID}/leads`, `GET /{AD_ID}/leads`, plus a real-time `leadgen` Page webhook. Requires `ads_management`, `leads_retrieval`, `pages_show_list`, `pages_read_engagement`, `pages_manage_ads` ([docs](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving)) |

**Net: TikTok's agency structure is self-serve and its documentation walks you through it. Meta's equivalent at scale is gated behind a representative.** That inverts the usual assumption — the harder platform to automate is the one with over 90% SMB adoption.

No fetchable documentation was found for Meta's "Tech Provider" app type specifically — **UNVERIFIED**. The verified gate is Full Access via App Review plus Business Verification.

---

## 5. Pricing reality check

### Website

| | Civil construction / excavating | Salon / stylist |
|---|---|---|
| One-off build | **$3,000–$5,000** template `[3P]`; $5,000–$15,000 semi-custom `[3P]`. Clutch's overall average web-design project is **$38,105**, with the most common bracket under $10,000 `[P]` | Effectively **$0** — the site comes with the booking app |
| Monthly | **$75–$200** hosting and maintenance `[3P]`, or **$249/mo all-in with no build fee and no contract** from a contractor-vertical shop ([Footbridge Media](https://www.footbridgemedia.com/faq)) | **$0–$35** — SalonBuilder charges **$24.95/mo for booth renters** `[P]`; GlossGenius includes a site at $24 |

Footbridge's FAQ is worth reading for tone: "We do not require any contracts… any marketing company that requires a contract does not believe in their services."

### Ad management

Industry convention is 15–20% of spend, sliding to 20–25% below $5K/mo `[3P]` — but **no vendor with published pricing actually charges a percentage**. Published flat prices:

- **Footbridge Media** (contractors): **$775/mo minimum Google Ads budget**, recommends a **$500** starting Meta budget, no contracts `[P]`
- **LYFE Marketing**: **$750 / $1,350 / $1,550 per month plus $300 one-time setup**, ad spend separate `[P]`
- **Outdooit** (contractor Meta ads): **$750/mo management, 4 creatives per month built from "your actual project photos, before-and-after images, and job site content"**, ad spend separate and unmarked-up `[P]`. This is the human-agency price for precisely what advertdreams proposes to automate.
- **Solo-stylist salon agencies**: entry retainers **$499–$650/mo** `[3P]`
- **WebFX**: social media management from **$3,000/mo** `[P]`

**Zero of twelve salon-vertical marketing agencies publish a price.** Confirmed price-gated: The Salon Marketing, Salon.marketing, IndoorMedia, Zoca, Meetzizi (which advertises "Our Prices Are Transparent And Competitive" while publishing no numbers), 39 Celsius, Sunny Storm, Rosy.

### Monthly ad spend and the floor

- **TikTok's floor is hard:** campaign budgets must exceed $50 and ad group daily budgets must exceed $20 ([ads.tiktok.com](https://ads.tiktok.com/help/article/budget)) `[P]`, so a 31-day ad group costs **$620 minimum**.
- **Meta's learning phase** needs roughly 50 optimisation events per rolling 7 days. At a $34–$41 home-services CPL, exiting the learning phase costs **$1,700–$2,060 per week**. No small excavator will ever do that. The practical excavator floor is **$1,000–$1,500/mo** and permanently learning-limited. Below about $500/mo, Meta lead generation for a contractor is a donation.
- **Salons are different** because they need a booking rather than a lead, and the ticket is $80–$200. Phorest's built-in ads tool says "Start with as little as $5 per day" `[P]`. The realistic floor is **$150–$500/mo**, and at that level the arithmetic only works on retention and rebooking creative, not cold acquisition.

### Cost per lead

**Google Ads — LocalIQ/WordStream 2026** (13,474 US search campaigns, April 2025–March 2026, published 19 May 2026) `[B]`:

| Industry | CPC | CVR | **CPL** |
|---|---|---|---|
| **Home & Home Improvement** | $8.33 | 8.05% | **$90.92** |
| **Beauty & Personal Care** | $4.62 | 10.35% | **$39.25** |
| Personal Services | $7.17 | 12.34% | $54.60 |
| All industries | $5.42 | 8.18% | $66.69 |

**Meta — WordStream/LocalIQ** (726 US lead campaigns, April 2024–June 2025, medians) `[B]`. **Caveat added by [#29](https://github.com/TempleZide/advertdreams/issues/29):** 726 is the whole-report sample. WordStream's stated method requires only "at minimum 2 unique active campaigns" per subcategory, so any single row below may rest on as few as two campaigns.

| Industry | CPC | CVR | **CPL** |
|---|---|---|---|
| **Home & Home Improvement** | $2.23 | 5.22% | **$41.26** |
| **Beauty & Personal Care** | $3.06 | 5.29% | **$51.42** |
| Personal Services | $2.08 | 6.51% | **$30.57** |
| Overall | $1.92 | 7.72% | $27.66 |

Note the inversion: beauty costs *more* per lead than home improvement on Meta ($51.42 against $41.26) but far *less* on Google ($39.25 against $90.92).

**Google Local Services Ads** (888 contractors, 1,774 campaigns, $6.72M of spend, February 2026) `[3P, methodology stated]`: a blended **$53 CPL, 43.9% book rate, $1,826 average ticket, 7.84x ROAS**, and $233 cost per paying customer ([Searchlight Digital](https://searchlightdigital.io/google-local-service-ads-cost-per-lead/)). **UNCONFIRMED, downgraded by [#29](https://github.com/TempleZide/advertdreams/issues/29):** the study originates with The Media Captain, whose site returns 403, and searchlightdigital.io is a republisher flagged as AI-generated marketing content. For scale, LocaliQ's verified Google *search* CPL for Construction & Contractors is **$165.67** across 3,211 campaigns.

**Two data-quality warnings.** LocalIQ's "Home Services Advertising Benchmarks" page carries a February 2026 publication date but is built on May 2020–June 2021 data; its social CPLs are five years stale and should not be cited. And **no CPL benchmark exists anywhere for excavation, grading or site work specifically**, on any platform. Every "construction CPL" figure in circulation is a blog extrapolation. **UNVERIFIED.**

### Lead marketplaces

**Networx is the only vendor publishing a rate card for civil trades** `[P]` ([networx.com](https://www.networx.com/exclusive-program)): Excavation or Major Grading **$57–$63**, Minor Grading $59–$65, Land Clearing $95–$105, Concrete Installation $68–$105, Demolition $61–$143. No setup fees, no contracts. Pay-per-lead goes to up to four contractors; Exclusive goes to one.

Salon equivalents charge commission on the first visit rather than cost per lead — a structurally better deal:

| Platform | Acquisition fee |
|---|---|
| Booksy Boost | **30% of first visit, minimum $10, maximum $100**, one-time |
| StyleSeat | **30% of first appointment, $50 cap**, one-time |
| Fresha | **20% one-time new-client commission** |
| Vagaro | **$0** — the only free marketplace |
| GlossGenius, Boulevard, Mangomint, Square | No marketplace, no fee |

A contractor pays **$57–$63 for an excavation lead that might close 20–25%**, cash up front, win or lose. A stylist pays **nothing up front and 30% of one appointment only if the client shows**, capped, with every subsequent visit free.

### What the low end bears

**$99–$350/mo buys software, not a service** (Thryv Starter $99, GoSite $299, Townsquare's $299 tier). **$600–$800/mo is the real floor for human-managed website plus listings plus ads plus reviews, before ad spend** — four independent primary datapoints converge there.

The single most revealing number in this report is from **Thryv's FY2025 10-K** `[P]`:

| | 2025 | 2024 | 2023 |
|---|---|---|---|
| Marketing Services clients | **171,000** | 233,000 | 314,000 |
| **Monthly ARPU — Marketing Services** | **$108** | $133 | $158 |
| Monthly ARPU — SaaS | $356 | $330 | $372 |
| Seasoned net revenue retention (SaaS) | **94%** | 98% | 96% |

**171,000 SMBs paying an average of $108 per month** is the truest available measure of what the mass market bears. Marketing Services clients fell **27% year over year**, and **Thryv is shutting that business down by the end of 2028**. Q2 2026 was worse still: total revenue **$150.7M against $210.5M** a year earlier, Marketing Services revenue **$36.2M against $95.5M**, clients **215,000 against 261,000**, and seasoned NRR down to **90%**.

Yelp is shrinking too: **510,000 paying advertising locations in FY2025 against 526,000 in FY2024**, and its own risk factors admit its 2024 paid-search initiative "did not drive our desired returns in advertiser retention or ad budget increases" `[P]`.

### Salon software already runs their marketing

| | Base (US) | Website | Email/SMS | **Runs paid ads?** |
|---|---|---|---|---|
| **GlossGenius** | **$24/mo** annual, $28 month-to-month | Yes, all tiers | Unlimited email; 500 / 2,500 SMS | **No** |
| **Booksy** | **$29.99/mo** | Booking page | Email plus **2,000 free SMS per month** | **No** |
| **Vagaro** | **~$35/mo** per calendar | MySite add-on | 1,000 free emails per month | **No** |
| **StyleSeat** | **$35/mo** | Yes | Yes | **No** |
| **Fresha** | ~$19.95 individual `[3P]` | Yes | Yes | **No** |
| **Square Appointments** | **$0 / $49 / $149** | Free site builder even on $0 | Unlimited email plus 500/2,500 texts; automations included | **No** |
| **Mangomint** | **$120/mo** | Yes | Marketing add-on from $30/mo | **No** |
| **Boulevard** | **$140/mo** | Yes | 500–10,000 emails included | **No** |
| **Phorest** | quote only | Yes | Yes | **Self-serve Meta ads tool** — "Start with as little as $5 per day" |

The answer is decisive in both directions. Email, SMS, reviews, automated win-back, a website and Reserve with Google are **table stakes at $24–$150 per month**. **None of the eight sells managed advertising.** The category monetises acquisition through first-visit commission and, in one case, self-serve ad tooling.

---

## 6. The gap

### Who owns what

- **Cheap self-serve website plus some ads:** GoDaddy and Wix. GoDaddy is the only one that will sell a mom-and-pop a human running their Meta ads, and its weakness is that the price is behind a phone call.
- **Human-managed bundle at $600–$2,700/mo:** Hibu, Scorpion, LocalIQ, Townsquare Interactive, Broadly, Marketing 360. Sold door to door and by cold call. Broadly is the only one with a published price and genuinely no contract.
- **SMB software with a marketing wrapper:** Thryv (dying — Marketing Services down 27%, shutting by 2028), Podium (messaging, not ads), GoSite, Signpost.
- **Lead supply for contractors:** Angi (advertising product killed, effective lead price up 47% to $40.57, pros down 19%), Thumbtack, Networx, Google LSA. **Google LSA is the best product in this category** at a claimed $53 CPL and 7.84x ROAS (**unconfirmed, see #29**), and it is neither an agency nor something that can be resold.
- **The salon relationship:** GlossGenius, Booksy, Vagaro, StyleSeat, Fresha, Square — at $24–$35 per month, already holding the customer's calendar, payments and phone.
- **The technical infrastructure advertdreams would be rebuilding:** Tiger Pistol and Evocalize, both badged Meta partners with TikTok publishing, both already automating local ad account connection at scale — for brands and franchises, not individual SMBs.
- **The white-label shortcut anyone can buy:** Vendasta at $99–$999/mo, and Plai's Agency tier at **$297/mo with white-label on a custom domain and a SaaS client billing configurator**. Someone could stand up a competitor to advertdreams on Plai this week for $297 per month.

### Commoditised to near-zero margin

1. **The website.** $10–$18/mo, generated by AI at every vendor, metered because it is worthless. Give it away. Charging for it invites comparison to a $9.99 GoDaddy plan.
2. **AI ad creative.** Free at Meta, free at TikTok, free on Canva's $0 tier. **This cannot be the pitch.**
3. **Publishing and basic optimisation.** $14–$99/mo across a dozen vendors, most supporting both Meta and TikTok. Scalify does Meta plus TikTok for $29/mo.
4. **Lead capture.** Meta's `leadgen` webhook and TikTok's `subscribe_entity: LEAD` are free platform features. A dashboard showing leads is a weekend of work and no moat.

### Where differentiation could actually live

**a) The account and billing plumbing — the only genuinely unoccupied slot.** Of roughly twenty tools examined, none reliably provisions ad accounts and funds spend for many SMB clients. Every one says "connect your existing ad account." The mom-and-pop customer *cannot do that step*, which is precisely why they do not advertise. **Owning onboarding end to end — create the asset, verify the entity, create the ad account, handle billing, never show them Ads Manager — is the product.** Note the asymmetry: TikTok's `/bc/advertiser/create/` makes this self-serve, while Meta caps API creation at five and routes scale through a representative. Solve the Meta path first; it is the harder one and the one with 90% adoption.

**b) The price point nobody serves.** Between $35/mo (booking software, no ads) and $499–$800/mo (an agency) there is nothing. The evidence that demand exists: 171,000 businesses paid Thryv $108 per month for marketing services, and marketing-partner usage collapsed from 60% to 34% in a year — those businesses did not stop wanting help, they stopped being able to afford it. **A $149–$249/mo fully automated bundle sits in genuinely empty space.** The catch is that it only works with zero human touch, and every incumbent at that price has quietly become software-only for exactly that reason.

**c) Salons specifically.** Nobody sells a booth renter managed Meta advertising at a price they would pay. Booking software owns retention at $24–$35; marketplaces own acquisition at 20–30% of one visit; the salon agency layer publishes no pricing at all and starts around $500–$750/mo. That is a 20–30x price cliff with nothing in between.

**d) The customer's own photos.** Real, but thin. Outdooit already sells "we build ads from your actual project photos" to contractors at $750/mo, and Meta's Advantage+ animates your images for free. The defensible version is not the generation — it is the **capture loop**: making a contractor covered in mud, or a stylist between clients, actually upload media week after week without being nagged. That is a habit-formation problem, not an AI problem, and it is the part no incumbent has solved.

### Where this pushes back on the concept as scoped

- **TikTok is the wrong second channel for these two verticals right now.** SMB adoption fell from 34% to 22%, the budget floor is $620 per ad group per month, and no published local-salon TikTok CPL benchmark exists. It is a 2027 feature, not a v1 pillar. **Meta plus Google Local Services Ads is the pairing the data supports** — LSA is where excavating contractors actually get work, at a claimed $53 per lead and 7.84x ROAS (**unconfirmed, see #29**; LocaliQ's verified Google search CPL for this trade is $165.67).
- **Excavating contractors may not be a social-ads business at all.** Their channel mix is referrals, Google Maps and LSA. The one published rate card for the trade is Networx at $57–$63 per exclusive excavation lead. Building a Meta and TikTok product for them means fighting the channel as well as the competitors.
- **Two verticals with nothing in common is two products.** A salon needs bookings from a $150/mo budget with a $100 ticket and lives inside GlossGenius. An excavator needs $1,000 or more per month to escape Meta's learning phase, has a $5,000-plus ticket, and lives in Google LSA. Different creative, different channel, different economics, different integration surface, different sales motion. Pick one.
- **Customer acquisition is the actual moat problem, not the technology.** Hibu, Scorpion and Townsquare acquire through outside sales reps doing cold calls and drop-ins, which is why they need $600 or more per month. A self-serve product at $149/mo has to acquire for well under $500 CAC in a market where Thryv's own seasoned net revenue retention is 90%. The hard question is not whether this can be built. It is how a non-technical excavator with no time ever finds a self-serve signup page.

---

## Verification caveats

- **GoDaddy** returned HTTP 403 to every automated fetch including curl with full browser headers. All Websites + Marketing and Airo prices are third-party. Only the Digital Marketing plans and the Marketing Services Premium feature list are primary-verified, and the latter publishes no price.
- **Six of eight bundle vendors publish no price at all**: Hibu, Townsquare, Podium, Scorpion, Marketing 360, Birdeye. Their figures come from dated BBB complaint text, which is first-hand and dated, or from third-party blogs, which is not.
- **Podium's $399/$599 tiers** have no primary source. Only the ~$600/mo from BBB complainants is first-hand.
- **Angi's current membership fee and early-termination fee amount** are unpublished and contractually confidential. The $287.99/yr figure comes from the 2022 FTC complaint.
- **Zocket's agency ad accounts** — the one tool claiming the full plumbing — could not be fetched; every subpage 404s to automated fetchers. Verify in a browser before relying on it.
- **Arcads** has no public pricing page; three circulating figures are mutually incompatible. Fully unverified.
- **Smartly** has no first-party price of any kind. The 2–4%-of-spend estimate is third-party.
- **TikTok's developer portal is JavaScript-rendered** and does not respond to plain fetches; the API facts above came from the doc-tree JSON behind it. Per-Business-Center ad account creation quotas are not published. TikTok Marketing Partner eligibility criteria beyond the 1,000-advertiser figure are not published.
- **The TikTok Billing Sharing restriction in the US, EU and Israel** is third-party-sourced only; TikTok's own page did not render it. Confirm manually before designing pooled billing.
- **Meta's "Tech Provider" verification** has no fetchable documentation. Unverified. Meta's exact minimum daily budget by billing event also did not render.
- **No Reddit evidence appears in this report.** Reddit returned 403 across all mirrors and the JSON API from this environment. BBB complaint text and dated Trustpilot entries were substituted.
- **Vagaro's US pricing** geolocates to CAD and third parties disagree ($25 / $30 / $23.99). Fresha's USD pricing, Boulevard's win-back take rate, Mangomint's marketing tiers above $30, and Phorest's actual dollar pricing all remain unresolved.
- The web search budget was exhausted at 200 calls partway through; later work was direct-fetch only, and a handful of follow-ups were left open rather than guessed.
