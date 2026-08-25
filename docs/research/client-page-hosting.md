# Hosting a Client's Site: Domains, SSL, Media Storage, and Per-Client Cost

Research for [#24](https://github.com/TempleZide/advertdreams/issues/24). Prices verified **2026-08-24** against live vendor pages and, where a pricing page was JavaScript-rendered, against the vendor's own machine-readable price list. Every figure is cited to a primary source or explicitly flagged as unconfirmed. Cloud pricing and registry fees both move; re-verify before any number here goes into a Tier price.

---

## Answer

**Hosting a Client's Site costs between one cent and ten cents per Client per month. It is not a real input to the pricing model.** For comparison, the Tracking Number decided in [#6](https://github.com/TempleZide/advertdreams/issues/6) costs about $8 per Client per month — roughly a hundred times more — and Ad Spend dwarfs both. Whatever the website scope decision in [#21](https://github.com/TempleZide/advertdreams/issues/21) turns out to be, cost should not be the thing that decides it.

The one line item that is not noise is **the domain name**. A `.com` registered on the Client's behalf costs about **$0.92 per Client per month** ($11.08 a year at Porkbun, verified 2026-08-24), which is roughly ten times the entire cost of hosting the Site, serving its photos, and issuing its certificate combined. The address decision, not the hosting decision, is where the money and the operational pain both are.

**Three findings should change how [#21](https://github.com/TempleZide/advertdreams/issues/21) is framed.**

First, **Meta does not require the Site to exist.** The standing constraint on the map says the Site is "the destination an ad clicks through to, which Meta's landing-page-consistency rule requires regardless." That is not correct as stated. There is no Meta policy called "Landing Page Consistency" — that is a Google Ads term. Meta's Relevance rule constrains a landing page *if an ad has one*; it does not oblige an ad to have one, and Lead Ads, which [#5](https://github.com/TempleZide/advertdreams/issues/5) made the primary Lead mechanism, have no external destination at all. The Site is a **product decision, not a compliance requirement**. It should be justified on whether it sells and whether it converts higher-intent Leads, not on a Meta rule that does not exist.

Second, **no Meta policy requires the Site to be on the Client's own domain, or to identify advertdreams, or to match the Facebook Page name.** A Site at `joes-excavating.advertdreams.com` violates nothing that could be found in Meta's Advertising Standards. The rules that do apply are all about deception — do not impersonate another brand, do not deliver something substantially different from what the ad promised, no interstitials or pop-ups in front of the content. A plain page presenting the Client's own business clears all of them.

Third, **the default should be a subdomain of a domain advertdreams owns.** It costs nothing, the Client does nothing, no DNS can be misconfigured, no email can break, and no domain has to be untangled at churn. Every other option is a downgrade on all five counts. A Client-owned custom domain should be an upgrade offered to Clients who ask, not the default path a non-technical owner-operator is walked down at onboarding.

---

## Per-Client monthly cost

### The three architectures priced

Profile A is v1: one static Site plus the Client's photos. Profile B adds the video a future TikTok pipeline implies. Media assumptions and their arithmetic are in *Media storage* below.

**Architecture A — subdomain of a domain advertdreams owns** (`joes-excavating.advertdreams.com`). One Cloudflare Worker with a wildcard route serves every Client, keyed on the `Host` header; media comes from R2 on a public custom domain. Cloudflare's Universal SSL covers `*.advertdreams.com` at no charge, so there is no certificate line at all.

| Per Client per month | 10 Clients | 100 Clients | 1000 Clients |
|---|---|---|---|
| Workers Paid ($5/mo flat, account-wide) | $0.500 | $0.050 | $0.005 |
| R2 storage + operations (Profile A) | $0.000 | $0.002 | $0.005 |
| Domain | $0.000 | $0.000 | $0.000 |
| TLS certificate | $0.000 | $0.000 | $0.000 |
| **Total** | **$0.50** | **$0.05** | **$0.01** |

**Architecture B — a domain the Client already owns, pointed at us.** Adds Cloudflare for SaaS custom hostnames, which handle issuance and renewal per Client domain.

| Per Client per month | 10 Clients | 100 Clients | 1000 Clients |
|---|---|---|---|
| Workers Paid | $0.500 | $0.050 | $0.005 |
| R2 storage + operations (Profile A) | $0.000 | $0.002 | $0.005 |
| Custom hostname (100 included, then $0.10) | $0.000 | $0.000 | $0.090 |
| Domain (Client already pays for it) | $0.000 | $0.000 | $0.000 |
| **Total** | **$0.50** | **$0.05** | **$0.10** |

**Architecture C — advertdreams buys the domain on the Client's behalf.** Identical to B, plus registration.

| Per Client per month | 10 Clients | 100 Clients | 1000 Clients |
|---|---|---|---|
| Hosting, media, and certificate (as B) | $0.500 | $0.052 | $0.100 |
| `.com` registration, $11.08/yr ÷ 12 | $0.923 | $0.923 | $0.923 |
| **Total** | **$1.42** | **$0.98** | **$1.02** |

Adding Profile B's video raises the R2 line from $0.005 to about $0.020 per Client at 1000 Clients — an increase of a cent and a half per Client, which does not move any total above. **Video does not change the answer**, provided it is served as plain MP4 from object storage rather than through a managed video platform. See *Video* below for what changes if it is not.

### Where the arithmetic comes from

The Workers line is a flat $5 per month for the whole account, divided by the Client count. [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) (verified 2026-08-24) puts Workers Paid at $5/month with 10 million requests and 30 million CPU-milliseconds included, then $0.30 per additional million requests. At 1000 Clients and 1500 page views each, the Worker sees 1.5 million requests a month, comfortably inside the included allowance. Crucially, [Cloudflare's static-assets billing page](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) states that "Requests to static assets are free and unlimited" — so images, CSS, and fonts served alongside the HTML add nothing.

The R2 line comes from [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/) (verified 2026-08-24): $0.015 per GB-month of Standard storage, $0.36 per million Class B operations, $4.50 per million Class A operations, **egress free**, with a free tier of 10 GB-month and 10 million Class B operations. At 1000 Clients storing 240 MB each, that is 240 GB, less the 10 GB free, at $0.015 = $3.45; plus 15 million Class B operations, less 10 million free, at $0.36 per million = $1.80. Total $5.25 a month, or **$0.00525 per Client**. At 100 Clients the storage is 24 GB, of which 14 GB is billable, giving $0.21 a month or $0.0021 per Client. At 10 Clients the whole footprint fits inside the free tier and costs nothing.

The custom hostname line comes from [Cloudflare for SaaS plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/) (verified 2026-08-24), which prices custom hostnames at **$0.10 each per month with 100 included** on Free, Pro, and Business zone plans, up to a ceiling of 50,000. At 1000 Clients that is 900 billable hostnames at $0.10 = $90 a month, or $0.09 per Client. At 100 Clients it is free.

The domain line is [Porkbun's published `.com` price](https://porkbun.com/products/domains) (verified 2026-08-24) of **$11.08 per year for both registration and renewal**, with WHOIS privacy included free. $11.08 ÷ 12 = $0.923 per month.

**The wholesale price is verified, and it rises on a date ten weeks out.** Verisign's own [Form 10-Q filed 2026-07-23](https://www.sec.gov/Archives/edgar/data/1014473/000101447326000028/vrsn-20260630.htm) states that it "increased the annual registry-level wholesale fee for each new and renewal .com domain name registration from $9.59 to $10.26 effective September 1, 2024" and that "On April 23, 2026, we announced that we will increase the annual registry-level wholesale fee for each new and renewal .com domain name registration from **$10.26 to $10.97 effective November 1, 2026**." The same filing describes the mechanism: Verisign "is permitted to increase the price of a .com domain name registration by up to 7% in each of the final four years of each six-year period," the current period having begun 2024-10-26.

This corrects a common misreading. The increase is **not** annual and uninterrupted — there was no rise in 2025, because the six-year term opens with a two-year freeze. **2026-11-01 is the first increase of the new cycle, with three further ~7% increases permitted after it.** Straight-lining those gives roughly $11.74, $12.56, and $13.44 through 2029, but **that projection is an estimate, not a Verisign commitment.**

**Unconfirmed:** Cloudflare Registrar sells at cost — its page states it "does not mark up domain prices at all… customers only pay the price charged by registries and ICANN" ([Cloudflare Registrar](https://www.cloudflare.com/products/registrar/), verified 2026-08-24) — but **it publishes no `.com` figure anywhere public**; the price appears only in the dashboard. At-cost should be about **$10.44 today and $11.15 after 2026-11-01** ($10.26 or $10.97 plus the ICANN transaction fee), but that is **arithmetic on their stated policy, not a quoted price**. The ICANN fee itself, usually cited at ~$0.18, **could not be verified** — every ICANN registrar fee URL now 404s. Namecheap and GoDaddy prices could not be retrieved at all: both return HTTP 403 to automated fetching behind bot challenges, and GoDaddy's price grid is JavaScript-injected. Porkbun's $11.08 is used throughout because it is the cheapest figure actually verified at a primary source.

⚠️ **Do not trust Cloudflare's API sample response**, which shows `"registration_cost": "8.57"` for a `.com`. That is below wholesale and is a stale illustrative placeholder, not a price.

### What this means next to the rest of the cost of goods

| Per Client per month | Source |
|---|---|
| Site hosting, media, and SSL | **$0.01 – $0.10** (this document) |
| Domain, if advertdreams buys one | **$0.92** (this document) |
| Tracking Number | **~$8** ([#6](https://github.com/TempleZide/advertdreams/issues/6)) |
| Creative generation | ~2–3.5 cents per Creative set ([#7](https://github.com/TempleZide/advertdreams/issues/7)) |
| Ad Spend | the Tier price, essentially ([#9](https://github.com/TempleZide/advertdreams/issues/9)) |

Hosting is about one percent of the Tracking Number and a rounding error against Ad Spend. **No Tier boundary should be drawn around hosting.** If the Site is worth building, it is worth including at every Tier.

---

## What Meta actually requires of the Site

### The consistency rule is real, but narrower than the map assumes

Meta's Advertising Standards were reorganised, and the old standalone landing-page policies no longer exist as their own pages. `facebook.com/policies/ads` and `facebook.com/policies/ads/prohibited_content/nonfunctional_landing_page` both now 301-redirect to [transparency.meta.com/policies/ad-standards](https://transparency.meta.com/policies/ad-standards/), which is the canonical home. There is no page named "Landing Page Quality", "Ad Destination", or "Landing Page Consistency" among the current policies.

The consistency rule survives inside the **Relevance** section of that index page, which states (verified 2026-08-24):

> "Ads must clearly represent the company, product, service, or brand that is being advertised."
>
> "All ad components, including any text, images or other media, must be relevant to the product or service being offered."
>
> "The products and services promoted in an ad must match those promoted on the landing page."

The same page confirms that the destination is inside the scope of review:

> "This review process may include the specific components of an ad, such as images, video, text and targeting information, as well as an ad's associated landing page or other destinations, among other information."

and that approval is never final:

> "[Ads] are subject to review and re-review at all times, and may be rejected or restricted for violation of our policies at any time."

**Read that carefully: the rule is conditional.** It governs what a landing page must contain *if the ad has one*. Nothing in it obliges an ad to have a destination, and the Lead Ads that [#5](https://github.com/TempleZide/advertdreams/issues/5) made primary do not have one. **The map's justification for the Site — that Meta requires it regardless — does not hold, and [#21](https://github.com/TempleZide/advertdreams/issues/21) should not lean on it.** The practical consequence of the Relevance rule for advertdreams is narrower and easier: the Services advertised in a Creative must be Services the Site actually lists. Since both are generated from the same Intake record, that is close to free — but it does mean a Creative for a Service the Site does not mention is a policy violation, which is a real constraint on how Creative generation and Site generation are allowed to diverge.

### What actually gets an ad rejected at the destination

The substantive destination rules now live under **Spam**, which states that "Ads must not share Deceptive Links" ([Ad Standards: Spam](https://transparency.meta.com/policies/ad-standards/business-assets/spam/), verified 2026-08-24) and incorporates the [Community Standard on Spam](https://transparency.meta.com/policies/community-standards/spam/) by reference for the definition. From that Community Standard, the destination-side prohibitions are:

- **Cloaking** — "Any attempt to circumvent our content policies by intentionally presenting different off-platform content…"
- **Misleading Links** — "Content containing a link that promises one type of content but delivers something substantially different."
- Gating — "Websites that require an action (e.g. captcha, watch ad, click here) in order to view the expected landing page content and the domain name of the URL changes after the required action is complete, or automatically redirects users to a substantially different domain without any user action."
- Interstitials and traps — "Websites that have a misleading user interface, which results in accidental traffic being generated (e.g. pop-ups/unders, clickjacking, etc.). This includes tactics like trapping, where irrelevant pop-ups appear when a person attempts to leave the landing page."
- Impersonating domains — "An off-platform landing page, URL, or external website or domain that pretends to be a reputable brand or service by using a name, domain or content that features typos, misspellings or other means to impersonate well-known websites, domains or brands using a landing page similar to another, trusted site."

Separately, [Cybersecurity](https://transparency.meta.com/policies/ad-standards/business-assets/Cybersecurity/) forbids phishing, malicious code, and links that "cause an automatic download upon opening the landing page."

None of these are hard for a plain generated Site to satisfy. The design rules that fall out are: **no interstitial, no modal on load, no exit-intent pop-up, no cookie wall in front of the content, no redirect chain between the ad click and the page.** Those are worth writing into the Site templates as constraints rather than discovering later, because an exit-intent pop-up is exactly the kind of conversion-rate trick a marketing product drifts toward.

### Whose business the Site must appear to be

**No Meta policy could be found requiring the destination to identify the advertised business, match the Facebook Page name, disclose the agency, or live on the business's own domain.** A subdomain of a platform's domain is not addressed anywhere, favourably or otherwise.

What does exist is the mirror image — rules against pretending to be someone else. [Inauthentic Behavior](https://transparency.meta.com/policies/ad-standards/business-assets/inauthentic-behavior/) states that "Advertisers cannot create or use inauthentic assets to deceive Meta or our users about their identity or the origin, popularity, or purpose of their content," and the corresponding Community Standard prohibits acting to "Deceive Meta or our users about the identity, or origin of an audience or the entity that they represent."

So the obligation is negative, not positive. A Site that plainly presents the Client's own business, reached from an ad run on the Client's own Facebook Page, satisfies it. `joes-excavating.advertdreams.com` is fine. What would not be fine is a Site dressed to look like some other trusted brand — which is a content-generation constraint, not a hosting one, and one the claims-check pass recommended by [#8](https://github.com/TempleZide/advertdreams/issues/8) should already catch.

This is a **permissive** finding and it is the one that makes the cheap architecture viable. The subdomain default is not a compromise Meta merely tolerates; nothing in the policies prefers a custom domain at all.

### Domain verification

[Meta's domain verification documentation](https://developers.facebook.com/docs/sharing/domain-verification/) (verified 2026-08-24) describes it as a way "to claim ownership of your domain in Business Manager… to control editing privileges of your links and other content to prevent misuse of your domain." The [verification page](https://developers.facebook.com/docs/sharing/domain-verification/verifying-your-domain) gives three methods, and states that only one is needed:

- a DNS TXT entry on the domain's DNS record;
- an HTML file uploaded to the web root;
- a meta tag in the `<head>` of the domain's home page.

All three operate at the level of a registered domain and all three require control of infrastructure advertdreams would own under Architecture A. That is an argument for the subdomain default: **one verification of `advertdreams.com` is one operation, whereas a thousand Client-owned domains are a thousand.**

**Unconfirmed, and this is the most consequential gap in this document.** Four questions could not be answered from a primary source: whether domain verification is *required* at all for plain link-click traffic ads; whether a subdomain must be verified separately from its parent domain, or whether verifying the parent covers it; whether there is any cap on domains verified per Business Manager; and whether two Business Managers can verify the same domain. The answers live in Meta Business Help Center articles (notably `facebook.com/business/help/286768115176155`, whose title was confirmed but whose body is JavaScript-rendered and returned nothing). **If verifying the parent domain does not cover subdomains, Architecture A inherits a per-Client verification step and loses part of its advantage** — so this should be checked in a real browser session against a live Business Manager before [#21](https://github.com/TempleZide/advertdreams/issues/21) closes. It is a ten-minute check for someone logged in, and [#15](https://github.com/TempleZide/advertdreams/issues/15) will produce the Business Manager that makes it possible.

### Two smaller items

**HTTPS is not a citable Meta requirement.** No primary source stating an https requirement for ad destinations could be found; the [ad creative link reference](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-link-data/) describes `link` only as "Link url. This url is required to be the same as the CTA link url," with no protocol constraint. Treat TLS as an operational necessity — browsers will mark a plain-http page insecure and conversion will suffer — rather than a policy obligation. It is free under every architecture priced here, so the question is academic.

**The Lead Ads privacy policy is real but its constraints are not confirmed.** The [leadgen_forms reference](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/) describes `privacy_policy` as "The url and link_text of the privacy policy of advertiser." That is the only ownership language, and it does **not** say the URL must be on the advertiser's own domain. The reference also does not mark the field as required — the mandatory behaviour appears to be enforced by the Ads Manager form builder UI, which could not be read. Both "mandatory" and "must be the Client's own domain" are therefore **unverified**. If the URL may be on a domain advertdreams controls, then a per-Client privacy policy page on the Client's Site is a tidy way to satisfy it and is another small argument for the Site existing at all. This is worth confirming empirically alongside the URL-macro test that the map already defers.

---

## The Site's address: three options

### Option 1 — a subdomain of a domain advertdreams owns

`joes-excavating.advertdreams.com`, served by one wildcard Worker route.

**What the Client does:** nothing. The Site is live the moment their Intake is complete.

**What breaks:** nothing at the Client's end, because nothing at the Client's end is touched. Their existing website, if any, keeps working. Their email keeps working. There is no DNS record they can mistype.

**Who is stuck at churn:** nobody, and this is a genuine feature rather than a lock-in trick. The subdomain was never the Client's; it is switched off and the address is gone. There is no domain to transfer, no registrant to change, no 60-day lock. The Client loses nothing they had before signing up.

**Costs:** $0 marginal. Cloudflare's Universal SSL already covers `*.advertdreams.com`.

**The real drawbacks, and one is not obvious.** The visible one is that the address looks like a platform address rather than a business address, which some owners will care about and most will not notice. The non-obvious one is **shared reputation**: a thousand Clients on subdomains of one registered domain share one domain reputation with Meta, Google Safe Browsing, and every spam filter. One Client's Site carrying something abusive is a risk to all thousand. That argues for a domain used *only* for Client Sites, entirely separate from advertdreams' own marketing site and its email domain, so a reputation hit is contained to the Sites and does not take the company's email with it.

The related mitigation is the **Public Suffix List**. Its [guidelines](https://github.com/publicsuffix/list/wiki/Guidelines) describe the private section as being for exactly this case — platforms that "issue subdomains to mutually-untrusting parties" — and being listed makes browsers treat each Client subdomain as its own cookie and security origin. The requirements are a domain whose registration expires "more than 2 years beyond the submitting date of a PR", a `_psl.<domain>` DNS TXT record pointing at the pull request, and a clear description of the business model. The catch is the timeline: "There are NO SERVICE LEVEL AGREEMENTS ON TIME nor any expectation of processing speed or urgency." **If the subdomain architecture is chosen, submit the PSL entry early**, because it is free, it is a one-time action, and it cannot be hurried later when it turns out to matter.

### Option 2 — a domain the Client already owns, pointed at us

**What the Client does:** adds one DNS record at whoever manages their domain. For a subdomain like `offers.joesexcavating.com` this is a single CNAME pointing at an advertdreams hostname, and it is genuinely a small task — though "small" here means five steps through an unfamiliar control panel with several ways to fail silently. Trailing dots, `@` versus a blank host field, a conflicting record that already exists, TTL confusion, and DNS caches that make a correct change look broken for hours are all routine. Wix's own documentation is candid about where the Client ends up: for the pointing method, "we're unable to assist in case you have DNS issues" ([Wix: connecting a domain using the pointing method](https://support.wix.com/en/article/connecting-a-domain-to-wix-using-the-pointing-method), verified 2026-08-24). The Client will call advertdreams instead, so **this option converts a hosting decision into a support cost.**

**What breaks, and this is the whole problem with this option.** Two failure modes matter, and both are severe.

The first is **the apex domain**. If the Client wants the Site at `joesexcavating.com` rather than at a subdomain, a CNAME will not do — a CNAME cannot coexist with the SOA, NS, and MX records that always live at the apex. The apex must be an A record or a provider-specific synthetic ALIAS. Cloudflare for SaaS handles apex domains only through **apex proxying**, which its [own documentation](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/apex-proxying/) states is available to "certain customers" only, requires Cloudflare-assigned static IP prefixes with "cost associated, reach out to your account team", or BYOIP. **The apex is effectively not a self-serve path.** Steering every Client to a subdomain of their own domain — `offers.` or `get.` — avoids this entirely and should be the recommendation if this option is offered at all.

The second is **email**. If a Client changes their *nameservers* to point at advertdreams rather than adding a single record, every record not recreated on the new nameservers disappears: MX, SPF, DKIM, DMARC. Their email stops being delivered, usually silently on the inbound side, and nobody connects the outage to "the new website" for days. Squarespace's own documentation carries the warning verbatim: "Don't delete MX records during this process. MX Records connect your email address. Deleting them could interfere with your email service" ([Squarespace: adding a CNAME record](https://support.squarespace.com/hc/en-us/articles/205812378-Adding-a-CNAME-record-to-your-Squarespace-managed-domain), verified 2026-08-24). Vercel's documentation carries the equivalent warning for the nameserver method.

**Breaking a small business's email is a category of harm well beyond anything else in this product.** It is worse than a bad Creative, worse than a missed Lead, and it happens to a customer whose entire business runs through one inbox. If Option 2 is offered, the product must **never** ask a Client to change nameservers — only ever to add a single CNAME — and the onboarding flow should verify their existing MX records before and after and refuse to proceed if they change.

**Who is stuck at churn:** nobody is stuck, but the Client is left with a dangling DNS record pointing at a hostname that no longer serves anything. Their `offers.` subdomain will fail to resolve or serve an error until they remove the record, which they will not know to do. Offboarding needs to tell them, in plain language, which record to delete.

### Option 3 — advertdreams buys the domain on the Client's behalf

**What the Client does:** picks a name, or accepts one suggested for them. Nothing technical.

**Cost:** $0.92 per Client per month, which is roughly ten times the cost of everything else in this document combined.

**Who is stuck at churn — and this is the hazard.** A domain has a **registrant**, and ICANN considers the registrant the owner. If advertdreams is the registrant, advertdreams owns the Client's business name on the internet, and a Client who leaves either abandons a domain that may by then appear on their trucks and their business cards, or has to be walked through a transfer. If the Client is the registrant, they own it and can leave cleanly, but they also need an account somewhere and a way to pay for renewals after they churn — which is the very thing this option was supposed to spare them.

**Unconfirmed:** ICANN's Transfer Policy imposes a 60-day inter-registrar transfer lock after registration and, historically, a further lock after a change of registrant. **The primary source could not be verified** — `icann.org` returned HTTP 403 to every automated fetch attempt, including both the Transfer Policy page and the announcement of the policy update reported to have taken effect in late 2025. The 60-day figures are widely repeated but are **not confirmed here and must not be quoted to a Client**. Read the current Transfer Policy directly before writing any offboarding commitment into a contract.

This option also has a commercial edge that is not obvious. Registering a domain for a Client creates an **ongoing obligation that outlives the subscription**: the domain renews annually whether or not the Client is still paying, and letting it lapse hands their business name to a domain squatter. That is a liability, not an asset, and it interacts with the churn-and-chargeback item the map already lists as unspecified. **Do not offer this at v1.**

### Recommendation

Default to Option 1. Offer Option 2, subdomain-only and never at the apex, to Clients who explicitly ask for their own address. Do not offer Option 3 at v1.

---

## SSL for a large number of domains

The certificate itself is free everywhere. What costs something is the machinery of issuing and renewing thousands of them without anyone noticing when one fails.

### What breaks if advertdreams runs its own ACME

[Let's Encrypt's rate limits](https://letsencrypt.org/docs/rate-limits/) (page last updated 2026-08-05, verified 2026-08-24) are the binding facts:

| Limit | Value |
|---|---|
| New certificates per registered domain | **50 per 7 days** |
| New certificates per exact set of identifiers | 5 per 7 days |
| New orders per account | 300 per 3 hours |
| Authorization failures per identifier per account | 5 per hour |
| Consecutive authorization failures before account pause | 1,152 |
| Identifiers per certificate | 100 |

The **50-per-registered-domain** limit is scoped through the Public Suffix List, so a thousand *distinct* Client-owned domains each consume one of their own fifty and that limit never binds. It binds hard in the opposite case: a thousand subdomains of `advertdreams.com` all share one registered domain, and at 90-day certificate lifetimes the renewals alone would need roughly 117 certificates a week against a budget of 50. **Under Architecture A, per-subdomain certificates are simply not possible** — which is precisely why Architecture A uses a single wildcard covering `*.advertdreams.com` instead, reducing the whole estate to one certificate per renewal cycle. Cloudflare's Universal SSL provides that wildcard at no cost and no operational effort, so under Architecture A this entire section is moot.

For Architecture B, the limits that bite are different ones. **New orders at 300 per 3 hours** means cold-starting a thousand certificates takes about ten hours of paced issuance — fine, but the onboarding pipeline must queue and back off rather than retry-loop. **Authorization failures at 5 per identifier per hour** is the one that actually hurts: non-technical Clients misconfigure DNS constantly, every retry against an unpointed domain burns budget, and a naive retry loop across many broken domains walks toward the 1,152-consecutive-failure account pause, which would stop issuance for every Client at once.

Two further facts make running your own ACME worse than it used to be. **Let's Encrypt ended expiration notification emails on 2025-06-04** ([announcement](https://letsencrypt.org/2025/01/22/ending-expiration-emails/), verified 2026-08-24), so renewal monitoring is entirely the operator's problem — a silent renewal failure is a silent outage. And **certificate lifetimes are shrinking**: [Let's Encrypt's profiles documentation](https://letsencrypt.org/docs/profiles/) (verified 2026-08-24) offers 90-day, 45-day, and 160-hour profiles, and the CA/Browser Forum Baseline Requirements cap certificates at 100 days from 2027-03-15 and 47 days from 2029-03-15. **Renewal frequency roughly doubles in 2027 and quadruples in 2029.** Whatever renewal machinery gets built has to be untended, because it will run far more often than it does today. This is a "changes fast" item with dates already on the calendar.

### The managed options

| Product | Price | Notes |
|---|---|---|
| **Cloudflare for SaaS** | 100 hostnames included, then **$0.10/hostname/mo**, ceiling 50,000 | HTTP DCV auto-renews with no Client involvement after the first CNAME. Apex needs gated apex proxying. |
| **Vercel Pro** | **$20/mo per seat**, domains not metered | Docs state a soft limit of "100,000 domains per project for the Pro plan… flexible and can be increased upon request" |
| **Approximated** | **$0.20/domain/mo**, $20/mo minimum | Volume discounts from 1,000 domains, capped at 50% |
| **SaaS Custom Domains** | **$0.29/domain**, or 100 for $29/mo | Discounts to 50% between 100 and 15,000 domains |
| **Fly.io** | **$0.10/mo per single-hostname cert**, first 10 free per org | $1/mo per wildcard cert |
| **Render** | Hobby 2 / Pro 15 / Scale 25 free domains, then **$0.25/mo each** | Plan prices could not be read — the pricing page rendered without numbers |
| **Entri** | **From $249/mo** for 600 domain connections/yr | Everything above Startup is sales-gated |

Sources: [Cloudflare for SaaS plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/), [Vercel limits](https://vercel.com/docs/limits), [Approximated pricing](https://approximated.app/pricing), [SaaS Custom Domains](https://saascustomdomains.com/), [Fly.io pricing](https://fly.io/docs/about/pricing/), [Render static sites](https://render.com/docs/static-sites), [Entri pricing](https://www.entri.com/pricing) — all verified 2026-08-24.

**Cloudflare for SaaS is the right answer if Architecture B is ever needed**, at $90 a month for a thousand Client domains. Its decisive property is not the price but the renewal path: [Cloudflare's DCV documentation](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/issue-and-validate/validate-certificates/) (verified 2026-08-24) confirms that non-wildcard hostnames can use HTTP DCV for renewals automatically once traffic proxies through Cloudflare, meaning **the Client touches DNS exactly once, ever**, and advertdreams never runs ACME. For a product whose customers are explicitly non-technical, that is worth far more than the $90.

Vercel Pro at $20 flat with unmetered domains is cheaper on paper and worth a sales conversation, but the 100,000 figure is explicitly described as an anti-abuse soft limit, and a thousand-tenant white-label business is exactly the shape that gets routed to Enterprise sales. **Do not build on the documented number without written confirmation.**

One architectural limit worth recording, because it is easy to design into a dead end: **Cloudflare Pages is not a viable multi-tenant host at this scale.** Its [platform limits](https://developers.cloudflare.com/pages/platform/limits/) (verified 2026-08-24) cap custom domains per project at 100 on Free, 250 on Pro, and 500 on Business and Enterprise alike, with a maximum of 100 projects per account and 20,000 files per deployment on Free. A thousand Clients does not fit. Workers with static assets plus Cloudflare for SaaS custom hostnames does, at 50,000.

**Do not run an ACME fleet to save $90 a month.** The rate limits are survivable; the obligation to own a renewal-monitoring system that pages someone, forever, through two scheduled halvings of certificate lifetime, is not worth it for a solo-plus-one team.

---

## Media storage

### Assumptions and their arithmetic

| | Profile A (v1) | Profile B (future video) |
|---|---|---|
| Photos stored | 60 × 4 MB = 0.24 GB | 0.24 GB |
| Videos stored | — | 20 × 50 MB = 1.00 GB |
| **Total stored** | **0.24 GB** | **1.24 GB** |
| Page views/month | 1,500 at ~1.5 MB = 2.25 GB | 2.25 GB |
| Video views/month | — | 500 at ~15 MB = 7.50 GB |
| **Total egress** | **2.25 GB** | **9.75 GB** |
| Delivery requests | ~15,000 | ~15,500 |

**The 4 MB smartphone photo figure is an assumption, not a sourced benchmark.** Apple publishes no per-photo file size and the relevant support pages are JavaScript-rendered. It is a defensible upper bound — a 12MP HEIC typically lands well under it — so the model errs expensive.

**The 50 MB per 30-second clip is also conservative, and verifiably so.** [YouTube's official encoding recommendations](https://support.google.com/youtube/answer/1722171) (verified 2026-08-24) put 1080p at 30fps at 8 Mbps, which is about 30 MB for 30 seconds; 48–60fps is 12 Mbps, about 45 MB. The 50 MB figure implies roughly 13 Mbps, above YouTube's recommendation, so Profile B over-estimates video storage by around 1.6×. Phone originals do run hot, so it is kept — but it is the model's softest input, and the real figure will be lower.

The requests-per-page-view figure of ten is likewise **an assumption**. It only affects R2 Class B operation charges, which stay in the noise at these volumes.

### Where to put it

| Stack, marginal cost per Client per month | Profile A | Profile B |
|---|---|---|
| **Cloudflare Workers + R2** | **$0.009** | **$0.025** |
| Backblaze B2 | $0.017 | $0.069 |
| Bunny (HDD storage + Standard NA CDN) | $0.025 | $0.110 |
| S3 Standard + CloudFront | $0.212 | $0.873 |
| S3 direct, no CDN | $0.214 | $0.913 |
| Vercel (Fast Data Transfer + Blob) | $0.343 | $1.491 |
| Netlify (bandwidth alone, at 20 credits/GB) | $0.300 | $1.300 |

**Egress is the entire game.** Storing a quarter of a gigabyte is loose change everywhere; the spread between R2's $0.00 per GB of egress and Vercel's $0.15 is a ninety-fold difference in the bill for identical delivered bytes. R2's zero-egress pricing is confirmed on [Cloudflare's own pricing page](https://developers.cloudflare.com/r2/pricing/), with the caveats that the free tier applies to Standard storage only, that Infrequent Access carries a 30-day minimum duration and a $0.01/GB retrieval fee, and that usage rounds up to the next billing unit.

AWS numbers come from AWS's machine-readable price list rather than its pricing pages, which are JavaScript-rendered and returned nothing: [S3 US East](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonS3/current/us-east-1/index.json) (published 2026-08-18) gives S3 Standard at $0.023/GB-month, and [CloudFront pay-as-you-go](https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/) (verified 2026-08-24) gives $0.085/GB for US traffic beyond the free tier, with HTTPS requests at $0.0100 per 10,000.

**The AWS free tier is a trap worth naming explicitly.** CloudFront's always-free tier is 1 TB of egress per month, and it is scoped to the **account**, not the distribution. On Profile B a thousand Clients egress 9.75 TB, but the cliff arrives at about **105 Clients**. Below it, S3 plus CloudFront looks nearly free at $0.029 per Client. Above it, the same workload costs $0.776 per Client — a **27× step**, not a discount tapering off. At 1000 Clients on Profile B the comparison is $776 a month on S3 plus CloudFront against $20 on R2. **This is the reason not to start on AWS "because it's free at first."** It is free at first, and then it is twenty-seven times more per Client, at a threshold crossed without any warning.

Two operational notes for R2. Storage rounds up to the next billing unit, so giving each Client their own bucket could inflate the storage line roughly fourfold at 0.24 GB per Client — **use one bucket with per-Client prefixes**. And photos must live in R2 rather than in a Workers or Pages deployment bundle, both because of the file-count limits and because Site content should be redeployable without re-uploading a thousand Clients' media.

### Video

Managed video costs ten to fifteen times raw object storage and buys adaptive bitrate, per-view analytics, and DRM.

| Video portion only, per Client per month | 10 Clients | 100 Clients | 1000 Clients |
|---|---|---|---|
| Cloudflare Stream | $0.750 | $0.300 | $0.300 |
| Mux (1080p) | $0.000 | $0.000 | $0.160 |
| **Plain MP4 from R2** | **$0.004** | **$0.017** | **$0.020** |

[Cloudflare Stream](https://developers.cloudflare.com/stream/pricing/) charges $5 per 1,000 minutes stored and $1 per 1,000 minutes delivered, with ingress and encoding free. [Mux](https://www.mux.com/pricing) charges $0.003 per minute stored and $0.001 per minute delivered at 1080p, with 100,000 free delivery minutes a month and a $20 monthly usage credit — which covers roughly 400 Clients at this usage before falling off a cliff much like CloudFront's. Both verified 2026-08-24.

**Skip managed video for now.** The TikTok pipeline produces short vertical clips that do not need adaptive-bitrate ladders, and plain MP4 from R2 is an order of magnitude cheaper. Note the direction of the constraint, though: adding video is a *storage* problem, not a *hosting* problem, and it does not disturb the architecture. The map's requirement that nothing foreclose TikTok is satisfied — nothing here needs revisiting when video arrives.

**Flagged as unverified in this section:** the 4 MB photo size; ten requests per page view; Bunny Stream's regional bandwidth tiers (behind an unrendered calculator); Netlify's included bandwidth in GB and its Blobs storage price (absent from its pricing page); and the historical Backblaze–Cloudflare Bandwidth Alliance free-egress arrangement, which is not stated on Backblaze's current pricing page and should not be planned on.

---

## The non-technical owner

### Email is the thing that must not break

A US small-business owner-operator's email is often the single most load-bearing thing they own, and it is downstream of the same DNS zone as their website. Every failure mode in Option 2 above runs through it.

**Unconfirmed:** no credible primary figure could be found for what share of US small businesses use an `@gmail.com`-style address rather than one at their own domain. It is widely asserted to be a large minority; do not quote a number. What can be said from the [#8](https://github.com/TempleZide/advertdreams/issues/8) prototype's sample of real civil-construction businesses is that domain ownership among this cohort is inconsistent, which is itself an argument for the subdomain default: **the architecture should not assume the Client has a domain at all.**

**Unconfirmed:** Google Workspace's current US per-user prices could not be verified. `workspace.google.com/pricing` served Canadian dollars to an automated fetch, giving Starter at CA$9.20, Standard at CA$18.40, and Plus at CA$28.70 per user per month after an introductory discount, with "Save 16% with 1 year commitment." Microsoft 365 Business Basic pricing was not reached. These matter only as context for what a Client is already paying and none of them are inputs to advertdreams' cost.

### Clients who already have a Squarespace or Wix site

This is common and it is mostly good news, because it means the Client already has a web presence and the Site is competing with something rather than filling a void — a point [#21](https://github.com/TempleZide/advertdreams/issues/21) and [#25](https://github.com/TempleZide/advertdreams/issues/25) should both weigh.

Mechanically, **a subdomain can be pointed at advertdreams while the main site stays where it is**, on both platforms, because a CNAME on `offers.` does not disturb the apex. The record types are documented: Squarespace connects a third-party domain with a verification CNAME to `verify.squarespace.com` and a `www` CNAME to `ext.cust.squarespace.com` ([Squarespace docs](https://support.squarespace.com/hc/en-us/articles/205812378-Adding-a-CNAME-record-to-your-Squarespace-managed-domain), verified 2026-08-24); Wix's pointing method uses an apex A record to `185.230.63.107` and a `www` CNAME to `pointing.wixdns.net` ([Wix docs](https://support.wix.com/en/article/connecting-a-domain-to-wix-using-the-pointing-method), verified 2026-08-24). Neither platform's documentation addresses pointing a subdomain elsewhere, so **the specific click-path is unverified** and should be walked through on a real account before any Client-facing instructions are written.

The important consequence is a negative one. **If a Client already has a site at their apex, advertdreams must never take the apex.** Repointing it moves their root domain away from a site they are still paying for and that is still live at its provider, and now unreachable at their address. This is the second severe failure mode after email, and it has the same mitigation: subdomains only.

**Unconfirmed:** Squarespace acquired Google Domains in 2023 and a substantial number of small-business domains are now registered at Squarespace. Squarespace Domains' current renewal prices and its transfer-out process could not be verified. Squarespace and Wix's current plan prices could not be verified either. Since none of these are advertdreams' costs, they are context rather than inputs — but if [#25](https://github.com/TempleZide/advertdreams/issues/25) needs them for competitive positioning, they need a real look.

**Unconfirmed:** Google Business Profile's free website builder is reported to have been shut down in 2024, which would have created a cohort of small businesses whose only web presence disappeared. This could not be confirmed against Google's own documentation. If true it is directly relevant to demand for the Site, and worth confirming for [#25](https://github.com/TempleZide/advertdreams/issues/25) and [#27](https://github.com/TempleZide/advertdreams/issues/27) — a business that just lost its website is a warm prospect.

---

## Implications

1. **Cost does not constrain the website scope decision.** At one to ten cents per Client per month, the Site is cheaper than a single Creative generation run. [#21](https://github.com/TempleZide/advertdreams/issues/21) should decide what the Site is on product grounds — does it convert, does it sell, does it upgrade — with no cost input from this document except the domain.

2. **Remove the Meta justification from the map's standing constraint.** "Meta's landing-page-consistency rule requires [a Site] regardless" is not supported by any primary source. Meta constrains a landing page if one exists; it does not require one, and Lead Ads have no destination. The Site needs a product reason to exist. It is not hard to find one — [#5](https://github.com/TempleZide/advertdreams/issues/5) already established the hosted page as the higher-intent Lead variant with no App Review gate — but the reason should be that, not a policy that does not exist.

3. **The default address is a subdomain of a domain advertdreams owns.** Zero cost, zero Client action, zero DNS risk, zero email risk, clean churn. Use a domain dedicated to Client Sites and separate from advertdreams' own email domain, and submit it to the Public Suffix List early, because that queue has no SLA.

4. **Never ask a Client to change nameservers, and never take their apex domain.** Both break things that matter far more than the Site does — their email and their existing website respectively. If a custom domain is offered at all, it is a single CNAME on a subdomain, and onboarding should read their MX records before and after and refuse to proceed if they change. This is the most severe risk in this ticket and it is entirely avoidable by construction.

5. **Do not register domains on behalf of Clients at v1.** It is ten times the cost of everything else, it creates a renewal obligation that outlives the subscription, and the registrant question has no clean answer. It interacts with the churn item the map already lists as unspecified.

6. **The build is Cloudflare Workers with static assets, plus R2 with one bucket and per-Client prefixes.** Static asset requests are free and unlimited, Universal SSL covers the wildcard, and R2 egress is zero. Cloudflare Pages does not scale to this — 500 custom domains maximum — so if custom domains ever arrive, the path is Cloudflare for SaaS custom hostnames at $0.10 each beyond the first 100. This is a build-map detail, but it is worth recording that a cheap, boring answer exists so [#21](https://github.com/TempleZide/advertdreams/issues/21) does not have to hedge.

7. **One media store serves both Creative generation and the Site**, and the cost model above already assumes it. Nothing in the pricing changes if the same R2 bucket feeds the Creative pipeline from [#7](https://github.com/TempleZide/advertdreams/issues/7) and the Site. This answers the storage half of [#21](https://github.com/TempleZide/advertdreams/issues/21)'s question on cost grounds; rights and retention remain open and are not cost questions.

8. **Video does not disturb any of this.** Adding a TikTok pipeline raises the per-Client cost by about a cent and a half and changes no architectural decision, provided video is served as plain MP4 rather than through a managed video platform.

---

## Open risks

- **Meta domain verification for subdomains is unresolved, and it is the one gap that could cost real money.** If verifying `advertdreams.com` does not cover `joes-excavating.advertdreams.com`, Architecture A gains a per-Client verification step and part of its advantage. The answer is in a Business Help Center article that is JavaScript-rendered and unreadable to automated fetching. **Check it in a browser against the live Business Manager that [#15](https://github.com/TempleZide/advertdreams/issues/15) provisions.** Also unresolved from the same source: whether domain verification is required at all for plain link-click traffic ads, whether there is a cap on domains per Business Manager, and whether two Business Managers can verify the same domain.

- **Whether the Lead Ads privacy policy URL must be on the Client's own domain is unconfirmed.** If it must be, that is an argument for the Site — or a reason the subdomain default needs a second look. Confirm empirically alongside the URL-macro test the map already defers.

- **Shared domain reputation is a real tail risk with no clean fix.** A thousand Clients on one registered domain share one reputation with Meta, Google Safe Browsing, and every spam filter. One abusive Site endangers all of them. The PSL entry helps with browser-level origin isolation but does nothing for domain reputation. The mitigations are a dedicated domain isolated from company email, and the claims-check pass [#8](https://github.com/TempleZide/advertdreams/issues/8) already recommended. This is worth naming in [#14](https://github.com/TempleZide/advertdreams/issues/14) alongside ad-account ban containment, because it is the same class of problem.

- **Certificate lifetimes halve in 2027 and halve again in 2029** — 100 days from 2027-03-15 and 47 days from 2029-03-15 under the Baseline Requirements. Any renewal machinery must be untended. Under Architecture A with Cloudflare's Universal SSL this costs nothing; it is a reason not to drift into running ACME directly.

- **The `.com` wholesale price rises annually and could not be verified.** Verisign's own pricing page returned no figures and ICANN refused automated fetches. The $11.08 Porkbun retail figure is verified and is the number used; the at-cost figure Cloudflare Registrar would charge is not published outside its dashboard. This only matters if Option 3 is ever revisited.

- **ICANN's Transfer Policy could not be read from the primary source** — `icann.org` returns HTTP 403 to automated fetching. The 60-day transfer locks after registration and after a change of registrant are widely reported but unconfirmed here, and a policy update reportedly took effect in late 2025 whose contents are unknown. **Do not put any transfer commitment in a Client contract without reading the current policy directly.**

- **Vercel's unmetered-domains figure is an explicit anti-abuse soft limit.** At $20 flat it is cheaper than Cloudflare for SaaS at a thousand domains, but it is documented as "flexible and can be increased upon request," which is not a price. Do not build a thousand-tenant business on it without written confirmation.

- **Registrar DNS click-paths are unverified across the board.** GoDaddy, Namecheap, and ICANN all refused automated fetching; Squarespace and Wix were read but neither documents pointing a subdomain to a third party. Any Client-facing DNS instructions must be walked through on real accounts first, per registrar. This is the difference between a five-minute onboarding step and a support call.

- **Several media-model inputs are assumptions**: the 4 MB photo, ten requests per page view, and the 50 MB clip (which is demonstrably conservative against YouTube's own 8 Mbps recommendation for 1080p30). All of them err expensive, and none of them are large enough to move the conclusion — but instrument real usage on the first Clients rather than trusting the model.
