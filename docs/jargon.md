# Jargon

Vocabulary advertdreams did not invent and cannot rename: Meta's, telephony's, and the advertising trade's. Here so a reader with no advertising background can follow the research docs and the wayfinder map.

This is a decoder ring, not the domain model. The words advertdreams owns — Client, Lead, Creative, Site, Campaign, Tier — are defined in [`CONTEXT.md`](../CONTEXT.md), and that file is the authority when the two disagree.

## Meta

Meta renames things and does not always update its own documentation. Where a term has been renamed, the old name is given, because the old name is what most search results and half of Meta's own pages still say.

**Business portfolio**
The container that owns a business's assets on Meta — Pages, ad accounts, people, and partner relationships. **Formerly called Business Manager**, and Meta's own help pages still say Business Manager in places. advertdreams owns one; each Client may or may not have one of their own.
_Prefer_: business portfolio. _Avoid_: Business Manager, Business Suite (a different thing — the app for running a Page day to day).

**Page**
A business's presence on Facebook. Ads run *from* a Page, so every ad advertdreams publishes carries the Client's own Page as its public identity. Not to be confused with the advertdreams-hosted **Site** — see `CONTEXT.md`, which is why that term exists.

**Client asset / partner access**
The arrangement where one business portfolio grants another limited rights over an asset it owns, without transferring ownership. A Client shares their Page with advertdreams this way. The grant is per-asset and revocable at any time, silently.

**Task**
A named right within a grant — `ADVERTISE`, `MANAGE_LEADS`, `MANAGE`. advertdreams needs `ADVERTISE` to run ads from a Client's Page and `MANAGE_LEADS` to read leads from them.

**Ad account**
The billing and container object that campaigns live in. It holds a payment method and spends money. advertdreams owns one per Client.

**Campaign → ad set → ad**
Meta's three-level hierarchy. The **campaign** sets the objective (what you want to happen). The **ad set** sets the targeting, the budget, the schedule, and the optimisation goal. The **ad** pairs an ad creative with that ad set. TikTok's equivalent middle level is called an **ad group**.
Note the collision: advertdreams' own **Campaign** (capital C, in `CONTEXT.md`) is defined as targeting plus budget plus creatives, which spans a Meta campaign *and* its ad sets. How Services map onto this hierarchy is an open decision.

**Ad creative**
Meta's object holding the image or video plus the text of an ad. Lowercase and singular-purpose: it is a record in an ad account, not advertdreams' **Creative** (capital C), which is a generated advertisement that may be rendered into several ad creatives across platforms.

**Lead Ad / instant form**
An ad format where the form opens inside Facebook or Instagram, prefilled from the user's profile, instead of sending anyone to a website. The **instant form** is the form itself. This is advertdreams' primary lead capture mechanism, and the only one that records which ad produced which lead.

**leadgen webhook**
Meta's real-time notification, fired when someone submits an instant form. Delivers a lead ID, which is then read back from the API. Lead data is **deleted after 90 days**, so a webhook that stops arriving is data loss on a timer.

**Leads Access**
A grant, separate from Page access and separate again from the `MANAGE_LEADS` task, controlling who may read a Page's lead data. It has no API, no webhook, and no way to read back whether it is still in place.

**Graph API**
Meta's general-purpose API for everything on the platform: Pages, users, posts, permissions.

**Marketing API**
The subset of the Graph API dealing with advertising: campaigns, ad sets, ads, creatives, insights.

**Access — two independent axes with confusingly similar names**
This pair has already produced one wrong conclusion in this repo. Keep them apart:

- **Permission access level** — per *permission*, on the Graph API. **Standard Access** lets an app request a permission only from people who have a role on that app; **Advanced Access** lets it request from anyone, and requires Business Verification and usually App Review.
- **Marketing API Access Tier** — per *app*, governing rate limits and which Marketing API surfaces are reachable. Meta renamed its two levels: what the docs used to call "Standard Access" is now **Limited Access**, and what they used to call "Advanced Access" is now **Full Access**. Full Access is earned by call volume, self-serve, no review.

