# Meta Marketing API: access tiers, App Review, and limits for programmatic campaign creation

Research for [#4](https://github.com/TempleZide/advertdreams/issues/4). Verified against live Meta developer
documentation on **2026-08-23**. Every claim below carries the URL it came from. Where a claim could not be
confirmed from a primary source it is marked **[unconfirmed]**.

> Scope reminder from the map ([#2](https://github.com/TempleZide/advertdreams/issues/2)): advertdreams publishes
> from **its own agency ad account**, Clients never log in to Meta, and advertdreams is the only party holding a
> token. That single fact changes the answer substantially, so it is load-bearing throughout.

---

## 1. Direct answer

**App Review of the ads *permissions* is not required for advertdreams as currently scoped**, because no Client
ever holds or grants a Meta token. advertdreams is its own only API user. What actually gates the product is the
**Marketing API Access Tier**, whose upgrade is gated on a 15-day usage threshold rather than on a use-case
justification. Meta's docs are inconsistent about whether that upgrade also passes through App Review as a
*feature* request (§4), so plan for Business Verification either way.

Two independent axes are easy to conflate. They are not the same thing:

| Axis | What it gates | advertdreams' position |
|---|---|---|
| **Access Level** (Standard / Advanced), platform-wide, per permission | *Whose* data your app may request | **Standard is enough.** Granted automatically. |
| **Marketing API Access Tier** (Limited / Full, formerly "Ads Management Standard Access") | *How many calls per hour* per ad account | Starts at **Limited**; self-serve upgrade to Full. |

---

## 2. Permissions required

To create campaigns, ad sets, ads, and ad creatives:

- **`ads_management`**: "Programmatically create campaigns, manage ads, and fetch metrics."
  ([permissions reference](https://developers.facebook.com/docs/permissions/reference/ads_management))
- **`ads_read`**: read-only reporting; needed for Insights.
- **`pages_read_engagement`** and **`pages_show_list`** are listed as dependencies of `ads_management`
  ([same page](https://developers.facebook.com/docs/permissions/reference/ads_management)).
- **`business_management`**: only if you intend to manage Business Manager assets (ad accounts, user
  permissions, Pages) through the API. advertdreams administers one ad account by hand, so this is optional.
  Note that the Limited tier explicitly withholds it anyway (see §4).

The Marketing API authorization doc states the deciding sentence plainly:

> "If your app is only managing your ad account, standard access to the `ads_read` and `ads_management`
> permissions are sufficient."
>
> Source: <https://developers.facebook.com/docs/marketing-api/overview/authorization>

Ad creative note: building the creative inline with `object_story_spec` needs only `ads_management`. Referencing
an existing Page post via `object_story_id` also requires Page and post permissions
([Ad Creative Object Story Spec](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-object-story-spec/)).
Inline `object_story_spec` is therefore the cheaper path permission-wise, and it is the one that fits
advertdreams' generate-then-publish flow.

Instagram placements need both `page_id` and `instagram_user_id` on the creative. `instagram_actor_id` was
deprecated at v22.0 and fully retired on 2025-09-09; use `instagram_user_id`
([Instagram Marketing API Update, 2025-08-11](https://developers.facebook.com/blog/post/2025/08/11/instagram-marketing-api-update/)).

---

## 3. Is App Review required?

**No, not for this shape of app.** The Marketing API authorization doc draws the line in one sentence pair, and
advertdreams lands on the cheap side of it:

> "If your app is only managing your ad account, standard access to the `ads_read` and `ads_management` permissions
> are sufficient. **If your app is managing other people's ad accounts, you need advanced access** to the
> `ads_read` and/or `ads_management` permissions."
>
> Source: <https://developers.facebook.com/docs/marketing-api/overview/authorization/>

The map's agency-ad-account constraint puts advertdreams squarely in the first clause. The App Review overview says
the same thing from the other direction:

> "If your app will be used by anyone without a Role on the app or a role in a Business that has claimed the app,
> it must first undergo App Review. If your app will only be used by app users who have a role on the app itself,
> App Review is not required."
>
> Source: <https://developers.facebook.com/docs/app-review/>

Standard vs Advanced Access is defined the same way, by *who* can be asked for the permission, not by what the
permission does:

> "Permissions with Standard Access can only be requested from app users who have a role on the requesting app."
> "Permissions with Advanced Access can be requested from any app user."
>
> Source: <https://developers.facebook.com/docs/graph-api/overview/access-levels>

And Standard Access is free:

> Business apps are "automatically approved for Standard Access for all Permissions and Features available to the
> Business app type."
>
> Source: <https://developers.facebook.com/docs/marketing-api/overview/authorization>

**Applied to advertdreams:** the token holder is advertdreams itself, either an app admin or a System User inside
advertdreams' own Business Manager which has claimed the app. No Client ever completes a Facebook Login or grants
a token. Every API user has a role. **Standard Access satisfies the requirement, and no App Review submission is
needed for the permissions.**

This is a real architectural dependency, not just a paperwork saving. **The day advertdreams lets a Client
connect their own ad account, Page, or Instagram account by logging in with Facebook, `ads_management` needs
Advanced Access, which means App Review plus Business Verification.** That is the trigger to watch for.

For reference, if Advanced Access ever is needed, the `ads_management` review asks for
([permissions reference](https://developers.facebook.com/docs/permissions/reference/ads_management)):

- A use-case description with "specific examples of why your app requires managing ads on behalf of other businesses"
- Three screencasts: the full Facebook Login permission-grant flow; how a business reaches ads performance data in
  the app; and metrics displayed: impressions, conversions, spend, clicks, reach
- Working test credentials, a privacy policy URL, a data deletion callback or instructions, an app icon and category
  ([App Review submission guide](https://developers.facebook.com/docs/app-review/resources/sample-submissions/marketing-api/))
- "Each permission and feature must have its own description. Do not copy and paste."
  ([submission guide](https://developers.facebook.com/docs/app-review/submission-guide))
- At least one successful API call per requested permission, made **within 30 days** of submitting, since the *Request advanced access* button stays greyed out until Meta has logged one (same source)
- Screencasts at 1080p+, recorded from a logged-out state, app UI in English
  ([screen recordings](https://developers.facebook.com/docs/app-review/submission-guide/screen-recordings/))

Worth noticing: the published review criteria for `ads_management` and `business_management` are written entirely
around managing assets "on behalf of **other** businesses". There is no Advanced Access narrative for a
single-tenant agency app, which is further evidence that Standard Access is the intended path for advertdreams,
not a loophole in one.

### The token: a System User, not a user login

The right credential for a headless publisher is a **System User** access token issued inside advertdreams' own
Business Manager:

> "System users represent servers or software making API calls to assets owned or managed by a Business Manager."
> "A system user can only be granted a role on an app if both the system user and the app belong to the same business."
>
> Source: <https://developers.facebook.com/docs/business-management-apis/system-users/overview/>

`ads_management`, `ads_read`, `business_management`, `leads_retrieval`, `pages_show_list` and
`pages_read_engagement` are all explicitly supported as system-user token scopes. System user tokens do not expire
the way a user token does, which removes the whole refresh-token problem from the publishing path.

**[unconfirmed], the most likely place this plan snags.** The system-user docs contain a requirement that cannot
be cleanly reconciled with §3:

> "Only apps with Ads Management API standard access and above can be installed."
>
> Source: <https://developers.facebook.com/docs/business-management-apis/system-users/install-apps-and-generate-tokens/>

…and the system-users overview lists as a prerequisite *"Have the Meta app go through an app review (and Business
verification) for the permissions the system user wants access to."* Read one way, "standard access" is the
automatic default and nothing is needed. Read the other way, "Ads Management **Standard Access**" names the
*feature* (§4), which is requested rather than granted. No page disambiguates it. **Assume advertdreams may have to
request the Ads Management Standard Access / Marketing API Access Tier feature simply to install the app for its system user**, which would make the tier upgrade a day-one task rather than a scaling task.

### Verification and the annual compliance surface

Four separate Meta processes are easy to confuse. Only one of them plausibly touches advertdreams today.

**Business Verification** is required for Advanced Access since a banner dated 2023-02-01
(<https://developers.facebook.com/docs/development/release/business-verification/>). Requires a **legal entity**:
company tax identification number, business formation documents showing beneficial owners, government photo ID for
every beneficial owner holding ≥10%, plus legal business name, address, phone, and website
(<https://www.facebook.com/business/help/193400874040813>). **[unconfirmed]** No official processing SLA is
published anywhere. **[unconfirmed]** No live Individual Verification doc page could be found, and every statement
tying verification to Advanced Access says *Business* Verification, so **a solo builder with no registered entity
has no confirmed path to Advanced Access.** This does not block v1, which needs only Standard Access, but it is a
hard prerequisite for any later Client-connects-their-own-account feature, and registering an entity has its own
lead time.

**Access Verification / Tech Provider status** does **not** apply, on the stated criterion:

> "Any business that has created or claimed an app that will be used by **other businesses** and requires any of
> the permissions listed below must be verified as a Tech Provider."
>
> Source: <https://developers.facebook.com/docs/development/release/access-verification/>

The listed permissions include `ads_management`, `ads_read`, `business_management`, `leads_retrieval`,
`pages_show_list` and `pages_read_engagement`, so the *permissions* match, but the trigger is the app being used
by other businesses, which advertdreams' app is not. Decisions come "within approximately 5 days"; once notified, a
business has 60 days to comply. **[unconfirmed]**, the page contains no sentence explicitly exempting owner-only
apps; the inclusion criterion is simply not met.

**Data Use Checkup (DUC)** is clear and favourable, and it carries a sting for §5:

> "Data Use Checkup is **not required** for developers whose apps have Standard Access to permissions and features."
> "developers do not need to complete DUC while the app is in Development mode, but **will need to complete DUC
> before the app can be switched to Live mode**."
>
> Source: <https://developers.facebook.com/docs/development/maintaining-data-access/data-use-checkup/>

**Data Protection Assessment (DPA)** is an annual questionnaire "for apps accessing certain types of data", with 60
days to complete "or risk losing platform access"
(<https://developers.facebook.com/docs/development/maintaining-data-access/data-protection-assessment/>).
**[unconfirmed]**, Meta publishes no in-scope permission list and no criteria; enrolment is notification-driven
("All app administrators will be notified if Data Protection Assessment is required for each app"). So it cannot be
ruled in or out for an `ads_management` app. Budget for the possibility of a 60-day compliance interrupt landing
without warning.

---

## 4. The tier that actually binds: Marketing API Access Tier

Formerly "Ads Management Standard Access", renamed to **Marketing API Access Tier** with no code change required
(<https://developers.facebook.com/docs/marketing-api/overview/rate-limiting/>). Adding the Marketing API product
to an app puts it in **Limited access** (also called the *development* tier).

| | **Limited access** (default) | **Full access** (*standard* tier) |
|---|---|---|
| How obtained | "Automatically granted when you add the Marketing API product to your app" | Click **+Upgrade** in the App Dashboard once eligible |
| Rate limiting | "Heavily rate-limited per ad account. For development only" | "Lightly rate limited per ad account" |
| Business Manager API | "Limited access to Business Manager and Catalog APIs. **No Business Manager access to manage ad accounts, user permissions, and Pages**" | "Access to all Business Manager and Catalog APIs" |
| System Users | 1 system user + 1 admin system user | 10 system users + 1 admin system user |
| Ad accounts | Unlimited | Unlimited |

Source: <https://developers.facebook.com/docs/marketing-api/overview/authorization>

**Eligibility for Full access** (same source):

- "Have successfully made at least 500 Marketing API calls in the last 15 days"
- "Have made Marketing API calls with an error rate of less than 15% in the last 500 calls"

This threshold was **lowered from 1,500 calls to 500**, so older write-ups (and stale model memory) overstate it.
There is **no ad-spend requirement** documented for either tier. Both authorization pages were checked
specifically for one.

**[unconfirmed], how much of a review the upgrade is.** The authorization page presents it as a self-serve
`+Upgrade` button in the App Dashboard, which reads as automatic once the counters are met. Other Meta pages
describe the same action as requesting the "Marketing API Access Tier" feature *through the App Review dashboard*.
The two descriptions are not obviously reconcilable, and the truthful answer is that this is a **feature** request
rather than a *permission* request, so §3's "App Review is not required" holds for the permissions but may not
hold for this feature. Since Business Verification is stated to be required for Advanced Access generally
(<https://developers.facebook.com/docs/graph-api/overview/access-levels>), **complete Business Verification early
and assume the tier upgrade involves a review step until proven otherwise.**

### A naming trap worth writing down

Meta uses **three overlapping names for the same two tiers**, and the docs disagree with each other and with the
API. They are the same two things:

| API header value (`ads_api_access_tier`) | Older doc wording | Current Marketing API wording |
|---|---|---|
| `development_access` (default) | "Standard Access" | **Limited Access** / "Dev tier" |
| `standard_access` (upgraded) | "Advanced Access" | **Full Access** |

The Graph API rate-limiting page still says Standard/Advanced; the Marketing API pages say Limited/Full; the header
still emits `development_access`. Any doc line reading "Standard Access = 300 calls" is describing the *default*
tier, not an upgrade. **Read `ads_api_access_tier` from the response header at runtime**. It is the only name that has not been rewritten.

### Rate limits, concretely

Business Use Case quota, per ad account, rolling one-hour window
(<https://developers.facebook.com/docs/marketing-api/overview/rate-limiting/>):

| Bucket | Development (Limited) tier | Standard (Full) tier |
|---|---|---|
| `ads_management` | **300 + 40 × active-ads** | 100,000 + 40 × active-ads |
| `ads_insights` | 600 + 400 × active-ads − 0.001 × user-errors | 190,000 + 400 × active-ads − 0.001 × user-errors |
| `custom_audience` | 5,000 + 40 × active-audiences | 190,000 + 40 × active-audiences (cap 700,000) |

**This is the single most important set of numbers in the ticket, and it is worse for advertdreams than it looks.**
The quota is scoped **per ad account**, and the map fixes advertdreams to **one** agency ad account shared by every
Client. The whole business shares one bucket. At launch, with zero active ads, that is **300 `ads_management` calls
per hour, total, across all Clients.**

The `40 × active ads` term is a genuine tailwind, because the quota grows as the account fills with live ads, so the constraint bites hardest exactly when advertdreams has fewest Clients. Insights headroom is comfortable at both
tiers.

### The tighter, less well-known limit: the burst score

Documented separately from the hourly BUC formulas, on the same rate-limiting page, there is an **ad-account-level
score model, per app**:

- Reads cost **1 point**, writes cost **3 points**
- Dev/Limited tier: **max score 60, decaying over 300 s**
- Full tier: max score 9,000, 300 s decay
- Stated ceiling of **100 QPS** for create/edit operations on campaigns, ad sets, and ads
- Ad account spend: max 10 changes/day. Ad set budget: max 4 changes/hour.

**60 points at 3 points per write is roughly 20 write calls before throttling, replenishing over five minutes.**
For a creation-heavy product that is a far harder wall than the hourly 300, and it is the one advertdreams will hit
first. A single Client publish (campaign + ad set + image upload + creative + ad, plus reads) can consume a large
slice of a 60-point budget on its own. **Publishing must be a serialised queue with pacing, not concurrent
fire-and-forget.**

### Throttling signals and the correct response

`X-Business-Use-Case-Usage` is returned as a JSON map keyed by ad-account ID
(<https://developers.facebook.com/docs/graph-api/overview/rate-limiting/>) with:

- `call_count`, `total_cputime`, `total_time`: each a **percentage of allowance**
- `estimated_time_to_regain_access`: minutes until calls are no longer throttled
- `ads_api_access_tier`: `development_access` or `standard_access`
- `type`: `ads_management`, `ads_insights`, `custom_audience`, `pages`, `leadgen`, …

> "Throttling occurs when any percentage reaches 100"

All three percentages are independent kill switches. A CPU-heavy call pattern can throttle at `call_count` 40.

Relevant error codes: **80004** (subcode 2446079) is the Ads Management business-use-case limit; 80000 is Ads
Insights; 4 is the app-level limit; 17 the user-level limit; 613 a custom limit.

**Meta publishes no exponential-backoff formula.** Its documented guidance is blunter: "When the limit has been
reached, stop making API calls", wait `estimated_time_to_regain_access` minutes, and "spread out queries evenly to
avoid traffic spikes". The correct implementation is therefore **header-driven pacing**, pausing when any percentage crosses roughly 75-80, not error-driven retry. By the time an 80004 arrives you are already locked out for the
full window. Also noted in Meta's guidance, and directly relevant here: *"It is better to create a new ad than to
change existing ones."*

### Batching does not help

> "Batch requests are limited to 50 requests per batch." … "Each call within the batch is counted separately for
> the purposes of calculating API call limits and resource limits."
>
> Source: <https://developers.facebook.com/docs/graph-api/batch-requests>

Batching is a **latency** optimisation only, never a quota optimisation. It arguably hurts: a 50-call batch burns
50 units instantly, spikes `total_cputime`, and can time out into a partially-completed batch where failed entries
return `null` and need individual retry.

### Per-ad-account object ceilings

From the [Ad Account reference](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account) limits table:

| Limit | Regular ad account |
|---|---|
| Campaigns (non-archived, non-deleted) | 6,000 |
| Ad sets (non-archived, non-deleted) | 6,000 |
| Ads (non-archived, non-deleted) | 6,000 |
| Archived campaigns / ad sets / ads | 100,000 each |
| Ads per ad set | **50** |
| People with access per ad account | 25 |
| Ad accounts per person | 25 |
| Images per ad account | Unlimited |

Two internal contradictions in Meta's own docs, unresolved: the Ad Set reference says **5,000** ad sets per regular
account where the Ad Account page says 6,000 (plan against 5,000); and the general best-practices page cites "up to
5000 archived objects" against the reference page's 100,000. Once archived objects hit their ceiling "you can no
longer archive more objects". The remedy is transitioning them to `DELETED`
(<https://developers.facebook.com/docs/marketing-api/best-practices/manage-your-ad-object-status/>).

For advertdreams, 6,000 objects in one shared account is not a near-term ceiling, but it *is* a ceiling that scales
with Client count times campaign history, so an archive/delete hygiene policy belongs in the publishing design.

### New-account limits: what is real and what is folklore

- **Meta-set daily spending limits are real and documented** as a distinct mechanism from advertiser-set account
  spending limits. **[unconfirmed]**, the numbers live in Business Help Center articles that render client-side
  and could not be fetched.
- **A per-Page ad volume limit is real**, introduced in 2021 and referenced from
  <https://developers.facebook.com/docs/marketing-api/insights-api/ads-volume/>. It caps ads *running or in review*
  per Page and is keyed to spend history. **[unconfirmed]**, the developer docs do not publish the tier numbers;
  the widely-quoted 250 / 1,000 / 5,000 / 20,000 tiers appear only in third-party blogs and were **not** verified.
  Because advertdreams runs ads from *each Client's own Page* (§6), this limit is per-Client rather than pooled,
  which is the one place the shared-account design works in its favour.
- **"Account warm-up" / "trust tier" is folklore.** No Meta developer documentation uses these terms or describes a
  trust-based ramp. There is no documented API-side restriction on *creating* ads on a brand-new account beyond the
  object limits above. The real constraints are on how many ads may be *running or in review*, and on how fast
  money can leave the account.

### Reporting (Ads Insights), briefly

Not the focus of this ticket, but two facts affect any reporting design
(<https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights/best-practices>):

- Async report jobs return a `report_run_id` that **expires after 30 days**. Do not persist them as long-term handles. Poll `async_status` until Completed with `async_percent_completion` at 100.
- A separate `X-FB-Ads-Insights-Throttle` header carries `app_id_util_pct`, `acc_id_util_pct`, and
  `ads_api_access_tier`. Insights throttling appears as `error_code = 4`.
- **[unconfirmed]** No concurrent async-job cap is documented; a "10 requests per Ad Account per day" line for
  reach/unique-metric breakdowns appeared on one fetch and not on a repeat fetch of the same page.

---

## 5. Sandbox: it does *not* let you build the full flow

This is the finding most likely to change a build plan, and it contradicts the commonly-repeated summary of what
the sandbox does.

The Marketing API sandbox is a real thing, and it is re-enabled and current: you "enable the Marketing API product
in their app dashboard, and then create & link a Sandbox Ad account to it"
([Marketing API Sandbox capability now re-enabled, 2023-06-21](https://developers.facebook.com/blog/post/2023/06/21/marketing-api-sandbox-capability-now-re-enabled/)).
It needs no funding source and delivers no ads, so nothing spends.

But the current Marketing API best-practices doc says, flatly:

> "Sandbox mode is a testing environment to read and write Marketing API calls without delivering actual ads."
> … "**in sandbox mode you cannot create ads or ad creative.** Therefore you should use hard coded ad IDs and ad
> creative IDs to demonstrate your use of our API for app review."
>
> Source: <https://developers.facebook.com/docs/marketing-api/best-practices/#testing>

Other documented sandbox limits:

- **One** sandbox ad account per app, regardless of tier
- Not operable from Ads Manager, API calls only
- **Insights are not supported** (a sandbox generates no live metrics), so reporting cannot be exercised there
  ([2023 re-enablement post](https://developers.facebook.com/blog/post/2023/06/21/marketing-api-sandbox-capability-now-re-enabled/))

**So: campaigns and ad sets can be created in the sandbox; ad creatives and ads cannot, and neither can insights.**
That is roughly the front half of advertdreams' publish flow, and the half that carries the least risk. The creative assembly step is exactly the part that needs testing and exactly the part the sandbox refuses: image upload, `object_story_spec`, Instagram identity, placement validation, policy rejection handling.

**[unconfirmed], highest-value thing to test first.** Developer-forum reports attribute the ad-creative failure
to the *app's mode*, not the sandbox, with a specific error:

> "Ads creative post was created by an app that is in development mode. It must be in public to create this ad."
> (error code 100, subcode 1885183)
>
> Source: <https://developers.facebook.com/community/threads/241942726901332/> *(community forum, not a primary source;
> no Meta staff reply in the thread)*

If that reading is right, flipping the app from **Development mode to Live mode** unblocks creative and ad
creation. Live mode is a dashboard toggle and does **not** by itself require App Review. App Review only governs
whether *non-role* users can be asked for permissions
(<https://developers.facebook.com/docs/development/build-and-test/app-modes>). Since all of advertdreams' API users
have a role, going Live should be permitted.

**But going Live is not free, and this is the correction that matters.** Two costs attach to the toggle:

1. **Data Use Checkup becomes mandatory.** "developers do not need to complete DUC while the app is in Development
   mode, but will need to complete DUC before the app can be switched to Live mode"
   (<https://developers.facebook.com/docs/development/maintaining-data-access/data-use-checkup/>). Staying in
   Development mode is what keeps advertdreams out of the annual compliance treadmill entirely; going Live opts
   into it permanently.
2. The standard app settings become required: privacy policy URL, app icon, category, and a data deletion callback
   or instructions URL
   (<https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback/>).

So the honest framing is a **trade**, not a free unblock: Development mode may make it impossible to create ad
creatives at all, and Live mode buys that capability at the price of an annual DUC. If the forum diagnosis is
correct, advertdreams has no choice, since you cannot ship a publisher that cannot create creatives, but this should be a deliberate decision, and the DUC obligation should be recorded as an ongoing operational cost rather than
discovered a year later as a 60-day access-loss warning.

Meta's release checklist advises *not* switching to Live "before all of the permissions and features that your app
requires have been approved" (<https://developers.facebook.com/docs/development/release/>). That caution is aimed at
apps awaiting App Review; with nothing pending it does not apply, unless the system-user install caveat (§3) turns
out to require the tier feature first, in which case sequence that before going Live.

### The practical testing recommendation

Do not plan around the sandbox as the primary test environment. **Test against the real agency ad account with
every campaign created `PAUSED`.** A paused campaign delivers nothing and spends nothing, exercises the entire
real code path including creative assembly and policy review, and returns real object IDs. Use the sandbox only
for the campaign/ad-set portion and for anything you would rather not create against the production account.

Corollary: **provisioning cannot be deferred.** Building the publish flow needs a real Business Manager, a real ad
account with a funding source attached, and a real Facebook Page and Instagram account. None of that is App
Review, all of it is lead time, and the sandbox does not substitute for it.

---

## 6. The third-party angle Meta actually cares about: the Page, not the ad account

The ticket asks what is different about "an app that manages ads for third-party businesses". The surprise is that
for advertdreams the API-permission answer is *nothing* (§3), because the third parties never touch the app. The
real third-party dependency sits somewhere else entirely: **whose Facebook Page and Instagram account the ad runs
from.**

Every ad creative needs a `page_id`, and Instagram placements need `instagram_user_id` alongside it
([Ad Creative Object Story Spec](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-object-story-spec/)).
A civil-construction lead ad plainly should run from the Client's own Page, not advertdreams'. That means
advertdreams' Business Manager needs **agency access** to each Client's Page:

> "businesses can also request agency access to a page, which will enable them to run ads on the page through ad
> accounts they have access to." … "The Agency can start running ads on the Page (through Ad Accounts they have
> access) right away."
>
> Source: <https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/pages/>

Constraints from that same page:

- **"A business must own the page"** before an agency can claim access to it, so a Client with only a personal Page and no Business Manager has a prerequisite step of their own before onboarding can complete.
- Approval is automatic only if the requester is already a Page admin; otherwise "the page administrator must approve the request", a human, asynchronous step in Client onboarding.
- "The Agency cannot re-share the Page to another Business."
- Doing this **via API** needs `pages_manage_metadata` and `pages_show_list`, and it lives in the Business Manager APIs, which the **Limited tier explicitly withholds** ("No Business Manager access to manage ad accounts, user
  permissions, and Pages", <https://developers.facebook.com/docs/marketing-api/overview/authorization>).

For a sales-assisted, manual v1 this is fine: do the agency Page claim by hand in Business Manager during
onboarding. It is worth knowing now, though, that **automating onboarding later requires the Full tier plus Pages
permissions**, and that the Client-side prerequisite (they need a business-owned Page, and an admin has to click
approve) is a genuine onboarding-funnel step, not a formality.

Separately, Meta expects agencies to declare the arrangement. Business Manager has an explicit "advertising on
behalf of another business" setting
(<https://www.facebook.com/business/help/350066115746201>). **[unconfirmed]**, the Meta Business Help Center
pages render client-side and could not be fetched for verbatim quotes in this session; the exact wording,
mandatory-or-optional status, and consequences of not declaring should be read directly in the Business Manager UI
before launch.

---

## 7. Timelines

| Stage | Stated time | Source |
|---|---|---|
| **Standard Access** | Instant, automatic on creating a Business app and adding the Marketing API product | [authorization](https://developers.facebook.com/docs/marketing-api/overview/authorization/) |
| **App Review decision** | "your submission will be queued and you should receive a decision within a week" | [submission guide](https://developers.facebook.com/docs/app-review/submission-guide) |
| **Access Verification (Tech Provider)** | "a decision will be made within approximately 5 days" | [access verification](https://developers.facebook.com/docs/development/release/access-verification/) |
| **Limited to Full tier** | No review SLA published. Floor is **~15 days** of deliberate traffic to reach 500 calls, then request the upgrade | [rate limiting](https://developers.facebook.com/docs/marketing-api/overview/rate-limiting/) |
| **Business Verification** | **[unconfirmed], no official SLA is published anywhere.** Community figures range from days to weeks and are not primary | n/a |
| **Data Protection Assessment** | The published "60 days" is *your* window to respond, not Meta's turnaround. Meta's turnaround is not published | [DPA](https://developers.facebook.com/docs/development/maintaining-data-access/data-protection-assessment/) |

The widely-repeated "App Review takes about 24 hours" figure could not be confirmed on any primary page; the
primary source says **within a week**. Historically it is rejection-and-resubmit cycles, not the first review, that consume calendar time, but none of that is on advertdreams' path today.

**On the ticket's framing.** The ticket assumed "App Review has a long lead time, so this determines whether
provisioning must start immediately." The premise turns out to be wrong in an interesting way. App Review is not on advertdreams' critical path at all, **but the conclusion survives**, for entirely different reasons:

- Business Verification has **no published SLA** and requires a **registered legal entity** with formation
  documents and a tax ID. For a solo builder that may be the longest lead time in the project, and it gates every
  "later" option.
- The Full-tier upgrade has a hard **15-day usage floor** that cannot be compressed by wanting it sooner.
- The sandbox **cannot create ads or creatives** (section 5), so a real Business Manager, ad account, funding
  source, Page and Instagram account are needed before the publish flow can even be written, let alone tested.

Provisioning should start immediately. The reasoning in the ticket was wrong; the instinct was right.

---

## 8. What this means for advertdreams

1. **No App Review submission is needed for the ads permissions in v1.** Standard Access on `ads_management` and
   `ads_read`, held by a System User in advertdreams' own Business Manager, covers campaign / ad set / creative /
   ad creation. The item the map treated as the longest pole is not one.
2. **The load-bearing assumption is "no Client ever authenticates with Meta."** It is precisely the map's
   agency-ad-account constraint that buys the exemption. Meta's wording is "if your app is managing other people's
   ad accounts, you need advanced access." Any future feature where a Client connects their own ad account via
   Facebook Login flips advertdreams into Advanced Access, then App Review, then Business Verification, and
   probably Tech Provider verification too. **This deserves an ADR**, because it is exactly the kind of constraint
   a later feature request violates casually.
3. **Resolve the system-user install question first (section 3).** "Only apps with Ads Management API standard
   access and above can be installed" may mean the tier feature is needed on day one rather than at scale. It is a
   short experiment and it determines the whole provisioning sequence. **Do this before anything else.**
4. **Design publishing as a paced, serialised queue from the start.** The binding limit is not the hourly 300. It is the Limited-tier **burst score of 60 with writes costing 3 points**, roughly 20 writes before throttling,
   replenishing over five minutes. Pace off the `X-Business-Use-Case-Usage` percentages; do not retry into an
   80004. This is a design input for the publishing component, not an ops footnote.
5. **Get to Full tier before the first paying Client.** 500 clean calls over 15 days is easy to hit deliberately
   during development. Do it on purpose rather than discovering the ceiling in production.
6. **Start Business Verification now,** and note it needs a registered entity. Nothing in v1 has been *confirmed*
   to require it, but it gates everything later, it is slow, and its duration is unknowable in advance.
7. **Build against the real ad account with every campaign created `PAUSED`.** The sandbox covers campaigns and ad
   sets only. Provision Business Manager, ad account, funding source, Page and Instagram account now.
8. **Client Page access is the real onboarding bottleneck, not API access.** Each Client needs a *business-owned*
   Page and an admin who approves advertdreams' agency claim. That belongs in the onboarding spec, and it is a
   human, asynchronous step with a real drop-off rate.
9. **Going Live is a trade, not a free toggle** (section 5): it likely unblocks creative creation but permanently
   opts advertdreams into the annual Data Use Checkup.
10. **Nothing here forecloses the map's deferred items.** Google Ads, video creative, further verticals and CRM
    integrations are all unaffected.

---

## 9. Open risks and unknowns

Ranked by how much each could change the plan.

| Risk / unknown | Why it matters | Status |
|---|---|---|
| **System-user install may require the Ads Management Standard Access feature** | Would move the tier request from "later" to "day one" and reorder provisioning | **[unconfirmed]**, docs contradict; cheap to test, test first |
| **Sandbox cannot create ads or ad creatives** | The riskiest half of the publish flow cannot be tested in isolation; forces a real ad account | **Confirmed** from primary docs (section 5) |
| **Does Live mode unblock creative creation?** | Determines whether the publisher is buildable at all in Development mode | **[unconfirmed]**, forum diagnosis only; verify early |
| **Live mode permanently triggers annual Data Use Checkup** | Ongoing compliance cost, with loss of platform access as the failure mode | **Confirmed** (section 3), consequence of an unconfirmed necessity |
| **Business Verification needs a registered legal entity** | Solo builder; tax ID, formation documents, beneficial-owner ID. No confirmed Individual Verification path to Advanced Access | **[unconfirmed]** for the individual path; **confirmed** for the document list |
| **Business Verification duration** | Potentially the longest lead time in the project, and unknowable in advance | **[unconfirmed]**, no SLA published |
| **Data Protection Assessment applicability** | Could arrive unannounced with a 60-day clock and platform access at stake | **[unconfirmed]**, Meta publishes no criteria |
| **Single-account policy blast radius** | The map already flags this. Rate limits *and* policy enforcement both concentrate on one ad account serving every Client | **Structural**, mitigation is a separate decision |
| **Whether Standard Access reaches a Page owned by another business** | If a system user at Standard Access cannot act on a Client's Page, the model needs rethinking | **[unconfirmed]**, no doc addresses it; highest-consequence unknown after the install question |
| **Per-Page ad volume limit tiers** | Caps ads running-or-in-review per Client Page, keyed to spend history | Limit is **real and documented**; the 250/1,000/5,000/20,000 numbers are **[unconfirmed]** blog folklore |
| **6,000 objects per ad account** | Scales with Clients times campaign history in one shared account; needs an archive/delete hygiene policy | **Confirmed**, though Meta's docs are internally inconsistent (5,000 vs 6,000 ad sets, so plan for 5,000) |
| **"On behalf of another business" declaration** | Compliance obligation for the agency model | **[unconfirmed]**, Business Help Center pages render client-side and could not be fetched |
| **API version deprecation cadence** | `instagram_actor_id` was retired 2025-09-09 mid-flight; Meta deprecates versions on a roughly two-year cycle | Ongoing maintenance cost to budget for |

### If lead capture ever moves to Meta Lead Ads

Out of scope today, since the map fixes lead capture as a landing page form plus a tracking phone number, but worth recording: `leads_retrieval` follows the **Page**, not the ad account
(<https://developers.facebook.com/docs/permissions/reference/leads_retrieval>). Lead forms on Client Pages mean
reading other businesses' data, which weakens the Standard Access argument badly. Lead forms on advertdreams' own
Page would be fine. This is a second, non-obvious way the App Review exemption could be lost.

---

## 10. Method and limitations

- All Meta developer documentation was fetched live on 2026-08-23. Direct `curl` against `developers.facebook.com`
  is bot-blocked and returns a stub, so everything went through a rendering fetcher.
- **Meta Business Help Center pages (`facebook.com/business/help/...`) render client-side and returned title-only
  content.** Nothing was verified from them. This affects Business Verification duration and document specifics,
  the per-Page ad volume tiers, Meta-set daily spending limits, and the "advertising on behalf of another business"
  declaration. Each is flagged **[unconfirmed]** above.
- Where only developer-forum threads exist, they are cited as forum threads and labelled non-primary.
- Meta's documentation contradicts itself in at least four places found here: the Limited/Full vs Standard/Advanced
  vs `development_access`/`standard_access` naming; 5,000 vs 6,000 ad sets per account; 5,000 vs 100,000 archived
  objects; and whether system-user app installation requires a requested feature. Where unresolved, the
  conservative number is recommended and the contradiction is stated rather than smoothed over.
