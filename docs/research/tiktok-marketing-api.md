# TikTok Marketing API: is adding TikTok later an addition or a rewrite?

Research for [#23](https://github.com/TempleZide/advertdreams/issues/23), parent map [#2](https://github.com/TempleZide/advertdreams/issues/2).
Verified against live TikTok documentation on **2026-08-24**.

This document is written to be read alongside [`meta-third-party-advertising.md`](./meta-third-party-advertising.md)
and [`meta-marketing-api-access.md`](./meta-marketing-api-access.md). The whole point of the ticket is whether the
Meta-shaped decisions already locked on this map survive TikTok being added, so every finding below is framed as a
comparison rather than as a standalone survey of TikTok.

## Question

The map fixes v1 as Meta-only with civil construction as the first Vertical, and requires that TikTok, video
Creative, and salons as a second Vertical remain addable — "no decision on this map may foreclose them." Is that
constraint actually satisfiable? Would adding TikTok later be an addition or a rewrite, and what would have to be
decided differently *now* to keep it an addition?

## Method and confidence

TikTok's documentation is genuinely thinner than Meta's, but the more immediate obstacle is that it is *harder to
read*, not sparser. Three separate access problems shaped this research and are worth recording, because anyone
re-verifying these claims with an ordinary fetch will conclude the docs do not exist:

- **`business-api.tiktok.com/portal/docs` is a fully client-rendered Next.js SPA.** Every documentation URL returns
  only a page shell (`{"props":{"pageProps":{}}}`) to any non-JavaScript fetch, including archive snapshots going
  back to 2023. This is the entire Marketing API reference — endpoints, parameters, creative specs, rate limits.
- **The workaround used here**: the portal fetches its own content from a public JSON gateway,
  `https://business-api.tiktok.com/gateway/api/doc/client/node/get/v2/?doc_id={id}`, which returns the full
  Markdown source of any documentation page, and
  `.../platform/tree/get/?identify_key=c0138ffadd90a955c1f0670a56fe348d1d40680b3c89461e09f78ed26785164b`, which
  returns the complete document tree for "TikTok Business API V1.3". **Everything in this document attributed to
  the Marketing API reference was read as raw source through that gateway**, not paraphrased from a mirror or a
  blog. Doc IDs are cited inline so each claim can be re-fetched.
- **`ads.tiktok.com/i18n/official/policy/*` and `tiktok.com/legal/page/global/*` are login-gated or
  client-rendered.** The binding advertiser contract — the TikTok Business Products Terms — could **not** be read.
  This matters for exactly one question (the Policy 10.5 analogue) and is flagged there rather than smoothed over.
  `ads.tiktok.com/help/article/*` fetches fine and is the source for the advertising-policy findings.

Findings are tagged **CONFIRMED** (quoted from a page fetched during this research), **INFERRED** (a reasonable
reading that no single page states outright), or **UNVERIFIED** (could not reach a primary source). No claim below
rests on a third-party blog post; where a subordinate research pass reported something only from a mirror or an
SDK repository, it was either re-verified directly against the gateway or dropped.

---

## Short answer

**Addition, not a rewrite — and by a wider margin than the map assumes.** Every load-bearing structural decision on
this map survives TikTok. Two of them survive because TikTok is *easier*, not merely compatible: TikTok does not
require the Client to own or grant any social account at all, and TikTok's landing pages can carry per-ad
attribution that Meta's cannot.

The specific answers the ticket asked for:

1. **Programmatic ad account creation, video and image upload, and campaign publishing on behalf of many
   small-business clients: yes, all of it.** `/bc/advertiser/create/` creates ad accounts programmatically and is
   explicitly available in the United States.
2. **The Business Manager equivalent is the Business Center**, which has a first-class `SELF_SERVICE_AGENCY` type.
   The agency owns the ad accounts it creates, and central funding requires that ownership.
3. **There is no documented analogue of Meta Developer Policy 10.5.** The phrase "end advertiser" returns **zero
   results** across the entire Marketing API documentation. Nothing forbids pooling — but one account per Client
   remains the right structure anyway, and TikTok makes it cheaper than Meta does.
4. **Approval gates are real and, unlike Meta, unavoidable** — this is the one decision on the map that does not
   port. See finding 3.
5. **Lead capture matches Meta and beats it**: Instant Forms carry `ad_id` per lead, and the real-time webhook
   delivers the full lead inline rather than an ID to go fetch.
6. **Static images do run on the TikTok placement**, via Carousel Ads — but only via that one route, with
   different specs and one new required asset (music). This is the finding most likely to be foreclosed by
   accident.
7. **TikTok's AI-content rule does not catch this pipeline**, for the same reason Meta's does not: nothing is
   generated, only composited.

What has to change on this map to keep it an addition is small, and it is listed in
[Implications for advertdreams](#implications-for-advertdreams). None of it is a product-shape reversal. The
largest item is a modelling decision about what a Creative *is*, and it costs nothing to get right now and a
schema migration to get wrong.

---

## Findings

### 1. Ads do not need the Client's TikTok account, or any TikTok account — CONFIRMED

This is the single most consequential difference between the two platforms, and it runs the easy way.

On Meta, every ad creative names a `page_id`, so a Client with no Facebook Page cannot be advertised for until one
exists and is granted to us with the `ADVERTISE` task. That constraint is the origin of the map's onboarding model
— "the product **guides them** through granting advertdreams Page access" — and of the drop-off risk the Meta
research flagged as "the real onboarding bottleneck."

TikTok has no equivalent requirement. Its analogue of the Page is the **Identity**, and one of the five identity
types is a virtual account that exists only to put a name and a face on an ad:

> Custom User (`CUSTOMIZED_USER`): This type of identity represents virtual TikTok accounts that are only used for
> displaying in-feed ads. This type of identities can be created via the `/identity/create/` endpoint. If you are
> not using Spark Ads, we still highly recommend you to pass in `identity_id` and `identity_type`
> (`CUSTOMIZED_USER`) for better management of ads information.

Source: [Identities, doc_id 1738958351620097](https://business-api.tiktok.com/portal/docs?id=1738958351620097)

The other four are `AUTH_CODE` (a post or account authorised by its owner), `TT_USER` (your own bound TikTok
Business Account), `BC_AUTH_TT` (a TikTok account added to your Business Center and approved by its owner), and
`TTS_TT` (a TikTok Shop's official account). The last three are the Spark Ads path — running ads from real organic
posts — and they do require the Client to own an account and approve a request, exactly like Meta's asset grant.

But `CUSTOMIZED_USER` requires nothing from the Client. `POST /open_api/v1.3/identity/create/` takes precisely
three parameters: `advertiser_id`, a `display_name` of up to 100 characters, and an optional square `image_uri`
uploaded through `/file/image/ad/upload/`. If no image is passed, "a default image will be used as the avatar."

Source: [Create an identity, doc_id 1740654203526146](https://business-api.tiktok.com/portal/docs?id=1740654203526146)

So a Client who has never heard of TikTok can be advertised for on TikTok within one API call, from their business
name and logo. There is no grant to walk them through, no admin to click approve, and no asynchronous approval to
wait on. The step that the Meta research identified as the highest-drop-off moment in onboarding **does not exist
on TikTok**.

That is good news that carries a trap, and it is the first thing this map has to decide differently. See
implication B.

### 2. Business Center, agency type, and programmatic ad account creation — CONFIRMED

TikTok's container is the **Business Center**, described as "a central hub that allows organizations and agencies
to efficiently manage multiple TikTok ad accounts, users, assets, and finances in a secure environment." It holds
advertiser accounts, TikTok accounts, Shops, pixels, catalogs, audiences, leads, and members and partners.

Critically, agency operation is a named first-class type rather than a convention. The `type` field returned by
`/bc/get/` takes five values:

> - Regular Business Center (`NORMAL`)
> - Non-self-serve Direct Business Center (`DIRECT`)
> - Non-self-serve Agency Business Center (`AGENCY`)
> - Self-serve Direct Business Center (`SELF_SERVICE`)
> - Self-serve Agency Business Center (`SELF_SERVICE_AGENCY`)

Source: [Business Center Overview, doc_id 1739562432184322](https://business-api.tiktok.com/portal/docs?id=1739562432184322)

`SELF_SERVICE_AGENCY` is the shape advertdreams needs, and the naming is a good sign: TikTok anticipated a
self-serve agency operating many small advertisers, which is exactly the business.

**Ad accounts are creatable by API**, which is a meaningful improvement over Meta. `POST /bc/advertiser/create/`:

> Use this endpoint to create an auction ad account in the **Agency** or **Direct** Business Center. You need to be
> an Admin user of the Business Center.

The quota language is far more generous than the documented 5-account API creation cap that
[#18](https://github.com/TempleZide/advertdreams/issues/18) left open as an unresolved onboarding risk on Meta:

> The endpoint does not support creating multiple ad accounts simultaneously in one Business Center. Please create
> ad accounts one by one instead. **Each user can create a maximum of 10,000 ad accounts across all Business
> Centers.** Additionally, there are daily and total ad account creation quotas for each Business Center, which
> vary based on the Business Center type.

The United States is explicitly in the list of supported registration countries. Agency Business Centers must
supply `qualification_info` with a `promotion_link` — "The value must be the company's website URL" — which is one
more place a real company website is a hard prerequisite. Business licence images are required only for accounts
registered in the Chinese mainland, Hong Kong, France, Brazil or Mexico, so a US book does not need them.

Source: [Create an ad account, doc_id 1739939020318721](https://business-api.tiktok.com/portal/docs?id=1739939020318721)

**Central funding works and requires ownership.** TikTok's Payment Portfolio supports "account level cash balance
and credit line sharing across multiple ad accounts under the same entity name" in Advanced mode, with manual
allocation in Standard mode
([Payment Portfolio help article](https://ads.tiktok.com/resources/help/article/about-payment-portfolio?lang=en)).
The gate is that the Business Center must *own* the ad account — created it, or received an ownership transfer —
rather than merely having partner access
([Agency Business Center payment](https://ads.tiktok.com/resources/help/article/manage-payment-agency-business-center?lang=en)).
Since advertdreams creates every account through `/bc/advertiser/create/`, it owns every account, and the map's
"Ad Spend is funded by advertdreams" decision ports unchanged.

One gate worth naming: the Business Center API is itself allowlisted. TikTok's own FAQ says the create endpoint
works "without applying for allowlisting **if you have been allowlisted for the Business Center API**"
([BC FAQs, doc_id 1739562436183041](https://business-api.tiktok.com/portal/docs?id=1739562436183041)). The
requirements for that allowlisting are not published — **UNVERIFIED**.

### 3. There is no Policy 10.5 analogue, but there *is* an approval gate Meta does not have — CONFIRMED

**On pooling: nothing found, with one honest caveat.** Meta Developer Policy 10.5 — "Don't combine multiple end
advertisers or their Meta business assets in the same ad account" — is the rule that forced the map's per-Client
account structure. Searching the complete TikTok Marketing API documentation tree through the content gateway,
**the phrase "end advertiser" returns zero results.** TikTok's public
[Advertiser Account Policy](https://ads.tiktok.com/help/article/actor-policy) covers platform manipulation,
misleading business approach, deceptive identity, financial integrity and information security, and contains
nothing about account separation, agency structure, or one advertiser per account.

**Caveat, stated plainly:** the binding contract is the TikTok Business Products Terms, and it is behind a login
wall. `ads.tiktok.com/i18n/official/policy/business-products-terms` redirects to "TikTok Ads: Log In" and
`tiktok.com/legal/page/global/*` renders client-side. That document is the most plausible home for an agency
authorisation or separation clause, and it was **not read**. The correct statement is therefore: *no separation
rule exists in any TikTok documentation that can be read without an advertiser login*, not *no such rule exists*.
This needs a human with a logged-in browser, and it belongs in the same provisioning ticket as Meta's
bot-blocked Help Center checks.

**On access: this is the decision that does not port.** [#18](https://github.com/TempleZide/advertdreams/issues/18)
resolved that Meta needs no App Review, because advertdreams owns every ad account and no Client ever holds a token
— Standard Access is auto-granted and advertdreams can start today. **TikTok has no such exemption, and its review
is not conditioned on managing anyone else's accounts.** There are two sequential gates:

**Developer registration** requires a company-domain email — "You will be rejected if you are using a personal
email or a temporary email" — a user type (Technology Company, Direct Advertiser, or Agency), and a company website
that must be "publicly accessible... valid, functioning, fully developed and professionally presented... hosted on
a domain that is owned by your company." The document is unambiguous about solo builders:

> Be a company website, rather than a personal website. **Currently, we are unable to onboard personal accounts or
> individual developers.** If you are part of a company, please use your company website.

> You will be notified of the review result in three business days.

Source: [Register as a developer, doc_id 1738855176671234](https://business-api.tiktok.com/portal/docs?id=1738855176671234)

**Developer app review** then follows, with permission scopes chosen up front and justified in prose:

> You have now submitted your developer application for review. **The review may take 2 to 3 business days.** ...
> If your application is rejected, you can edit the request and submit it again. Once the app is approved, you can
> use the authorization code to get a long-term access token.

Each developer may hold up to five apps. Scope changes are self-serve to request but also reviewed, "between two
and three business days."

Sources: [Create a developer app, doc_id 1738855242728450](https://business-api.tiktok.com/portal/docs?id=1738855242728450),
[App permissions, doc_id 1738855280338946](https://business-api.tiktok.com/portal/docs?id=1738855280338946)

Neither review is long. But together they mean **the "no gate, start immediately" property that #18 established
for Meta is Meta-specific**, and that the registered legal entity and real company website which Meta's Business
Verification needs *eventually* are what TikTok needs *before the first API call*. This does not change a product
decision. It changes when provisioning starts. See implication D.

Two scopes carry extra gates beyond ordinary app review, neither of which advertdreams needs for the shape
described on this map: Business Messaging requires a Data Security and Privacy Review taking "2-4 weeks" with "no
exceptions", and from 20 March 2026 the "TikTok Accounts" scope requires a separate application form before an app
can be submitted or a scope increased.

**Business verification** applies at the Business Center level and cascades — "Verifying a Business Center verifies
its ad accounts" — is triggered by an unpublished, country-varying spend threshold, and unlike Meta carries a
published SLA: "which may take up to two business days"
([mandatory business verification](https://ads.tiktok.com/resources/help/article/about-mandatory-business-verification-for-businesses)).

**The token is better than Meta's.** There is no System User concept, but there does not need to be:

> A long-term access token is a type of token that you can obtain after receiving authorization from an ad account,
> **a Business Center account**, or a TikTok One Creator Marketplace account. **The token does not expire.**

Source: [Obtain a long-term access token, doc_id 1739965703387137](https://business-api.tiktok.com/portal/docs?id=1739965703387137)

There is no `refresh_token` in the response and no documented expiry, so the refresh problem disappears entirely —
compare Meta's Policy 10.4, where access decays after 30 days of non-use and the map's answer was a cron'd
keep-alive read. The cost is a one-time interactive step: a Business Center Admin visits the app's authorisation
URL, approves the scope list, agrees to the Platform Service Agreement, and enters an emailed verification code
([Marketing API authorization, doc_id 1738373141733378](https://business-api.tiktok.com/portal/docs?id=1738373141733378)).
Since advertdreams is its own Business Center Admin, that is a setup step, not an onboarding step.

**INFERRED, and worth verifying empirically:** whether a Business Center Admin's existing token automatically
reaches ad accounts created *after* the authorisation. The documentation never states it, but the corresponding
error — "Insufficient advertiser permission... The advertiser... does not have access to the corresponding ad
accounts in Business Center or the advertiser is not the owner of the ad account"
([Authorization FAQs, doc_id 1766037914914818](https://business-api.tiktok.com/portal/docs?id=1766037914914818)) —
is framed around the authorising user's access rather than around when the account was created, which suggests it
does. If it does not, every new Client would need a fresh OAuth round trip, and that *would* be an onboarding
problem. Cheap to settle with one API call once an account exists; do not assume it.

### 4. Rate limits and the sandbox are both substantially better than Meta's — CONFIRMED

Meta's Limited tier gave a burst score of 60 with writes costing 3 points — roughly 20 writes before throttling,
replenishing over five minutes — scoped per ad account, which the Meta research called "the single most important
set of numbers in the ticket" and which forced publishing to be designed as a paced, serialised queue.

TikTok's limits are per developer app and per endpoint, and they are not close:

| Level | QPS | QPM | QPD |
|---|---|---|---|
| Basic (default) | 10 | 600 | 864,000 |
| Advanced | 20 | 1,200 | 1,728,000 |
| Premium | 30 | 1,800 | 2,592,000 |
| Ultimate | 50 | 3,000 | 4,320,000 |

Endpoint limits are independent of each other — "if the rate limits for `/campaign/get` endpoint are reached for a
developer app, the developer app can still make requests to `/ad/get/` endpoint" — and `/ad/create/` alone allows
5 QPS / 150 QPM / 86,400 QPD at the default Basic level. Upgrades are a self-serve application, one level at a
time, with a written reason. Throttling returns `40100` (app level) or `40133` (advertiser level); QPM recovers in
five minutes, QPD at 00:00 UTC.

Source: [Rate limits, doc_id 1740029171730433](https://business-api.tiktok.com/portal/docs?id=1740029171730433)

The paced publish queue that Meta forces will be enormously over-provisioned for TikTok. That is fine — it is the
right design either way and costs nothing to reuse — but it should not be read backwards into TikTok as a
constraint that exists there.

**The sandbox is the reverse of Meta's.** Meta's sandbox explicitly "cannot create ads or ad creative," which the
Meta research identified as forcing all real testing onto a live ad account with paused campaigns. TikTok's
sandbox, at `https://sandbox-ads.tiktok.com/open_api`, supports "most of the API endpoints that are currently
provided in the production environment," inherits the app's scopes automatically, and provides mock reporting
data. The supported list explicitly includes `/ad/create/`, `/adgroup/create/`, `/campaign/create/`,
`/file/image/ad/upload/`, `/file/video/ad/upload/` and `/identity/create/` — precisely the creative-assembly half
that Meta's sandbox refuses. Sandbox limits are 1 QPS / 30 QPM / 1000 QPD per endpoint.

Source: [Sandbox accounts, doc_id 1738855331457026](https://business-api.tiktok.com/portal/docs?id=1738855331457026)

### 5. Lead capture matches Meta's Lead Ads and improves on the webhook — CONFIRMED

The map's lead-capture decision rests on Lead Ads being "the only mechanism carrying per-lead campaign attribution
(`ad_id`) and a real-time `leadgen` webhook." Both properties exist on TikTok.

**Instant Forms** are TikTok's instant-form product, reached by setting `promotion_type` to `LEAD_GENERATION` and
`promotion_target_type` to `INSTANT_PAGE`. Five optimisation locations exist: Instant Form, Website, TikTok direct
messages, instant messaging apps, and **phone call** — the last being a native equivalent of the click-to-call
path that Meta's research found returns nothing at all.

**Real-time delivery is a genuine webhook**, and its payload is richer than Meta's:

> Webhooks are automated HTTP callbacks that are triggered when specific events occur within the TikTok platform...
> This mechanism eliminates the need for constant API polling to retrieve information about asynchronous events.
> Instead, TikTok proactively sends event data to your system as soon as it becomes available.

> Once subscribed, you'll receive webhook notifications every time a new lead is submitted or collected.

Subscription is `POST /subscription/subscribe/` with `subscribe_entity` set to `LEAD` and either an
`advertiser_id` (all Instant Form leads for that ad account) or a `library_id` (all leads for a form library
within a Business Center), optionally narrowed by `page_id`. The delivered payload carries the lead identifiers
**and the full submitted field values inline** — `id`, `lead_source`, `page_id`, `advertiser_id`, `campaign_id`,
`campaign_name`, `adgroup_id`, `adgroup_name`, `ad_id`, `ad_name`, `create_time`, plus the answers. Meta's
`leadgen` webhook delivers only a `leadgen_id` that must then be fetched. Delivery is at-least-once — "incorporate
safeguards against processing duplicate events by designing your event handling to be idempotent."

Source: [Subscribe to ad account Webhook events, doc_id 1810521739537409](https://business-api.tiktok.com/portal/docs?id=1810521739537409)

Bulk retrieval also exists as a create-task, poll, download-CSV flow (`/page/lead/task/` then
`/page/lead/task/download/`), region-sharded — US leads require an `x-lead-region: us` header or they will not be
returned. The download artefact expires ten minutes after generation.

**The access grant is role-based rather than a separate consent surface.** Meta's Leads Access Manager is a second,
independent grant on the Client's Page which can silently withhold leads even from a working ad — the failure mode
the map calls out as "breaks the product silently." TikTok's equivalent is simply Business Center administration:
only ad account or Business Center Admins can create lead download tasks or subscribe to lead webhooks. Since
advertdreams is the Admin of every account it created, that grant is automatic and cannot be forgotten by a
Client. **One entire category of onboarding failure disappears.**

**One real integration cost, and it is the only awkward thing in the lead path.** Instant Forms cannot be created
by a REST call. They are built with the **TikTok Instant Page (TIP) Editor SDK**, a browser JavaScript SDK, with
`businessType` set to `1`; `/page/get/` then retrieves the resulting `page_id` for use in an ad
([Instant pages, doc_id 1739953260466178](https://business-api.tiktok.com/portal/docs?id=1739953260466178)).
Meta's lead forms can be created server-side through the Graph API. Generating a per-Client, per-Vertical lead form
on TikTok therefore means driving a browser SDK rather than posting JSON — which, given the map's creative pipeline
already runs headless Chromium to composite images, is an existing capability rather than a new one, but it is a
different shape of work and should not be discovered late.

### 6. Static images do run on the TikTok feed — via Carousel Ads, and only via Carousel Ads — CONFIRMED

This is the finding that decides whether the map's current pipeline is enough, and it needs to be stated precisely
because the obvious answer is wrong in both directions.

**The wrong optimistic answer** is that TikTok has a "single image" ad format. It does, but that format is not
available on TikTok:

> This article walks you through the steps to create single image ads **on Pangle or Global App Bundle placement.**

Only `PLACEMENT_PANGLE` and `PLACEMENT_GLOBAL_APP_BUNDLE` appear anywhere in that document; `PLACEMENT_TIKTOK`
appears nowhere in it. Global App Bundle is further limited to Brazil, Indonesia, Japan, Malaysia, Mexico, the
Philippines, Saudi Arabia, Thailand and Vietnam — **not the United States**. Several Pangle image resolutions are
allowlist-only.

Source: [Create single image ads, doc_id 1777633230937090](https://business-api.tiktok.com/portal/docs?id=1777633230937090)

**The wrong pessimistic answer** is that the TikTok placement is video-only. TikTok's public ad-specifications help
article lists nothing but video, and its
[Ad Format and Functionality Policy](https://ads.tiktok.com/help/article/tiktok-ads-policy-ad-format-and-functionality)
says "Ad content must be dynamic. Do not rely on static or still images as the primary element in your ad." Both
of those are real, and together they are why this is easy to get wrong.

**The correct answer is Carousel Ads:**

> Carousel is a new ad format on TikTok that **supports images for in-feed ads**. Multiple images will be displayed
> in order, and run as a carousel.

Standard Carousel Ads run on the TikTok placement itself — `placement_type` of `PLACEMENT_TYPE_AUTOMATIC`, or
`PLACEMENT_TYPE_NORMAL` with `PLACEMENT_TIKTOK` included — and support the `LEAD_GENERATION` objective alongside
App Promotion, Website Conversions, Traffic and Reach. The creative requirements:

> **one to 35 images** supported in the Carousel Ad... The image to be used in Carousel Ads should meet the
> requirements below at the same time: Specifications: File Type: JPG, JPEG, or PNG. **Image Resolution: a maximum
> of 1242 x 2340 pixels or 2340 x 1242 pixels. Aspect Ratio: a maximum of 9:20 or 20:9. File Size: below 50 MB.**
> The value of the parameter `is_carousel_usable` returned from `/file/image/ad/search/` for the image is `true`.

Source: [Create Carousel Ads, doc_id 1766217791987713](https://business-api.tiktok.com/portal/docs?id=1766217791987713)

And crucially, the identity accepted for a non-Spark Standard Carousel Ad is `CUSTOMIZED_USER`, `TT_USER` or
`BC_AUTH_TT` — the virtual identity from finding 1 is explicitly permitted.

**The whole v1 shape composes.** The Lead Generation Instant Form document confirms the combination directly:

> Ad format: Any of the following types: Single video, **Carousel images**. Note: To set ad format to Carousel
> images, you need to specify the placement as Automatic Placement or Select Placement **with TikTok placement
> included** at the ad group level.

Source: [Lead Generation ad with optimization location as Instant Form, doc_id 1774482920012801](https://business-api.tiktok.com/portal/docs?id=1774482920012801)

So: `LEAD_GENERATION` objective → `INSTANT_PAGE` promotion target → `PLACEMENT_TIKTOK` → `ad_format` of
`CAROUSEL_ADS` → static JPEGs → `CUSTOMIZED_USER` identity. The entire advertdreams v1 product runs on TikTok with
the pipeline that exists, no video, and nothing required from the Client.

**Three differences the pipeline would have to absorb**, none of them structural:

1. **Resolution.** The prototype emits 1440x1800. The carousel maximum is 1242 wide in portrait, so 1440 is out of
   spec. 1080x1350 preserves the 4:5 composition and fits. This is a render parameter, not a redesign — but note
   the direction of the constraint is opposite to Meta's, which imposes a 600x750 *minimum*. A pipeline that only
   knows about minimums will silently produce rejected TikTok creatives.
2. **Music is required.** A Standard Carousel Ad takes a `music_id`, obtainable from TikTok's own library by
   filtering `/file/music/get/` with `music_scene` set to `CAROUSEL_ADS`, or by uploading a custom track. A
   library lookup is trivial work, but it is a **new required asset class that the Meta model of a Creative has no
   place for.** This is the concrete reason for implication A.
3. **Aspect ratio is a quality problem, not a compliance one.** 4:5 is legal on a 9:16 feed and will letterbox.
   Combined with TikTok's own "do not rely on static or still images" guidance, the honest position is that static
   carousel Creative is *permitted and publishable* but is not what TikTok's ranking and its users reward. The
   constraint the map set — TikTok must remain addable — is satisfied. Whether static TikTok ads will *perform*
   for salons is a separate question this research cannot answer and should not pretend to.

Video, when it comes, is `ad_format` of `SINGLE_VIDEO` with a `video_id` from `/file/video/ad/upload/`, and the
published TikTok ad specifications are 9:16 at ≥540x960 (or 16:9 at ≥960x540, or 1:1 at ≥640x640), .mp4/.mov/
.mpeg/.3gp/.avi, up to 10 minutes, ≤500 MB, ≥516 kbps
([TikTok Ad Specifications](https://ads.tiktok.com/help/article?aid=10002742)). TikTok's Smart Creative tool
recombines existing videos and images into variations but does **not** generate video from a still
([Smart Creative](https://ads.tiktok.com/help/article/smart-creative)); the older Smart Video and Quick
Optimization endpoints are marked deprecated in the API docs. **UNVERIFIED**: TikTok Symphony, TikTok's generative
creative suite, could not be reached at any URL tried and should not be counted on.

### 7. TikTok's AI-content rule does not catch this pipeline — CONFIRMED

The map's creative decision — composite over the Client's authentic job photographs rather than generate imagery,
because "the real photo is the product claim" — was made partly on quality grounds and partly because Meta imposes
no general commercial AI-disclosure requirement. TikTok's rule is more explicit than Meta's, and read literally it
lands on the same side.

Under *Edited media and AI-generated content (AIGC)*:

> We welcome the creativity that new artificial intelligence (AI) and other digital technologies may unlock.
> However, AI and other digital editing technologies can make it difficult to tell the difference between fact and
> fiction, which may mislead individuals or harm society. Significantly edited media and AIGC content is allowed if
> the following requirements are met: **Apply the AIGC label, or by adding a clear disclaimer, caption, watermark,
> or sticker of your own.**

> When we say significantly modified by AI, we mean content that has been changed by AI beyond minor tweaks or
> enhancements. This includes using real images or videos as source material but altering them substantially with
> AI, such as: Content that contains images, video, or audio that are **completely AI-generated**; Showing the
> primary subject doing something they didn't actually do, like dancing; Making the primary subject say something
> they didn't actually say, using AI voice-cloning.

> Insignificant AI edits are minor tweaks or enhancements changed by AI, such as: Adjustments to lighting,
> brightness, or color saturation; Removing or modifying backgrounds; Denoising images to reduce noise levels.

> If we identify AI-generated content that has not been disclosed, your ad will be rejected or restricted.

Source: [Misleading and false content](https://ads.tiktok.com/help/article/tiktok-ads-policy-misleading-and-false-content)

The pipeline the prototype validated uses a model for photo triage and copy, and renders text over an
**unmodified** photograph with CSS. No model touches the pixels of the Client's photo. That is not "significantly
modified by AI"; it is not modified by AI at all. Even the most aggressive future step the map contemplates —
editing a Client photo through a mask-capable endpoint — would sit close to the "removing or modifying
backgrounds" example on the *insignificant* list, though not identically.

Two things follow, and the second is the one that matters:

- **The current decision ports with no disclosure obligation.** TikTok's policy is stricter than Meta's on paper
  and still does not reach this pipeline.
- **A generated-video pipeline would land squarely inside it.** "Content that contains images, video, or audio
  that are completely AI-generated" is the first named example, and generating video from a Client's stills is
  exactly that. So the pressure that "add TikTok" creates — *we need video, let's generate it* — is precisely the
  move that turns a policy non-issue into a mandatory AIGC label on every ad. Worth recording before anyone
  proposes it.

**UNVERIFIED**: TikTok's Branded Content Policy was fetched and contains no mention of AI-generated content;
TikTok's C2PA / Content Credentials adoption could not be confirmed at any newsroom URL tried; and the Community
Guidelines' synthetic-media section could not be retrieved. None of these change the ads-policy answer above,
which comes from the advertising policy itself.

### 8. Landing-page attribution: TikTok can do what Meta cannot — CONFIRMED

The map records that the hosted page "is the higher-intent variant and has no App Review gate, but cannot prove
which ad produced a Lead," and carries an open item noting that per-Lead attribution on our own page "depends on
Meta URL macros that could not be verified from primary sources," to be settled empirically.

On TikTok this is documented and unambiguous. The ad-creation reference lists the macros substituted into
destination and deeplink URLs at delivery:

> The supported macros are: `__CAMPAIGN_NAME__`: This will be replaced by your campaign name. `__CAMPAIGN_ID__`:
> This will be replaced by your campaign ID. `__AID_NAME__`: This will be replaced by your ad group name. `__AID__`:
> This will be replaced by your ad group ID. `__CID_NAME__`: This will be replaced by your ad name. `__CID__`: This
> will be replaced by your ad ID. `__PLACEMENT__`: This will be replaced by your placement.

Source: [Create ads, doc_id 1739953377508354](https://business-api.tiktok.com/portal/docs?id=1739953377508354)

Note the naming trap, which will cause a silent mis-attribution bug if missed: **`__AID__` is the ad *group* ID and
`__CID__` is the *ad* ID.** Neither means what its abbreviation suggests to someone coming from Meta's vocabulary.

The practical consequence is that a hosted landing page on TikTok can carry full ad-level attribution with no API
call, simply by appending the macros to `landing_page_url` at ad-creation time. The map's statement that the hosted
page "cannot prove which ad produced a Lead" is a fact about Meta, not a property of hosted pages — and if that
limitation gets baked into the Lead model as a general truth, TikTok will arrive carrying attribution the system
has nowhere to put. See implication C.

Separately, `ttclid` exists as TikTok's click ID for Events API conversion matching, but it is a write-only signal
handed back to TikTok — no documented endpoint resolves it to an `ad_id`. The macros, not `ttclid`, are the
attribution mechanism for our own pages.

---

## Implications for advertdreams

**The judgement: addition, not a rewrite.** Nothing on this map has to be reversed. What follows are the specific
decisions that must be *taken differently now* — all of them cheap today and expensive as migrations later.

**A. A Creative must not be modelled as "an image plus ad copy."** `CONTEXT.md` currently defines it that way, and
on Meta that definition is complete. On TikTok the same Creative needs a differently-sized image set (≤1242 wide
against Meta's 1440), a `music_id`, and an `ad_format`. **Model a Creative as ad copy plus a set of
platform-specific renditions, even though v1 emits exactly one rendition for exactly one platform.** This is the
single highest-value change in this document: getting it wrong means a schema migration and a rewrite of the
publishing path, and getting it right costs one level of indirection that is invisible while there is only Meta.
This should be reflected in `CONTEXT.md` and probably deserves an ADR.

**B. A Client's social account must be optional, per platform.** The map states that "ads run from the Client's own
Facebook Page, granted to advertdreams as a client asset." That is correct and should not change — but it is a
Meta fact, and finding 1 shows TikTok requires nothing equivalent. If onboarding treats "granted social account" as
a precondition for a Client to go live, or if the data model makes it a required field, TikTok Clients will block
on a step that does not exist for them. **Decide now that the social-account grant is a per-platform, optional
onboarding step, and that the "being set up" state can complete without one.** The corollary is a genuine
commercial upside worth relaying: a salon with no TikTok presence at all can be advertised for on TikTok on day
one, which is a materially easier sell than the Meta onboarding the map currently describes.

**C. Lead attribution must not assume "instant form or nothing."** The map treats per-lead `ad_id` as a property
unique to Lead Ads and absent from hosted pages. Finding 8 shows TikTok substitutes ad, ad group and campaign IDs
into hosted-page URLs at click time. **Model a Lead as carrying platform-agnostic campaign / ad group / ad
identifiers populated by whichever mechanism supplied them** — instant form, webhook, URL macro, or tracking
number — rather than as "attribution exists only on the Lead Ads path." Otherwise TikTok's hosted-page Leads arrive
with attribution the schema cannot record.

**D. TikTok access has lead time that Meta's does not, and it starts with the company.**
[#18](https://github.com/TempleZide/advertdreams/issues/18) established that Meta needs no App Review and
advertdreams can begin immediately. That property does not transfer. TikTok requires a company-domain email, a
real company website, developer registration review (three business days), app review (two to three business
days), Business Center API allowlisting on unpublished criteria, and — for an Agency Business Center — a company
website URL as `promotion_link` on every ad account created. **This does not change a v1 decision. It changes
when the entity and the website have to exist**, and it converges with the registered-entity prerequisite that
Meta's Business Verification already imposes. Neither review is long; the prerequisites behind them are not
instant.

**E. Decide deliberately whether TikTok v1 is static carousel or video, and keep video reachable.** The map's
constraint is satisfied: static images publish to the TikTok feed today, through Carousel Ads, with the pipeline
that already exists. But TikTok's own guidance discourages static-led creative, and 4:5 letterboxes on a 9:16
feed. **The cheap insurance is at intake, not in the renderer:** ask Clients for video clips from the beginning
even though v1 discards them. Media intake is already the gating step the prototype identified, and adding "short
clips" to the ask costs one line in the intake questions and preserves the option. Re-asking a churned Client for
video later costs far more.

**F. Do not casually add a "Client connects their own TikTok account" feature.** #18 flagged the Meta version of
this trap — it flips advertdreams into App Review. The TikTok version is different but real: Spark Ads and
Business Center TikTok-account identities need the Client to authorise, and the "TikTok Accounts" scope now
requires a separate application form before an app may be submitted or a scope increased. The `CUSTOMIZED_USER`
path avoids all of it. Spark Ads are attractive — running from a salon's real organic posts is genuinely better
creative — so this is a feature that will be proposed, and its cost should be known in advance rather than
discovered.

**Decisions that survive unchanged, and are worth recording as portable rather than Meta-specific:** agency-owned
one ad account per Client (right on TikTok too, and cheaper to provision there); Ad Spend funded by advertdreams as
cost of goods; the mandatory per-ad tracking number pool; subscription-only pricing; creative approval by silence;
Vertical as data. The paced serialised publish queue that Meta's rate limits force is heavily over-provisioned for
TikTok but is the right design regardless.

---

## Open questions

**A. The binding TikTok advertiser contract was not read.** The Business Products Terms are behind an advertiser
login. No separation rule was found in any readable TikTok source, and "end advertiser" appears nowhere in the
Marketing API documentation, but the document most likely to contain an agency authorisation or account-separation
clause remains unread. Needs a human with a logged-in browser — same ticket as Meta's bot-blocked Help Center
checks. The practical risk is low, since the structure this map has already chosen (one account per Client) is the
conservative side of any such rule.

**B. Does a Business Center Admin token reach ad accounts created after authorisation?** Load-bearing for
onboarding: if not, every new Client requires a fresh interactive OAuth round trip, which would undo much of
finding 1's advantage. Inferred yes from the shape of the permission error, never stated. Settle with one API call
as soon as a Business Center and a second ad account exist.

**C. Per-Business-Center ad account creation quotas.** The 10,000-per-user ceiling is published; the "daily and
total ad account creation quotas for each Business Center, which vary based on the Business Center type" are not.
This is the TikTok analogue of the unresolved 5-account API creation cap that #18 left open on Meta, and it is the
same kind of onboarding-automation risk.

**D. Business Center API allowlisting criteria.** TikTok's own FAQ makes ad account creation conditional on being
"allowlisted for the Business Center API" and publishes no requirements for that allowlisting. Since programmatic
account creation is what makes per-Client accounts cheap on TikTok, this gate matters more than its documentation
suggests.

**E. Lead retention on TikTok's side.** The ten-minute expiry of a generated download file is documented; how far
back a new download task can reach is not stated anywhere reachable. As on Meta, the safe posture is to treat the
webhook as the system of record and persist immediately rather than relying on TikTok's store.

**F. TikTok Marketing Partner programme requirements.** The
[programme page](https://ads.tiktok.com/business/en/marketing-partners) lists four badge categories — Agency,
Creative, Measurement, Marketing Technology — and publishes no application criteria, no timeline, and no
technical capability tied to badge status. No endpoint or scope found in the documentation is described as
partner-only. **INFERRED, from absence rather than from a statement**: partner status is a directory and marketing
designation, not a technical gate, and nothing in this plan waits on it. Worth a direct question if a TikTok
representative is ever in reach, since several allowlist-only features are gated on "contact your TikTok
representative" and a partner relationship is how one gets a representative.

**G. Whether static carousel Creative actually performs on TikTok.** Out of scope for a documentation review, and
not answerable from primary sources. It is a media-buying question, and the cheapest resolution is empirical:
publish one static carousel Lead Generation ad and read the result.

**H. TikTok Symphony and any first-party image-to-video tool.** Could not be reached at any URL tried. Smart
Creative is confirmed not to generate video from stills, and the older Smart Video endpoints are deprecated. If a
first-party stills-to-video path exists, it would change the cost of the video question in implication E
considerably — but it cannot be counted on until someone confirms it.

---

## Sources

All fetched 2026-08-24. Marketing API reference pages were read as raw Markdown through
`https://business-api.tiktok.com/gateway/api/doc/client/node/get/v2/?doc_id={id}`, because the portal URLs
themselves render client-side and return nothing to a plain fetch.

**TikTok Marketing API reference** (`business-api.tiktok.com/portal/docs?id=`):

- [Identities — 1738958351620097](https://business-api.tiktok.com/portal/docs?id=1738958351620097)
- [Create an identity — 1740654203526146](https://business-api.tiktok.com/portal/docs?id=1740654203526146)
- [Business Center Overview — 1739562432184322](https://business-api.tiktok.com/portal/docs?id=1739562432184322)
- [Business Center FAQs — 1739562436183041](https://business-api.tiktok.com/portal/docs?id=1739562436183041)
- [Create an ad account — 1739939020318721](https://business-api.tiktok.com/portal/docs?id=1739939020318721)
- [Register as a developer — 1738855176671234](https://business-api.tiktok.com/portal/docs?id=1738855176671234)
- [Create a developer app — 1738855242728450](https://business-api.tiktok.com/portal/docs?id=1738855242728450)
- [App permissions — 1738855280338946](https://business-api.tiktok.com/portal/docs?id=1738855280338946)
- [Marketing API authorization — 1738373141733378](https://business-api.tiktok.com/portal/docs?id=1738373141733378)
- [Authorization FAQs — 1766037914914818](https://business-api.tiktok.com/portal/docs?id=1766037914914818)
- [Obtain a long-term access token — 1739965703387137](https://business-api.tiktok.com/portal/docs?id=1739965703387137)
- [Permission scope — 1753986142651394](https://business-api.tiktok.com/portal/docs?id=1753986142651394)
- [Rate limits — 1740029171730433](https://business-api.tiktok.com/portal/docs?id=1740029171730433)
- [Sandbox accounts — 1738855331457026](https://business-api.tiktok.com/portal/docs?id=1738855331457026)
- [Create Carousel Ads — 1766217791987713](https://business-api.tiktok.com/portal/docs?id=1766217791987713)
- [Create single image ads — 1777633230937090](https://business-api.tiktok.com/portal/docs?id=1777633230937090)
- [Create ads — 1739953377508354](https://business-api.tiktok.com/portal/docs?id=1739953377508354)
- [Lead Generation with Instant Form — 1774482920012801](https://business-api.tiktok.com/portal/docs?id=1774482920012801)
- [Lead Generation with phone call — 1774482936048641](https://business-api.tiktok.com/portal/docs?id=1774482936048641)
- [Subscribe to ad account Webhook events — 1810521739537409](https://business-api.tiktok.com/portal/docs?id=1810521739537409)
- [Instant pages — 1739953260466178](https://business-api.tiktok.com/portal/docs?id=1739953260466178)
- [Upload videos, images and music — 1738963828459521](https://business-api.tiktok.com/portal/docs?id=1738963828459521)

**TikTok advertising policy and help centre** (`ads.tiktok.com`):

- [Misleading and false content — AIGC policy](https://ads.tiktok.com/help/article/tiktok-ads-policy-misleading-and-false-content)
- [Ad Format and Functionality Policy](https://ads.tiktok.com/help/article/tiktok-ads-policy-ad-format-and-functionality)
- [Advertiser Account Policy](https://ads.tiktok.com/help/article/actor-policy)
- [TikTok Ad Specifications](https://ads.tiktok.com/help/article?aid=10002742)
- [Smart Creative](https://ads.tiktok.com/help/article/smart-creative)
- [About TikTok Business Center](https://ads.tiktok.com/resources/help/article/tiktok-business-center?lang=en)
- [About Payment Portfolio](https://ads.tiktok.com/resources/help/article/about-payment-portfolio?lang=en)
- [Manage payment in an Agency Business Center](https://ads.tiktok.com/resources/help/article/manage-payment-agency-business-center?lang=en)
- [Mandatory business verification](https://ads.tiktok.com/resources/help/article/about-mandatory-business-verification-for-businesses)
- [TikTok Marketing Partners](https://ads.tiktok.com/business/en/marketing-partners)

**Not readable** — login-gated or client-rendered, flagged inline above:
`ads.tiktok.com/i18n/official/policy/business-products-terms`,
`tiktok.com/legal/page/global/*`, TikTok Marketing Partner application criteria, TikTok Symphony.