_Prefer_: "Limited/Full Access" whenever the Marketing API tier is meant, and "Standard/Advanced Access" only for permissions. Never write "Standard Access" about the tier, even though Meta's older pages do.

**App Review**
Meta's human review of an app requesting Advanced Access to a permission. Costs weeks and a screencast walkthrough. advertdreams' structure avoids it, which is a load-bearing assumption rather than a convenience.

**Business Verification**
Meta confirming a legal business exists — documents, beneficial-owner identification. A prerequisite for Advanced Access. No published turnaround time.

**System User**
A non-human account inside a business portfolio that holds a long-lived API token. How a server authenticates to Meta without a person being logged in.

**Sandbox**
A Marketing API test environment. Nothing delivers and nothing spends. It cannot create the two objects advertdreams most needs to test, which is why it is of limited use here.

**Special Ad Category**
A restricted class of advertising — housing, employment, credit, social issues — where Meta strips out most targeting options to prevent discrimination. Whether civil construction counts as Housing is unresolved and matters, because the answer changes what targeting is available.

**Pixel / Conversions API**
Two ways of reporting what happened after a click: the Pixel is JavaScript on a website, the Conversions API is a server-to-server report. Both feed Meta's optimisation.

**Domain verification**
Proving to Meta that a business controls a domain, which unlocks control over how links to it appear in ads. Whether verifying one domain covers its per-Client subdomains is an open risk.

**URL macro**
A placeholder in an ad's destination link that the platform substitutes at click time — `{{ad.id}}` and similar — so a landing page can tell which ad sent the visitor. TikTok documents these; whether Meta's work well enough to attribute a lead is unverified.

**fbclid**
The click identifier Meta appends to outbound links. It arrives at a landing page but cannot be resolved back to a specific ad through any public API, which is why the hosted Site cannot prove attribution on its own.

**Advantage+**
Meta's family of automated placement, budget, and creative features. Named here only because Meta's documentation uses it constantly.

## Telephony

**CPaaS**
Communications Platform as a Service — a vendor selling phone numbers, calls, and SMS through an API instead of a phone contract. Twilio is one.

**A2P 10DLC**
Application-to-Person messaging over 10-Digit Long Codes: the US carrier registry every business must enrol in before software may send SMS from an ordinary phone number. Registration fees dominate the cost of a Tracking Number, and enrolment takes days — which lands squarely in onboarding.

**TCPA**
The US Telephone Consumer Protection Act. Governs consent for calls and texts, and carries statutory damages per violation. Relevant because advertdreams owns the Tracking Numbers.

## Advertising metrics

All of these are ratios over a time period, and none of them mean anything without knowing the period and the audience.

**CPL — cost per lead**
Ad spend divided by leads generated. The number that decides whether a Tier's spend cap can produce enough leads to be worth a subscription. Meta benchmarks: home improvement ~$41, beauty ~$51.

**CPC — cost per click**
Ad spend divided by clicks.

**CPM — cost per mille**
Cost per thousand impressions. How Meta actually charges most of the time.

**CTR — click-through rate**
Clicks divided by impressions. A creative-quality signal more than a business one.

**ROAS — return on ad spend**
Revenue produced divided by ad spend. A multiple: 7.84x ROAS means $7.84 back per $1 spent. Requires knowing what a customer was worth, which advertdreams generally will not.

**CAC — customer acquisition cost**
Total cost to win one paying customer. Distinct from CPL: most leads never become customers.

## General business

**SMB**
Small and medium business. advertdreams' customer, at the very small end of it.

**CRM**
Customer relationship management software — where a business tracks its leads and customers. Jobber and ServiceTitan are the trade-specific ones. Integrating with them is out of scope for v1.

**SLA**
Service level agreement — a published, committed turnaround time. Noted in the research mostly by its absence: several Meta processes advertdreams depends on have none.
