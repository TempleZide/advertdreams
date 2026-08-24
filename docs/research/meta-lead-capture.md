# Meta lead capture mechanisms: Lead Ads vs landing page vs click-to-call vs click-to-Messenger

Research for [#5](https://github.com/TempleZide/advertdreams/issues/5), parent map [#2](https://github.com/TempleZide/advertdreams/issues/2).
Researched 2026-08-23/24 against live Meta developer and business documentation.
Current Graph / Marketing API version at time of writing: **v26.0** (released 2026-07-29) — [changelog/versions](https://developers.facebook.com/docs/graph-api/changelog/versions/).

Every claim below is either cited to a primary Meta page or explicitly marked unconfirmed. The
"Could not confirm" section at the end is not decoration — several load-bearing details resisted
verification and should be checked against a live API call before any of this is built.

---

## Direct answer

**Meta offers four viable lead capture destinations, and they are not equivalent. On the two
criteria that matter most for advertdreams — can we read the lead programmatically, and can we
prove which campaign produced it — they rank:**

| | Lead readable via API | Per-lead campaign attribution | Structured lead data |
|---|---|---|---|
| **Lead Ads (instant forms)** | Yes, first-class | Yes — `ad_id`, `campaign_id` on the lead itself | Yes, typed `field_data` |
| **Click-to-Messenger** | Yes, via webhook | Yes — `referral.ad_id` on the conversation | No, free text |
| **Landing page we host** | Yes — it's our own form | **No** — aggregate only | Yes, we define it |
| **Click-to-call** | **No** — Meta returns nothing | **No** — aggregate only | **None** |

**The map's current assumption — landing page form plus a tracking phone number — is defensible but
is not the strongest option, and one half of it is weaker than the map implies.** Lead Ads beat the
landing page on both programmatic capture and attribution, and beat it decisively on the second.
Click-to-call returns *no lead data whatsoever* from Meta; a tracking number is not an enhancement
there, it is the only thing standing between us and a completely dark channel.

**Recommendation: make Lead Ads the primary capture mechanism, keep the landing page as a
second-position higher-intent variant, and keep the tracking number — but understand it is
carrying the entire call channel alone, and needs to be a per-ad number pool, not one number.**

Two caveats sit on top of that recommendation and are serious enough to be decisions in their own
right — see [Blocking risks](#blocking-risks-that-belong-on-the-map).

---

## 1. Lead Ads with instant forms

### Creating one via the Marketing API

Five calls, all documented. Objective must be `OUTCOME_LEADS`
([create guide](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/create/),
[fbsamples/lead_ad.py](https://github.com/fbsamples/marketing-api-samples/blob/master/samples/samplecode/lead_ad.py)):

| Step | Endpoint | Key params |
|---|---|---|
| Campaign | `POST /act_{AD_ACCOUNT_ID}/campaigns` | `objective: OUTCOME_LEADS`, `special_ad_categories` |
| Ad set | `POST /act_{AD_ACCOUNT_ID}/adsets` | `optimization_goal: LEAD_GENERATION` (or `QUALITY_LEAD`), `promoted_object: {page_id}`, `destination_type: ON_AD` |
| Instant form | `POST /{PAGE_ID}/leadgen_forms` | `questions[]` (`FULL_NAME`, `EMAIL`, `PHONE`, `CUSTOM`, …), `is_optimized_for_quality`, `tracking_parameters` |
| Creative | `POST /act_{AD_ACCOUNT_ID}/adcreatives` | `object_story_spec.link_data.call_to_action = {type: SIGN_UP, value: {lead_gen_form_id}}` |
| Ad | `POST /act_{AD_ACCOUNT_ID}/ads` | `adset_id`, `creative_id` |

Allowed CTA types for lead ads: `APPLY_NOW`, `DOWNLOAD`, `GET_QUOTE`, `LEARN_MORE`, `SIGN_UP`,
`SUBSCRIBE`. `GET_QUOTE` is the obvious fit for civil construction.

Form management is on the Page node: `GET /{PAGE_ID}/leadgen_forms` to list,
`POST /{PAGE_ID}/{form_id}` with `status: ARCHIVED` to retire.

### Reading the leads

- `GET /v26.0/{LEAD_ID}` — single lead
- `GET /v26.0/{FORM_ID}/leads` — bulk by form
- `GET /v26.0/{AD_ID}/leads` — bulk by ad
- `GET /ads/lead_gen/export_csv/?id={FORM_ID}&type=form` — CSV export

Payload shape ([retrieving guide](https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads/retrieving)):

```json
{
  "created_time": "2015-11-12T15:27:06+0000",
  "id": "555971704561545",
  "field_data": [
    {"name": "full_name", "values": ["James Oak"]},
    {"name": "email", "values": ["james.oak@example.org"]}
  ],
  "ad_name": "Buy our stuff",
  "campaign_name": "Buy our stuff"
}
```

`custom_disclaimer_responses` (marketing consent checkboxes) is a **separate field, not inside
`field_data`** — easy to miss and legally the one you most want to keep.

**Retention: 90 days.** After that the lead is unrecoverable through the API or Meta support, even
though lifetime reporting still shows it existed
([about expired leads](https://en-gb.facebook.com/business/help/1526849577619206) — corroborated via
search snippets only, the page body would not fetch; verify before relying on it). Practical
consequence: our own datastore is the system of record from day one, and the webhook path must be
reliable, not best-effort.

**Rate limit:** `200 × 24 × (leads created in the trailing 90 days for the Page)` calls per rolling
24h. A brand-new Page with zero leads therefore has a near-zero budget — the webhook path matters
more than polling for a new client.

### Webhooks — this is the real-time path

Subscribe the app to the Page's `leadgen` field:
`POST /{PAGE_ID}/subscribed_apps?subscribed_fields=leadgen`
([webhooks for leadgen](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-leadgen/)).

```json
{"object":"page","entry":[{"id":153125381133,"time":1438292065,
  "changes":[{"field":"leadgen","value":{
    "leadgen_id":123123123123,"page_id":123123123,"form_id":12312312312,
    "adgroup_id":12312312312,"ad_id":12312312312,"created_time":1440120384}}]}]}
```

**The webhook carries identifiers only, never answers** — you take `leadgen_id` and call the
retrieval endpoint. Meta describes delivery as "real-time" but publishes **no numeric latency SLA**;
treat sub-minute as the design target and unverified as the guarantee.

Given the speed-to-lead evidence in §5, this webhook is the single most valuable API surface in this
entire document. It is what makes "contact within five minutes" mechanically possible.

### Permissions and gating — the expensive part

Required: `leads_retrieval`, plus `ads_management`, `ads_read`, `business_management`,
`pages_manage_ads`, `pages_manage_metadata`, `pages_read_engagement`, `pages_show_list`
([permissions reference](https://developers.facebook.com/docs/permissions/reference/leads_retrieval)).

That page **explicitly sanctions the third-party pattern** — "advertiser authorized CRM platforms
[may] pull the lead data on behalf of the advertisers." advertdreams is exactly this shape. Good.

But production use requires all of:

1. **Advanced Access** via **App Review** — screencast demonstrating real lead retrieval, and at
   least one successful API call per requested permission within 30 days of submission.
2. **Business Verification** of advertdreams as a business.
3. **Leads Access assignment per client Page**, through Lead Access Manager in Business Suite
   ([assign/remove](https://www.facebook.com/business/help/540596413257598),
   [about Leads Access](https://www.facebook.com/business/help/1440176552713521)). Once enabled,
   *nobody* — not even a Page admin — gets lead access by default; it is granted explicitly per
   partner. This is a per-client onboarding step, not a one-time setup.
4. **Meta Lead Ad Terms accepted by a Page admin** at `facebook.com/ads/leadgen/tos`
   ([terms](https://www.facebook.com/legal/leadgen/tos), effective 2025-10-10).

Items 3 and 4 are **manual steps the Client Owner must perform in their own Business Manager**. The
map's onboarding is already "sales-assisted and manual," so this fits — but it is real friction and
belongs in the onboarding ticket.

### Form features worth knowing

- Up to **15 custom questions**, with **conditional logic** — branch on a prior answer
  ([custom questions](https://www.facebook.com/business/help/774623835981457),
  [conditional answers](https://www.facebook.com/business/help/154286325106161)).
  For civil construction this is where "what kind of work?" / "is this residential or commercial?" /
  "what's your timeline?" live, and it is the cheapest lead-quality lever Meta gives us.
- **Two form types** ([about instant form types](https://www.facebook.com/business/help/252352181957512/)):
  *More Volume* (single screen, submits immediately) and *Higher Intent* (adds a review/confirm
  screen). Meta documents the mechanism but publishes **no quantified deltas** — see §5.
- **Custom disclaimers** for marketing opt-in
  ([add a custom disclaimer](https://www.facebook.com/business/help/1550411888622740)).
- **SMS/OTP phone verification** — require a one-time password before submission
  ([phone verification](https://www.facebook.com/business/help/898260175547909)). This is Meta's own
  answer to junk leads and it directly attacks the biggest weakness of instant forms.
- Name / email / phone **prefill from the Meta profile**. No Meta documentation quantifies prefill
  *accuracy*; the widely-repeated concern that prefilled contact data can be stale is secondary-source
  only. OTP verification is the mitigation that is actually documented.

### Attribution

The lead itself carries `ad_id`, `ad_name`, `form_id`, `campaign_name` (and `campaign_id`/`adset_id`
as selectable fields), plus `is_organic`. **This is per-lead, not aggregate** — we can say "this
specific lead came from this specific ad" with no inference, no cookies, no matching. Nothing else
on this list can do that except Messenger.

Reconciling counts with `/act_{ID}/insights` uses the `actions` array
(`lead` / `onsite_conversion.lead_grouped`; legacy `leadgen.other`). Exact current strings came from
secondary/tooling sources — confirm with one live `fields=actions` call.

### 2025–2026 changes

- Lead Ad Terms updated effective **2025-10-10**.
- **Lead capture AI agent** for instant forms — Meta dynamically chooses between the static form and
  a conversational AI flow that can answer questions and book a call. Official help page exists
  (`facebook.com/business/help/1002957652106672`) but would not fetch; secondary sources report a
  July 2026 limited rollout. **Unconfirmed, but worth watching** — it overlaps with functionality we
  might otherwise build.
- **Embedded appointment booking** ("Book time") in instant forms, ~June 2026 per secondary sources.
  Unverified.
- Enforcement of Advanced Access + Business Verification for production `leads_retrieval` has
  tightened over 2024–2026 (gradual, no single dated policy announcement found).

---

## 2. Click-through to a landing page we host

### Creating it

`OUTCOME_LEADS` (optimizing to the `LEAD` custom event), `OUTCOME_TRAFFIC`, or `OUTCOME_SALES` all
work ([campaign reference](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group/)).
`object_story_spec.link_data.link` is the destination
([link data](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-link-data/)).
`promoted_object` at ad-set level carries `pixel_id` and `custom_event_type: LEAD` — `LEAD` is a
confirmed allowed value alongside `PURCHASE`, `COMPLETE_REGISTRATION`, `SUBSCRIBE`, `CONTACT`,
`SUBMIT_APPLICATION`, `SCHEDULE`
([promoted object](https://developers.facebook.com/docs/marketing-api/reference/ad-promoted-object)).

### Reading the lead

Trivially — it is our own form on our own server. This is the mechanism with the *most* control over
lead data: any fields we want, any validation we want, no 90-day expiry, no Meta permission gate, no
per-client Leads Access grant. That is a genuine and underrated advantage.

### Feeding conversions back to Meta

Pixel plus **Conversions API**
([CAPI](https://developers.facebook.com/docs/marketing-api/conversions-api/)); server events are
processed equivalently to browser events. `Lead` is a standard Pixel event
([pixel reference](https://developers.facebook.com/docs/meta-pixel/reference/)).

`user_data` params
([v25.0 parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/v25.0/)):
SHA-256 hashed `em`, `ph`, `fn`, `ln`, `ct`, `st`, `zp`, `country`, `db`, `ge`; unhashed
`client_ip_address`, `client_user_agent`, `fbc`, `fbp`, `lead_id`, `page_id`, `ctwa_clid`. Website
events also need `action_source` and `event_source_url`. `event_id` is the confirmed dedup key
between Pixel and CAPI.

Cookie formats, confirmed verbatim
([fbp and fbc](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc)):

```
_fbc = version.subdomainIndex.creationTime.fbclid
       e.g. fb.1.1554763741205.IwAR2F4-dbP0l7Mn1Iaw...
_fbp = version.subdomainIndex.creationTime.randomNumber
```

`_fbc` is derived from the `fbclid` URL parameter and lives 90 days.

### Attribution — the weak spot, and it is weaker than it looks

**There is no API to resolve `fbclid` → `ad_id`.** `fbclid` is an opaque token consumed inside
Meta's matching pipeline. Ads Insights returns only **aggregated, already-attributed action counts**
per ad/adset/campaign — never a single-lead-to-single-ad join
([insights](https://developers.facebook.com/docs/marketing-api/insights/)).

So: Meta can tell us *this ad produced 7 leads*. Meta cannot tell us *this lead came from that ad*.

The workaround is to stamp campaign identity into the landing page URL ourselves using dynamic
macros (`{{ad.id}}`, `{{campaign.id}}`, `{{adset.id}}`, `{{placement}}`, …) and capture them in a
hidden form field. This is standard practice and almost certainly works — but **the macro list could
not be confirmed against any primary Meta page this session** (every attempt 404'd or returned a
JS-rendered stub). Before the map treats landing-page attribution as solved, someone should publish
one ad with macros in the URL and read what actually arrives.

Attribution windows are set per ad set via `attribution_spec` — a list of
`{event_type: CLICK_THROUGH|VIEW_THROUGH, window_days, weight}`. Default when unspecified is
28-day click + 1-day view. The full valid-combination table by optimization goal could not be
retrieved.

**iOS ATT / Aggregated Event Measurement / the 8-event limit in 2026: unconfirmed.** Secondary
sources claim the 8-event priority limit and manual AEM domain configuration were removed for *web*
events in June 2025, with the 8-event model persisting for iOS *app* campaigns. Every primary AEM
page attempt failed to fetch. **Do not plan around this either way without checking.**

---

## 3. Click-to-call

### It still exists

`CALL_NOW` is a confirmed current `call_to_action_type` enum value in v26.0
([ad creative reference](https://developers.facebook.com/docs/marketing-api/reference/ad-creative/)),
alongside `CALL`, `CALL_ME`, `VIDEO_CALL`, `AUDIO_CALL`.

The CTA value sub-object
([call-to-action value](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-link-data-call-to-action-value/))
has fields `app_destination`, `app_link`, `application`, `event_id`, `lead_gen_form_id`, `link`,
`link_caption`, `link_format`, `page`, `product_link` — **there is no dedicated `phone_number`
field**; the number goes in the generic `link`. The `tel:` URI convention is practitioner
convention, **not stated in Meta's reference text**.

One confirmed placement limit: Facebook Stories does not support `CALL_NOW` or `GET_DIRECTIONS`.
Instagram feed/Reels support is unconfirmed either way; the objective/CTA matrix the docs point to
would not render.

### What comes back — and this is the headline

Confirmed action types from the live
[ads-action-stats reference](https://developers.facebook.com/docs/marketing-api/reference/ads-action-stats/):

- `click_to_call_call_confirm` — "Estimated Call Confirmation Clicks"
- `click_to_call_native_call_placed` — "Calls Placed (Only available in select countries)"
- `click_to_call_native_20s_call_connect` — "20s Calls Placed"
- `click_to_call_native_60s_call_connect` — "60s Calls Placed"

Note the naming: **not** `onsite_conversion.call_confirm`. No prefix.

That is the complete list. **Meta returns aggregate counts and nothing else.** No caller phone
number, no name, no call duration beyond coarse 20s/60s buckets, no per-call record of any kind.
There is no lead object. There is nothing to read.

And `tel:` URIs cannot carry query parameters the way `http(s)://` can — the dialer takes the string
as a number, no web request occurs, no token survives the handoff. So there is no way to smuggle a
campaign identifier through the call itself.

**Therefore: a distinct phone number per ad, matched out-of-band against a call-tracking provider
(CallRail, Invoca, etc.), is not one option among several. It is the only mechanism that exists.**
The map's tracking number is doing far more load-bearing work than "handles calls and SMS" suggests,
and a single shared number would make the entire call channel unattributable.

No API-controllable call-scheduling or business-hours feature was found.

---

## 4. Click-to-Messenger

### Creating it

Objectives per Meta's own quick-reference table
([click-to-Messenger guide](https://developers.facebook.com/documentation/ads-commerce/marketing-api/ad-creative/messaging-ads/click-to-messenger)):
`OUTCOME_TRAFFIC` for click-to-Messenger, `OUTCOME_LEADS` for "Messenger Ads for Leads,"
`OUTCOME_ENGAGEMENT`/`OUTCOME_SALES`/`OUTCOME_TRAFFIC` for general CTM.

`destination_type` full enum
([destination_type](https://developers.facebook.com/docs/marketing-api/adset/destination_type/)):
`MESSENGER`, `WHATSAPP`, `INSTAGRAM_DIRECT`, plus combined-surface values like
`MESSAGING_INSTAGRAM_DIRECT_MESSENGER_WHATSAPP` where Meta picks the surface.

```json
"call_to_action": {"value": {"app_destination": "MESSENGER"}, "type": "MESSAGE_PAGE"}
```

`page_welcome_message` on the creative is, verbatim, "the customized greeting message that is
presented to the user when they are redirected from a click to Messenger or click to Whatsapp ad."
Default if unset: "Hello! Can I get more info on this?" It supports ice breakers (title ≤80 chars,
response ≤300).

### The API creation path for lead qualification is deprecated

Verbatim from Meta: *"Beginning with v24.0, the ability to create lead ads that generate leads in
Messenger with the API is being deprecated."* Programmatic creation of Messenger lead-qualification
Message Templates is gone. **Ads Manager UI creation still works**, but this flow cannot be built
purely through the API any more — which collides directly with the map's "advertdreams publishes via
the Marketing API" model.

### Reading the conversation — and the attribution surprise

Webhook events `messages`, `messaging_postbacks`, `messaging_referrals`
([webhooks](https://developers.facebook.com/docs/messenger-platform/webhooks)). Confirmed referral
payload
([messaging_referrals](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_referrals)):

```json
{"sender":{"id":"<PSID>"},"recipient":{"id":"<PAGE_ID>"},"timestamp":1458692752478,
 "referral":{"ref":"<REF_DATA>","ad_id":"<AD_ID>","source":"ADS","type":"OPEN_THREAD",
   "ads_context_data":{"ad_title":"...","post_id":"...","product_id":"..."}}}
```

`referral.ad_id` with `source == "ADS"` identifies the originating ad **per conversation**. That is
per-lead attribution as clean as Lead Ads — notably better than the landing page. Worth recording
even if Messenger is not chosen, because it is the fact that most contradicts intuition here.

Lead data itself comes back either as a Summary Message of **free-text Q&A pairs** (parse it
yourself) or, for the templated flow, via the standard `GET /{AD_ID}/leads` edge.

Permissions: `pages_messaging`, App Review required
([permission reference](https://developers.facebook.com/docs/permissions/reference/pages_messaging)).
Standard **24-hour messaging window**; `HUMAN_AGENT` tag extends replies to 7 days and is confirmed
still active. Confirmed retirement: *"Effective April 27th, 2026, all API requests containing the
Message Tags `CONFIRMED_EVENT_UPDATE`, `ACCOUNT_UPDATE`, and `POST_PURCHASE_UPDATE` will receive
error code 100"* ([send messages](https://developers.facebook.com/docs/messenger-platform/send-messages)).

### Other 2025–2026 changes

- WhatsApp Business Platform moved from conversation-based to **per-message pricing effective
  2025-07-01** ([WhatsApp pricing](https://developers.facebook.com/docs/whatsapp/pricing)), with
  further regional rate changes scheduled through 2026. Relevant only if WhatsApp is ever added.
- Messenger Stories placement (`story` in `messenger_positions`) is being dropped by 2026-10-27
  ([v26.0 changelog](https://developers.facebook.com/docs/graph-api/changelog/version26.0)).

---

## 5. Cost per lead and lead quality for local home/property services

Source trust: **A** = large sample, disclosed methodology · **B** = vendor report, real data but
self-interested · **C** = agency blog / single case study / undisclosed methodology.

A great deal of "benchmark" content in this space is SEO content-mill output. It is marked as such.

### CPL benchmark

**[A] WordStream by LocaliQ, *Facebook Ads Benchmarks 2025***, published 2025-09-15, still the
current edition — [wordstream.com](https://www.wordstream.com/blog/facebook-ads-benchmarks-2025),
[localiq.com mirror](https://localiq.com/blog/facebook-advertising-benchmarks/). Sample: 726 US
Leads-objective campaigns, Apr 2024–Jun 2025, ~20 managed accounts.

- **Home & Home Improvement, Leads objective: CPL $41.26**, CPC $2.23, CTR 1.94%, CVR 5.22%
  (CVR down 36% YoY)
- All-industry average CPL **$27.66**, up 21% YoY
- Google Ads average CPL in the same report: **$70.11** — Meta remains substantially cheaper
  ([Search Engine Land, 2025-09-08](https://searchengineland.com/facebook-ad-costs-jump-beat-google-461690))
- Adjacent "Industrial & Commercial" bucket: $37.34

There is **no first-party Meta CPL-by-industry publication**, and no large-sample source breaks out
excavation, concrete, or site work separately. "Home & Home Improvement" is the closest honest
anchor.

**[C]** Trade-specific figures from agency blogs (plumbing $30–80 vs $12–25; roofing $60–120 vs
$18–40; HVAC $40–80 vs $15–35) **contradict each other by 2–3×** and disclose no methodology. Do not
cite them as benchmarks.

### Instant forms vs landing page

Meta documents the *mechanism* — More Volume vs Higher Intent's confirmation screen
([form types](https://www.facebook.com/business/help/252352181957512/)) — and publishes **no
quantified deltas**.

The numbers circulating in agency content (Higher Intent cuts volume 20–40%, raises CPL 10–20%,
improves lead-to-meeting 15–25%) appear **verbatim across multiple near-identical posts with no
traceable origin**. The *direction* is credible because it follows from the mechanism; the specific
percentages are unsourced. Treat as directional only.

The general framing — instant forms win on raw CPL, landing pages win on cost-per-*qualified*-lead
because friction filters low intent — is consistent agency consensus but **not backed by any
large-sample independent study** we could find. It is received wisdom, and it is worth saying so
plainly rather than dressing it up.

### Calls vs form fills

**[B] Invoca, *Home Services Lead Conversion Benchmarks Report 2026*** (~July 2026) —
[invoca.com](https://www.invoca.com/reports/the-invoca-home-services-lead-conversion-benchmarks-report-2026).
Sample: 70M+ calls / 600M minutes, 9 home-services sub-industries. Invoca sells call intelligence —
self-interested, but the sample is large and specific.

- 52% of callers reach a live person (65% for calls >15s, 73% for >30s)
- Of answered calls, **38% qualify as leads**; **45% of those convert on the call**
- Paid-search-driven calls: 40% lead rate, 48% on-call conversion

Corroborated at [Supply House Times](https://www.supplyht.com/articles/106612-home-services-call-performance-report-46-lead-conversion-rate-segment-benchmarks)
(46% lead conversion) — same vendor's data, so corroborating rather than independent.

**Critically, this report is call-data only and contains no web-form comparison** — it cannot itself
establish a calls-vs-forms multiplier. The ubiquitous "calls convert 3–5× better than forms" claim
traces only to small agency blogs with no primary citation. **Industry folklore. Do not cite it.**

### Speed to lead — the two studies, correctly separated

These are routinely conflated online, including in 2025–2026 posts. They are different studies:

- **[A] 2007 MIT / InsideSales.com Lead Response Management study** (Dr. James Oldroyd) — 15,000+
  leads, 100+ companies, three years. Responding within **5 minutes** → ~**100× more likely to make
  contact**, ~21× more likely to qualify, vs 30 minutes. This is the true origin of the "5-minute
  rule." Original whitepaper could not be accessed directly; ~19 years old and we found no
  replication.
- **[A] Harvard Business Review, 2011, "The Short Life of Online Sales Leads"** (Oldroyd, McElheran,
  Elkington) — 1.25M leads, 2,241 US companies. Contact within **1 hour** → ~**7× more likely to
  qualify**.

Many sources attribute the 100×/5-minute figure to HBR. That is wrong; HBR's own number is 7×/1-hour.

**This is the most actionable finding in the entire document.** Both mechanisms that deliver a lead
in real time — the Lead Ads `leadgen` webhook and the Messenger referral webhook — are directly
serving the variable with the largest documented effect size in this research. Lead *delivery*
latency may matter more to a Client's booked-job rate than lead *cost*.

### Lead quality problems with instant forms

The structural issue is real and well understood: low-friction autofill invites accidental taps,
bot/click-farm submissions, and stale prefilled contact data. This is not agency FUD.

**But the alarming numbers are.** A vendor selling lead-verification software claims 92.75% of solar
Meta leads and "100%" of several other verticals are invalid
([Specificity Inc.](https://specificityinc.com/news/metas-fake-lead-traffic)). Undisclosed
methodology, extreme, single-source, and drawn from solar — a uniquely lead-mill-infested,
high-ticket vertical that does not resemble a $4K excavation job. **Do not use that percentage for
anything.** The phenomenon is credible; the magnitude is not.

No Meta-published aggregate bad-lead rate exists, and we found no independent non-vendor audit.

Meta's documented countermeasures: **SMS/OTP phone verification**, Higher Intent forms, conditional
logic, work-email requirements, and a Lead Ads Testing Tool (which validates pipeline integrity, not
lead intent).

### Click-to-Messenger for local trades

**A genuine evidence gap.** We found no credible data either supporting or refuting Messenger for
excavation/concrete/roofing/HVAC. What exists: a vendor case study claiming ~$0.09/lead
([respond.io](https://respond.io/blog/facebook-messenger-leads)) — an extreme outlier, almost
certainly cherry-picked — and an untraceable "8% lower CPL, 48% more reach when combining Instant
Forms + Messenger" claim with no locatable origin.

Everything findable on click-to-Messenger skews e-commerce/DTC/conversational commerce, not trades.
Treat any Messenger performance claim for this vertical as unverified until we run our own test.

### What a lead is worth

Job-value anchors (cost-guide aggregators — reasonable for real-world pricing, not academically
rigorous):

- **Excavation**: typical residential job averages **$3,980**, IQR ~$1,659–$6,710, range $500–$15,000;
  $110–$325/hr including operator and equipment
  ([HomeAdvisor](https://www.homeadvisor.com/cost/landscape/excavate-land))
- **Concrete**: $6–$15/sq ft; a 400 sq ft slab typically **$1,600–$4,800**
  ([Housecall Pro](https://www.housecallpro.com/resources/concrete-price-guide/))

Back-of-envelope (our arithmetic, not a cited benchmark): at $41–$100 CPL and an 8–15% lead-to-booked
close rate, cost-per-booked-job lands roughly **$275–$1,250** against $2,000–$8,000+ job values. Meta
lead gen is economically viable for this vertical with real headroom — **the binding constraint is
close rate and speed-to-lead execution, not CPL.** The close-rate range is itself unverified;
treat the whole calculation as illustrative.

One calibration note on the whole pay-per-lead category: the FTC ordered HomeAdvisor to pay up to
$7.2M (2023 consent order) over unsubstantiated claims about the quality and source of leads sold to
contractors. Not independently re-verified against ftc.gov this session — confirm before citing
externally — but a useful reminder of how much to trust any lead vendor's self-reported quality
figures, including, eventually, ours.

---

## Blocking risks that belong on the map

### 1. The Lead Ad Terms prohibit selling lead data

The [Lead Ad Terms](https://www.facebook.com/legal/leadgen/tos) (effective 2025-10-10) state the
advertiser **"cannot sell Lead Generation Data under any circumstances,"** may use it only for the
purpose stated at collection, and must ensure downstream third parties comply and do not commingle
the data.

advertdreams charges a fee and delivers leads. Whether that is "selling Lead Generation Data" turns
entirely on **whose Page collects the lead**:

- **Leads collected on the Client's Page**, under the Client's privacy policy, with advertdreams as
  an authorized partner delivering them to the Client — this is the sanctioned CRM-partner pattern
  the permissions docs explicitly bless. Fine.
- **Leads collected on advertdreams' own Page and then handed to a paying Client** — looks a great
  deal like the prohibited case.

This interacts with the map's settled constraint that ads run from **advertdreams' own agency ad
account**. Ad account and Page are separate objects — an agency ad account can run ads for a
Client's Page — so the constraint is survivable. But it means **every Client must have a Facebook
Page, grant advertdreams Leads Access on it, and accept the Lead Ad Terms**, and that is not
currently anywhere in the map's onboarding.

**This is a compliance question, not an engineering one, and it should not be decided by inference
from a research doc.** Flagging for #10 / #12.

Note this risk applies *only* to the Lead Ads path. It is the strongest argument in favour of the
map's original landing-page assumption: a form on our own domain is governed by our own privacy
policy and our own contract with the Client, not by Meta's lead-data terms at all.

### 2. Policy-strike blast radius

The map already notes that "a policy strike hits an account serving every Client." Lead Ads
concentrate this further: a Lead Ad Terms violation on one Client's Page can jeopardise the lead
access that every Client depends on. The landing-page path has a smaller blast radius by
construction — worth weighing.

### 3. Single-point dependency on App Review

The Lead Ads path cannot ship at all without Advanced Access for `leads_retrieval` plus Business
Verification. If App Review is refused or delayed, the landing page is the only capture mechanism
that still works. That argues for building the landing page **first** regardless of which becomes
primary — it is the path with no external approval gate.

---

## Verdict on the map's assumption

The map assumes **a landing page form plus a tracking phone number handling calls and SMS**.

**What holds:**

- The tracking number is not merely justified, it is *mandatory* for any call-based capture. Meta
  exposes zero per-call data. Nothing else can attribute a call.
- The landing page is the only mechanism with no Meta permission gate, no 90-day expiry, no
  per-client Leads Access grant, and no exposure to the Lead Ad Terms' no-sale clause. Under the
  agency-account model those are substantial, and partly under-appreciated, advantages.

**What does not hold:**

- **The landing page cannot prove which campaign produced a given lead**, beyond aggregate counts,
  unless we stamp macros into the URL ourselves — and that macro list is currently unverified. The
  map should not assume landing-page attribution is solved.
- **A single tracking number is not enough.** Per-ad numbers are required or the call channel is
  unattributable in exactly the same way.
- Lead Ads are **materially better** on programmatic capture, per-lead attribution, and — via the
  real-time `leadgen` webhook — on speed-to-lead, which the evidence says is the highest-leverage
  variable available. That is a real gap, not a marginal one.

**Recommended change to the map:** treat lead capture as **two mechanisms, not one**.

1. **Lead Ads as the primary volume mechanism**, with Higher Intent forms plus conditional
   qualifying questions plus OTP phone verification — Meta's own documented quality levers — and the
   `leadgen` webhook driving delivery.
2. **The landing page retained as the higher-intent variant and as the no-approval-required
   fallback**, built first because it has no external gate.
3. **The tracking number retained and upgraded to a per-ad number pool.**
4. **Click-to-Messenger deferred**, but noted as *not* foreclosed: its `referral.ad_id` attribution
   is excellent, and the v24.0 API-creation deprecation is the blocker, not the mechanism.
   The map's "nothing out of scope may be foreclosed" constraint is satisfied.

This keeps the map's existing assumption intact as a component rather than discarding it, and adds
the mechanism that is stronger on the criteria the map actually cares about.

---

## Could not confirm

Listed honestly. Absence of confirmation is not evidence of falsehood — several of these are pages
that returned JS-rendered stubs or 404s to automated fetching — but none should be treated as
settled.

**Lead Ads**
1. `platform`, `retailer_item_id`, `partner_name` as real lead-payload fields — not found in any
   primary doc; the Graph reference page for the leadgen node would not render a field list.
2. Any numeric webhook delivery latency SLA — Meta publishes none.
3. Full raw text of the Lead Ad Terms, the "expired leads" page, and the lead-capture-AI-agent page —
   all three returned titles only.
4. Whether Lead Ad Terms acceptance is strictly per-Page or account-wide — secondary source only.
5. Current exact Ads Insights lead action-type strings (`lead`, `onsite_conversion.lead_grouped`,
   `leadgen.other`) — from tooling docs, not a primary Insights reference.
6. v26.0 changelog entries specific to leadgen endpoints.

**Landing page**

7. **The dynamic URL macro list** (`{{ad.id}}`, `{{campaign.id}}`, …) — no primary page retrievable.
   *This is the most consequential gap in the document*, because landing-page per-lead attribution
   depends entirely on it.
8. 2026 status of the AEM 8-event limit and domain verification — secondary source claims removal
   for web events in June 2025; unverified.
9. Full `attribution_spec` valid-combination table by objective/optimization goal.
10. Exact `event_id` dedup algorithm and matching window.
11. Literal `/{pixel_id}/events` endpoint string — inferred from CAPI overview prose.
12. Primary-sourced Event Match Quality scoring definition.

**Click-to-call**

13. Official Meta text specifying `tel:` as the `CALL_NOW` link format — convention only.
14. Which campaign objectives officially support `CALL_NOW`; Instagram feed/Reels placement support.
15. Whether `promoted_object` has genuinely no requirement for call ads — inferred by absence.
16. Any API-controllable call scheduling / business hours.

**Messenger**

17. `MESSAGE_PAGE` in an exhaustive CTA enum reference (confirmed only via a working doc example).
18. Instagram Direct-specific CTA enum value.
19. Conversations API endpoint/schema for full thread history.
20. WhatsApp pricing changes dated Aug/Oct 2026 — from a search summary, not a fetched Meta page.

**Benchmarks**

21. Any first-party Meta CPL-by-industry publication — appears not to exist.
22. Separate large-sample CPL for construction/contractors distinct from "Home & Home Improvement."
23. Origin of the Higher-Intent quantified deltas — repeated verbatim across blogs, untraceable.
24. Any primary source for "calls convert 3–5× vs forms" — folklore.
25. Any Meta-published or independent bad-lead rate for lead ads.
26. Click-to-Messenger performance for local trades — a real gap, not merely weak evidence.
27. The FTC/HomeAdvisor $7.2M consent order — matches public record but not re-verified this session.
28. Databox's Facebook CPL figures and the circulating "$21 average CPL" — sample basis unverified.

**Recommended cheapest verifications**, in order of value: (a) publish one ad with URL macros and
read what arrives — settles #7; (b) one live `fields=actions` Insights call — settles #5; (c) one
live lead fetch against a real submission — settles #1; (d) legal read on the no-sale clause against
the agency model — settles the risk in [Blocking risks](#blocking-risks-that-belong-on-the-map).
