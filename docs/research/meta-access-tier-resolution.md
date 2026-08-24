# Resolving the access-tier conflict: Standard vs Full Access for agency-owned, per-Client ad accounts

Research for [#18](https://github.com/TempleZide/advertdreams/issues/18). Verified against live Meta developer
documentation on **2026-08-24**. Every claim carries the URL it came from. Claims that could not be settled from a
primary source are marked **[unconfirmed]**.

Resolves the contradiction between [#3](https://github.com/TempleZide/advertdreams/issues/3) and
[#4](https://github.com/TempleZide/advertdreams/issues/4) under the structure the map now fixes: **ad accounts owned
by advertdreams' business portfolio, one per Client, running ads that promote Client-owned Pages shared to us as
client assets with the `ADVERTISE` task.**

---

## 1. Verdict

**#4 is upheld on the App Review question. #3 is overturned on the access-tier question.**

No App Review is required, and Marketing API **Full Access is not a legal prerequisite** for the structure the map
describes. #3's claim — "Marketing API **Full Access** is a hard prerequisite for managing other people's ad
accounts" — rests on a terminology merge that Meta's own docs contradict. #3 quoted the authorization page's
"advanced access" sentence and glossed it inline as "advanced [Full]", treating the Graph API **Access Level**
(Standard / Advanced) and the Marketing API **Access Tier** (Limited / Full) as one axis. They are two independent
axes with two independent gates, and Meta renamed the second axis using the first axis's old words, which is how the
merge happened.

The thing that settles it is that the ad accounts are **ours**. #4's conclusion was reached on a premise that has
since been discarded (one pooled agency account), but the premise that actually carried the conclusion — *no Client
ever holds or grants a token, and we operate ad accounts we own* — survives the switch to one-account-per-Client
intact. Splitting one owned ad account into N owned ad accounts does not make any of them "other people's".

Full Access is still worth having, for two reasons that have nothing to do with permissions or review: rate limits,
and the Business Manager API needed to provision accounts programmatically (§6). It is a scaling upgrade, not a gate.

| Question | Answer |
|---|---|
| Access Level for `ads_management` / `ads_read` | **Standard** — auto-granted, sufficient |
| App Review required? | **No** |
| Business Verification required? | **Not for this** (still wanted for other reasons — see §7) |
| Marketing API Access Tier needed | **Limited** works; **Full** wanted for rate limits and BM API |
| Does agency-owned-vs-Client-owned change the answer? | **Yes, decisively** — see §3 |
| Can the full publishing flow be built on the dev tier? | **Yes, against a real ad account.** Not in sandbox — see §5 |

> **Scope of §1–§11: `ads_management` and `ads_read` only.** [#5](https://github.com/TempleZide/advertdreams/issues/5)
> subsequently made Lead Ads the primary lead capture mechanism, adding **`leads_retrieval`** — which lands on the
> *other* side of every answer above: **Advanced Access, App Review, and Business Verification are all required for
> it.** See **§12**. Nothing in §12 disturbs §1–§11; the permission set simply splits across both axes.

---

## 2. The two axes, kept apart

Meta uses the words "standard" and "advanced" for two unrelated things, and then renamed one of them. This is the
entire source of the conflict, so it is worth pinning to verbatim quotes.

### Axis A — Access Level (platform-wide, per permission)

Defined by *whom you may request the permission from*, not by what the permission does:

> "Permissions with Standard Access can only be requested from app users who have a role on the requesting app."
>
> "Permissions with Advanced Access can be requested from any app user, and features with Advanced Access are active
> for all app users."
>
> — <https://developers.facebook.com/docs/graph-api/overview/access-levels>

Standard Access is free and automatic:

> "All Business, Consumer, and Gaming apps are automatically approved for Standard Access for all permissions and
> features."
>
> — <https://developers.facebook.com/docs/graph-api/overview/access-levels>

> "Business apps are automatically approved for standard access for all permissions and features available to the
> Business app type."
>
> — <https://developers.facebook.com/docs/marketing-api/overview/authorization>

Advanced Access is what costs money and time:

> "Business Verification is required to get Advanced Access. In some cases additional App Review on an individual
> permission and feature basis might be required."
>
> — <https://developers.facebook.com/docs/graph-api/overview/access-levels>

### Axis B — Marketing API Access Tier (Marketing API only, per app)

Gated on **usage counters**, not on a use-case narrative:

> "'Standard Access' is now Limited Access, and 'Advanced Access' is now Full Access."
>
> — <https://developers.facebook.com/docs/marketing-api/overview/rate-limiting/>

That single sentence is the trap. It reuses Axis A's vocabulary for Axis B's tiers, and it is why #3 read one
sentence about Axis A as a statement about Axis B.

| | **Limited Access** (default) | **Full Access** |
|---|---|---|
| How obtained | "Automatically granted when you add the Marketing API product to your app" | "Click **+Upgrade** for the Marketing API Access Tier feature in your App Dashboard" |
| Rate limiting | "Heavily rate-limited per ad account. For development only." | "Lightly rate limited per ad account" |
| Ad accounts | "Manage an unlimited number of ad accounts. App admins or developers can make API calls on behalf of ad account admins or advertisers." | "Manage an unlimited number of ad accounts, assuming you get `ads_read` or `ads_management` permission from the ad account." |
| Business Manager API | "Limited access to Business Manager and Catalog APIs. **No Business Manager access to manage ad accounts, user permissions, and Pages.**" | "Full access to all Business Manager and Catalog APIs" |
| System users | "Can create 1 system user and 1 admin system user." | "Can create 10 system users and 1 admin system user." |

— all rows quoted from <https://developers.facebook.com/docs/marketing-api/overview/authorization>

Eligibility for Full Access, same page:

> "In order to get Full access of Marketing API Access Tier, your app needs to meet these requirements: Have
> successfully made at least 500 Marketing API calls in the last 15 days. Have made Marketing API calls with an
> error rate of less than 15% in the last 500 calls."

**Note the Limited-Access "Ad accounts" row.** Even the default tier is documented as managing an *unlimited* number
of ad accounts. Whatever Full Access buys, it is not the right to touch more accounts. That row alone falsifies "Full
Access is a hard prerequisite for managing per-Client ad accounts".

---

## 3. The deciding question: are these "other people's ad accounts"?

The sentence both tickets quoted, verbatim and current as of 2026-08-24:

> "If your app is only managing your ad account, standard access to the `ads_read` and `ads_management` permissions
> are sufficient. If your app is managing other people's ad accounts, you need advanced access to the `ads_read`
> and/or `ads_management` permissions."
>
> — <https://developers.facebook.com/docs/marketing-api/overview/authorization>

**No.** Under the map's structure the ad accounts are advertdreams' own, and three independent sources agree on where
the line falls.

**a. The permission's own definition draws the line at ownership, not at who benefits:**

> `ads_management` "allows your app to read and manage the Ads account it **owns**, or has been granted access to, by
> the Ad account owner."
>
> — <https://developers.facebook.com/docs/permissions/reference/ads_management> (emphasis added)

advertdreams' business portfolio owns every one of these ad accounts. First clause, not second.

**b. Axis A is defined by who grants the token, and no Client ever grants one.** Standard Access permissions "can
only be requested from app users who have a role on the requesting app". The only token in this system is a System
User token issued inside advertdreams' own Business Manager, which owns and has claimed the app. The App Review
overview states the exemption in wider terms than #4 quoted it:

> "If your app will be used by anyone without a Role on the app or a role in a Business that has claimed the app, it
> must first undergo App Review. If your app will only be used by app users who have a role on the app itself, App
> Review is not required."
>
> — <https://developers.facebook.com/docs/app-review/>

The phrase "**or a role in a Business that has claimed the app**" covers a System User in advertdreams' business
directly. No Client ever completes a Facebook Login, so there is no app user outside the business, so App Review
never triggers.

**c. The Client-owned Page arrives by a different mechanism entirely.** The Page is shared business-to-business as a
client asset in Business Manager. That is asset sharing, not an app-permission grant, and Axis A only speaks about
app-permission grants. Meta's own agency guide describes the result plainly:

> "The Agency can start running ads on the Page (through Ad Accounts they have access) right away."
>
> — <https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/pages>

The same page confirms `client_pages` "returns a list of pages that belong to clients of a Business Manager", that
the Advertiser role is `['ADVERTISE', 'ANALYZE']` and lets a user "create ads for the Page and view insights", and
that the claim call itself needs only `pages_manage_metadata` and `pages_show_list`. No access-tier requirement is
stated anywhere in that flow.

### So: does agency-owned vs Client-owned change the required tier?

**Yes, and it is the whole answer.** The two structures land on opposite sides of the quoted sentence:

| Structure | Ad account owner | Token source | Access Level | App Review |
|---|---|---|---|---|
| **The map's structure** — agency-owned account per Client, Client Page shared in | advertdreams | System User in advertdreams' BM | **Standard** | **No** |
| **The alternative** — Client keeps their own ad account, grants us access | The Client | Client's Facebook Login, or their BM granting our app access | **Advanced** | **Yes** — plus Business Verification |

Policy 10.5 forced the split into per-Client accounts, but it did not push advertdreams across this line, because it
did not change *who owns* the accounts. #3 correctly identified the policy and then drew the wrong consequence from
it: it inferred that "one advertiser per account" implies "the advertiser's account", when the map's answer to 10.5
is one *advertdreams-owned* account per advertiser.

Corroboration from the provisioning API: creating an owned ad account requires the fields `name`, `currency`,
`timezone_id`, **`end_advertiser`**, `media_agency`, and `partner`
(<https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/ad-accounts>). The
`end_advertiser` field exists precisely so an agency-owned account can name the one end advertiser it serves — which
is the 10.5 accountability signal, expressed on an account we own. Meta models this structure as a first-class case.

---

## 4. Resolving #4's biggest flagged unknown: the system-user install requirement

#4 flagged this as "the most likely place this plan snags" and left it unresolved:

> "Only apps with Ads Management API standard access and above can be installed."
>
> — <https://developers.facebook.com/docs/business-management-apis/system-users/install-apps-and-generate-tokens/>

**It resolves benignly, via Meta's own rename statement.** "Ads Management API standard access" is the pre-rename
name for the Marketing API Access Tier, and the rate-limiting page states the mapping outright: *"'Standard Access'
is now Limited Access."* So "standard access **and above**" reads, in current vocabulary, as "**Limited Access and
above**" — which every app has automatically the moment the Marketing API product is added to it. The install
requirement is satisfied by default and is **not** a day-one blocker.

**[partially unconfirmed]** No single page states this equivalence in one sentence; it is an inference chaining two
primary quotes. The counter-reading — that "standard access" names a requestable feature — is inconsistent with the
Limited-Access row promising "1 system user and 1 admin system user", which would be an empty promise if a Limited
app could not install an app for a system user at all. That internal consistency is what tips it. **Cheap live test:**
add the Marketing API product to a fresh Business app and try to install it for a system user before touching
anything else. One afternoon settles it permanently.

Related, from the same doc family and worth reading carefully rather than panicking about — the system-users overview
lists as a prerequisite that "the Meta app go through an app review (and Business verification) for the permissions
the system user wants access to"
(<https://developers.facebook.com/docs/business-management-apis/system-users/overview/>). This is generic
boilerplate written for the Advanced-Access case; permissions held at Standard Access have, by definition, already
been "approved" (see the automatic-approval quotes in §2). It does not create a review requirement that §3 rules out.

---

## 5. Can the full publishing flow be built and tested on the dev tier?

**Yes — against a real ad account, not against the sandbox.** This is the constraint that shapes the build plan.

> "Sandbox mode is a testing environment to read and write Marketing API calls without delivering actual ads."
>
> "**In sandbox mode you cannot create ads or ad creative.**"
>
> — <https://developers.facebook.com/docs/marketing-api/best-practices/>

Campaigns and ad sets can be created in sandbox; the two objects at the heart of advertdreams' product — the creative
and the ad — cannot. The sandbox is therefore useless for validating the thing that actually needs validating.

The workable plan, and it is not a compromise:

- Build against a **real ad account in advertdreams' own business portfolio**, on **Limited Access**, with every
  campaign created `PAUSED`. Nothing delivers, nothing spends, and the full object graph — campaign, ad set, image
  upload, creative, ad — is exercised for real.
- Limited Access permits this outright: "Manage an unlimited number of ad accounts", `ads_management` at Standard
  Access, unlimited ad accounts at either tier.
- The dev-tier rate limits are the only friction: **300 + 40 × active-ads** `ads_management` calls per hour per ad
  account, and an ad-account-level burst score of **max 60, decaying over 300 s, with reads costing 1 point and
  writes costing 3** (<https://developers.facebook.com/docs/marketing-api/overview/rate-limiting/>) — roughly 20
  writes before throttling. Irritating for a build loop; not a blocker, and it forces the paced serial publish queue
  the product needs anyway.
- **This build traffic is what qualifies the app for Full Access.** 500 calls in 15 days is a low bar for a build
  phase that is creating and tearing down real objects. The upgrade arrives as a by-product of building, which is
  presumably the design intent.

**Consequence for provisioning:** the sequence is *build on Limited against a real owned ad account → accumulate 500
clean calls → click +Upgrade → get Full before the first paying Client*. There is nothing to start now that gates
anything, which directly answers #18's framing question: **App Review does not start now, and does not start at all
for v1.**

---

## 6. Why Full Access is still wanted (and it is not about permissions)

Two rows of the tier table have real teeth for this product:

**a. Rate limits, and the good news that per-Client accounts brought.** The `ads_management` BUC quota is scoped
**per ad account**. Under #4's pooled-account premise that was the ticket's headline risk — one 300/hour bucket for
the entire business. Under the actual per-Client structure, **each Client gets their own bucket**. The single worst
number in #4 was an artefact of the discarded premise and should not be carried forward. What survives is the
per-account burst score of 60 (≈20 writes per 5 minutes), which still shapes a single Client's publish as a paced
serial queue, and the app-level ceiling that no per-account split relieves.

**b. Business Manager API access is what actually motivates the upgrade.** Verbatim, the Limited Access row:

> "Limited access to Business Manager and Catalog APIs. **No Business Manager access to manage ad accounts, user
> permissions, and Pages.**"
>
> — <https://developers.facebook.com/docs/marketing-api/overview/authorization>

A one-account-per-Client model means **provisioning an ad account is an onboarding step that recurs for every
Client**. That is exactly the capability Limited Access withholds. On Limited, each new Client's ad account gets
created and assigned by hand in the Business Manager UI. Fine for the first handful of Clients; it is the automation
ceiling on onboarding, and Full Access is how it lifts.

**A hard cap worth knowing before designing automated onboarding:**

> "Ad account creation using the API is limited to 5 ad accounts."
>
> — <https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/ad-accounts>

**[unconfirmed]** whether that is 5 total, 5 per day, or a starting allowance that grows — the page states it flatly
with no window and no growth rule. Under a one-account-per-Client model this is potentially a hard ceiling on
API-driven onboarding at **five Clients**, which would matter far more than any tier question. Business Manager also
applies its own separate ad-account creation limits, tied to spend history, which are documented only in the
bot-blocked Business Help Center. **Flagged for [#16](https://github.com/TempleZide/advertdreams/issues/16): verify
this number against a real Business Manager before automated onboarding is designed.**

Also worth noting: Limited Access allows "1 system user and 1 admin system user". advertdreams' design needs exactly
one publishing system user, so the cap is not binding today.

---

## 7. What App Review would demand, if it were ever needed

It is not needed for v1. Recording it because one specific product decision would trigger it — see §8.

**Timeline, from the primary source:**

> "you should receive a decision within a week"
>
> — <https://developers.facebook.com/docs/app-review/submission-guide>

One week for a *decision*, not for approval. Rejection-and-resubmit cycles are the real cost, and no resubmission
turnaround is published. **[unconfirmed]** — no SLA covers rejection loops, and Business Verification (a Step 1.5
prerequisite) has **no published SLA anywhere**, which makes it the genuinely unbounded item.

**What a submission demands** (<https://developers.facebook.com/docs/app-review/submission-guide>):

- App complete, publicly accessible or with access instructions provided; 1024×1024 icon; privacy policy URL; app
  purpose, category, primary contact email
- "Make at least 1 successful API call using each permission for which you are requesting advanced access. Calls
  must be made within 30 days of submitting for App Review" — the request button stays inert until Meta has logged one
- Business Verification, prompted at Step 1.5
- Screen recordings in English at 1080p or better, showing the permission grant and the feature in use
- "Each permission and feature must have its own description. Do not copy and paste."

For `ads_management` specifically (<https://developers.facebook.com/docs/permissions/reference/ads_management>), the
reviewer wants a use-case description giving "specific examples explaining why the app needs ad management
capabilities on behalf of other businesses", plus three screencasts: the complete Facebook Login flow showing the
permission being granted; how a business reaches ads performance data in the app; and metrics actually displayed —
impressions, conversions, spend, clicks, reach.

**Read that list against advertdreams and the exemption becomes obvious.** Every requirement presumes a Facebook
Login flow that advertdreams does not have and a third-party business that grants the app access. There is no
Advanced Access narrative available for a single-tenant agency app, because Advanced Access is not the path such an
app is meant to take. The absence of a story to tell reviewers is evidence of exemption, not of a gap in the plan.

---

## 8. Policy 10.4: the access-decay rule

**The rule, verbatim:**

> "Standard and Advanced Ads API access may be downgraded to Development access after 30 days of non-use."
>
> — Meta Developer Policies §10.4, <https://developers.facebook.com/devpolicy/>

**Translated through the rename** ("'Standard Access' is now Limited Access, and 'Advanced Access' is now Full
Access"): **Full Access may be downgraded to the development/Limited tier after 30 days of non-use.** The window is
**30 days**, and it is stated as "may be" — discretionary, not automatic.

**What counts as use — [unconfirmed], with a defensible working answer.** §10.4 does not define "use". No page does.
The only quantitative usage bar Meta publishes anywhere for this tier is the maintenance clause on the authorization
page, and it is identical to the qualification bar:

> "If you're approved for advanced access, you need to do the following to maintain your status: Have successfully
> made at least 500 Marketing API calls in the last 15 days. Have made Marketing API calls with an error rate of less
> than 15% in the last 500 calls."
>
> — <https://developers.facebook.com/docs/marketing-api/overview/authorization>

Note that this is a **stricter** standard than §10.4's, and it is the one Meta actually instruments: 500 successful
calls per rolling 15 days, not merely "some call within 30 days". Two documents, two thresholds, no page reconciling
them. **Operate to the stricter one and §10.4 never gets a chance to bite.**

**The recovery path — [unconfirmed] in the docs, but structurally clear.** No page describes restoration after a
10.4 downgrade. What is documented is that the upgrade itself is a self-serve "+Upgrade" button gated purely on the
two usage counters, with no narrative review and no human in the loop. A downgraded app that resumes traffic
therefore re-qualifies on the same counters and re-upgrades by the same button. **The realistic cost of decay is
roughly 15 days of running at dev-tier rate limits while the 500-call counter refills — not a re-application, not a
review, not Business Verification.** That is a bad afternoon for a Client mid-campaign, not an existential risk.

**Why this matters more than it looks for a solo builder.** The hazard is not the rule; it is the shape of the work.
Gaps between build sessions are exactly the failure mode, and the downgrade lands silently — the first symptom is
throttling on a live Client publish.

**Mitigations, in order of laziness:**

1. **Once Clients are live, the problem evaporates.** Routine insights polling across N Client accounts clears 500
   calls per 15 days without trying. The window of exposure is the pre-revenue build phase and any post-launch lull.
2. **A cron'd keep-alive** — a trivial scheduled read (account info, campaign list) at a cadence that keeps a rolling
   15-day window above 500 successful calls. ~35 calls/day. Cheapest possible insurance, and it doubles as a liveness
   check on the token.
3. **Read `ads_api_access_tier` from the `X-Business-Use-Case-Usage` response header on every call** — it reports
   "Limited access" or "Full access"
   (<https://developers.facebook.com/docs/marketing-api/overview/rate-limiting/>). It is the only tier name Meta has
   never rewritten, and a change in it is the earliest possible warning that a downgrade has happened. Alert on it.

**What would settle the unknowns:** nothing available to automated fetch. The definition of "use" and the recovery
path are not published on `developers.facebook.com`. They would be settled by a support ticket to Meta Developer
Support, or empirically by watching the header after a deliberate quiet period. Neither is worth doing pre-emptively;
mitigation 2 makes the question moot for about ten lines of code.

---

## 9. Corrections to the record

| Prior claim | Ticket | Status |
|---|---|---|
| "Marketing API Full Access is a hard prerequisite to manage other people's ad accounts" | #3 | **Overturned.** Conflates Access Level with Access Tier. Settled by <https://developers.facebook.com/docs/marketing-api/overview/rate-limiting/> ("'Standard Access' is now Limited Access") plus the Limited-Access row promising unlimited ad accounts. |
| "Business Verification is required because our app will be granted permissions by many external Client businesses" | #3 | **Overturned as stated.** No external business ever grants our *app* a permission; Pages arrive by business-to-business asset sharing. Verification is not gated on this. (Still likely wanted for payment instruments and account limits — outside this ticket, see [#15](https://github.com/TempleZide/advertdreams/issues/15).) |
| "No App Review needed; Standard Access + System User is sufficient" | #4 | **Upheld**, and now on firmer ground than #4 had: the App Review exemption covers "a role in a Business that has claimed the app", and `ads_management` is defined by account *ownership*. |
| "One 300/hour bucket shared by every Client" | #4 | **Obsolete.** Artefact of the pooled-account premise. Quota is per ad account; per-Client accounts give each Client their own bucket. |
| "[unconfirmed] Only apps with Ads Management API standard access can be installed — may reorder provisioning" | #4 | **Resolved benignly** (§4). Pre-rename wording for "Limited Access and above", which is automatic. Confirm with one live install test. |
| "[unconfirmed] Whether Standard Access on a system user token reaches a Page owned by another business" | #4 | **Resolved by mechanism, not by explicit sentence** (§3c). Asset sharing is not an app-permission grant, and Meta's agency guide says the agency "can start running ads on the Page... right away". No doc states it in one sentence; worth a live check at first Client onboarding. |
| "Policy 10.4: Full Access downgraded after 30 days of non-use" | #3, #4 | **Confirmed verbatim** (§8). Definition of "use" and recovery path remain unconfirmed; working answer and mitigation given. |

---

## 10. Remaining unknowns

- **[unconfirmed] The 5-ad-account API creation cap** (§6). Highest-consequence open item in this ticket, and it is
  an onboarding-automation question, not an access question. Verify against a real Business Manager.
- **[unconfirmed] What counts as "use" under §10.4, and the recovery path** (§8). Mitigated to irrelevance by a
  keep-alive; would need Meta Developer Support to settle definitively.
- **[unconfirmed] Business Verification SLA.** Not published anywhere. Unbounded by construction.
- **[unconfirmed] Whether Live mode is required for creative creation.** Inherited from #4, still unresolved; the
  sandbox limitation is confirmed, the Live-mode workaround is not. Note the trade #4 identified: switching to Live
  permanently triggers the annual Data Use Checkup, which Standard-Access apps in Development mode are exempt from
  (<https://developers.facebook.com/docs/development/maintaining-data-access/data-use-checkup/>).
- **Method note:** every `facebook.com/business/help/*` page remains bot-blocked to automated fetch, re-confirmed
  this session. Business-Manager-side limits (per-account spend caps, ad-account creation allowances, the
  "advertising on behalf of another business" declaration) can only be read from a logged-in browser.

---

## 11. Sources

- <https://developers.facebook.com/docs/marketing-api/overview/authorization> — tier table, the "other people's ad accounts" sentence, Full Access eligibility and maintenance
- <https://developers.facebook.com/docs/graph-api/overview/access-levels> — Standard vs Advanced definitions, automatic approval, Business Verification requirement
- <https://developers.facebook.com/docs/marketing-api/overview/rate-limiting/> — the rename statement, BUC quotas, burst score model, `ads_api_access_tier` header
- <https://developers.facebook.com/docs/permissions/reference/ads_management> — permission definition ("owns, or has been granted access to"), dependencies, App Review requirements
- <https://developers.facebook.com/docs/app-review/> — when App Review is and is not required
- <https://developers.facebook.com/docs/app-review/submission-guide> — submission prerequisites, steps, one-week decision
- <https://developers.facebook.com/devpolicy/> — Policy 10.4, 10.5, 10.6, 10.7, 10.8
- <https://developers.facebook.com/docs/business-management-apis/system-users/overview/> — system user definition, prerequisites
- <https://developers.facebook.com/docs/business-management-apis/system-users/install-apps-and-generate-tokens/> — the install requirement, token generation, supported scopes
- <https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/pages> — `client_pages`, ADVERTISE task, agency running ads on client Pages
- <https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/ad-accounts> — ad account creation endpoint, `end_advertiser` field, 5-account cap
- <https://developers.facebook.com/docs/marketing-api/best-practices/> — sandbox limitations
- <https://developers.facebook.com/docs/development/maintaining-data-access/data-use-checkup/> — DUC exemption for Standard Access apps in Development mode

---

## 12. Addendum — `leads_retrieval` (added after [#5](https://github.com/TempleZide/advertdreams/issues/5) resolved)

[#5](https://github.com/TempleZide/advertdreams/issues/5) made Lead Ads the primary lead capture mechanism, on the
grounds that they are the only channel carrying per-lead campaign attribution. That adds `leads_retrieval` to the
question, and it does **not** land where `ads_management` did.

### 12.1 Verdict: #5 is right. App Review *is* required — for this permission only

**The permission set splits across both axes.** This is the single most important correction to §1, and it does not
disturb any of it.

| Permission | Access Level | App Review | Business Verification | Works in Dev mode? |
|---|---|---|---|---|
| `ads_management` | **Standard** — automatic | **No** | No | Yes |
| `ads_read` | **Standard** — automatic | **No** | No | Yes |
| `leads_retrieval` | **Advanced** | **Yes** | **Yes** | **No** (except app-role users) |
| `pages_manage_ads` | **Advanced** (rides along) | **Yes** — same submission | Yes | — |

The Lead Ads guide states it flatly, with no owner-only carve-out:

> "To retrieve lead data, your app must undergo App Review. You must include the `leads_retrieval` and
> `pages_manage_ads` permissions in your submission."
>
> — <https://developers.facebook.com/docs/marketing-api/guides/lead-ads/>

The same page states Business Verification follows approval. This is a **permission-specific** requirement, and it
beats the generic exemption on the App Review overview page that §3b relied on for `ads_management`. Specific over
general — that is why the two permissions separate.

### 12.2 Why it separates: the asymmetry is real

§3 turned on ownership: our portfolio **owns** the ad accounts, so `ads_management` sits in its own definition's first
clause ("the Ads account it **owns**"). **We do not own the Pages.** The Client owns the Page, the lead form lives on
the Page, and the lead is Page data belonging to another business. There is no ownership clause to land in.

The grant chain is also longer, and every link is a separate gate:

1. The Client's business shares the Page to ours as a client asset with `ADVERTISE` (ads run — §3c).
2. **Leads Access Manager** is a *second, separate* grant on the same Page, and it is not implied by the first:
   > "If the Page admin did not customize leads and has not granted access permission with the Leads Access Manager,
   > then all Page admins will have leads access permission."
   > — <https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving>

   The default is permissive, but any Client who has ever customised leads access must grant us explicitly. This
   confirms #3's "lead access is a second gate" finding and #5's per-Client Leads Access grant.
3. Our app must hold `leads_retrieval` at **Advanced Access**, which is where App Review enters.

Reading leads needs, verbatim from the retrieval guide: "A Page or User access token requested by a person who can
advertise on the ad account", with `ads_management`, `leads_retrieval`, `pages_show_list`, `pages_read_engagement`,
`pages_manage_ads` for full lead-level data. Note the token type — Meta recommends a **long-lived Page token** for
lead ads, not the system user token that carries the publishing flow. Two credential paths, not one.

### 12.3 One App Review submission, not several

**One submission covering `leads_retrieval` + `pages_manage_ads`.** Submissions are per-app and bundle multiple
permissions; the guide names both in a single sentence about a single submission. Within it, "Each permission and
feature must have its own description. Do not copy and paste."
(<https://developers.facebook.com/docs/app-review/submission-guide>) — so two narratives and two screencast sets,
one submission, one decision.

`ads_management` and `ads_read` **stay at Standard Access and stay out of the submission.** §3 is untouched: nothing
about needing Advanced Access for `leads_retrieval` drags the ads permissions up with it.

**[unconfirmed] — the one thing that could change that.** `leads_retrieval`'s permission reference lists as
dependencies: `Ads Management Standard Access`, `ads_management`, `ads_read`, `business_management`,
`pages_manage_ads`, `pages_read_engagement`, `pages_show_list`
(<https://developers.facebook.com/docs/permissions/reference/leads_retrieval>). **No Meta page states whether a
dependency must be held at the same access level as the permission depending on it** —
<https://developers.facebook.com/docs/permissions/> was checked specifically for this and is silent. If dependencies
must match, the submission grows to include `ads_management`, `ads_read` and `business_management` at Advanced
Access, and §1's "Standard is enough" becomes true only for a product without Lead Ads. **This is the highest-value
unknown in the whole ticket.** It is also cheap to settle: open App Review → Permissions and Features in the App
Dashboard and select `leads_retrieval`; the dashboard will either auto-select the dependencies or not. Ten minutes,
no submission required.

Note also `Ads Management Standard Access` appearing in that dependency list — the Marketing API Access Tier feature
(§2, Axis B) is a stated dependency of `leads_retrieval`. Under the rename that reads as "Limited Access and above"
(§4), so it is satisfied by default, but it is the one place the two axes genuinely touch.

### 12.4 What the review demands, and the timeline

Timeline is unchanged from §7: **"you should receive a decision within a week"**, after Business Verification (Step
1.5, **no published SLA** — still the unbounded item). Rejection-and-resubmit loops remain unmeasured.

For `leads_retrieval` (<https://developers.facebook.com/docs/permissions/reference/leads_retrieval>): "Provide
specific examples of why your app needs to access leads for the pages that grant you access."

For `pages_manage_ads` (<https://developers.facebook.com/docs/permissions/reference/pages_manage_ads>): specific
examples of why the app creates and manages ads "on behalf of other businesses' pages", plus three screencasts —
the complete Facebook Login showing the permission grant, ad creation in the app, and successful ad creation on the
Page.

**Here the reviewer's script and advertdreams' reality do line up**, unlike §7. The allowed usage for
`leads_retrieval` names our exact pattern: *"For advertiser authorized CRM platforms to pull the lead data on behalf
of the advertisers."* That is a describable, sanctioned use case with a real Client-grant story to tell. The
screencast requirement showing "the complete Facebook login flow demonstrating permission grant" is the awkward
part, since Clients grant Page and Leads access through Business Manager rather than a Facebook Login in our app —
**[unconfirmed]** how a reviewer expects that demonstrated for an asset-sharing integration. Budget for at least one
rejection cycle on that point.

### 12.5 The build-plan bite: Development mode cannot read leads

> "Apps in Development mode cannot retrieve leads (except for app role users testing within the same app). Live mode
> apps retain full lead access."
>
> — <https://developers.facebook.com/docs/marketing-api/guides/lead-ads/>

This is the practical constraint, and it is worse than the review itself. §5's answer — build everything on Limited
Access against a real owned ad account — **holds for publishing but not for lead retrieval**.

The carve-out is the way through: **"app role users testing within the same app"**. A test Page administered by an
account holding a role on our app *can* have its leads read in Development mode. So the full flow — form creation,
`leadgen` webhook, lead fetch, delivery — is buildable and testable pre-review against our own test Page. What is
**not** possible before Advanced Access is reading leads from a **real Client's** Page. That is exactly the boundary
App Review exists to police.

**Consequence: going Live is mandatory for Lead Ads, and it is not free.** §10's inherited open question about Live
mode is now settled from the lead-ads side — Live is required regardless of what it does for creative creation. And:

> "Data Use Checkup is not required for developers whose apps have Standard Access to permissions and features."
>
> "developers do not need to complete DUC while the app is in Development mode, but will need to complete DUC before
> the app can be switched to Live mode"
>
> — <https://developers.facebook.com/docs/development/maintaining-data-access/data-use-checkup/>

DUC is required for apps "published live with a use case, or [with] advanced access to permissions or features".
Lead Ads puts advertdreams in **both** categories. The Standard-Access exemption §7 quietly relied on is forfeited
the moment Lead Ads ship. **Budget an annual Data Use Checkup as a permanent operating cost**, and expect the
[Data Protection Assessment](https://developers.facebook.com/docs/development/maintaining-data-access/data-protection-assessment/)
question to become live rather than hypothetical, since we would then be handling another business's customer PII.

### 12.6 Policy 10.4 and the keep-alive: does it cover `leads_retrieval`?

**No — and this is the part most likely to be got wrong.** The keep-alive from §8 protects the wrong axis.

Policy 10.4 reads *"Standard and Advanced **Ads API access** may be downgraded to Development access after 30 days
of non-use"* (<https://developers.facebook.com/devpolicy/>). Under the rename (§2) that is unambiguously **Axis B**,
the Marketing API Access Tier. `leads_retrieval` is an Axis A permission. **10.4 does not name it, and no page
applies 10.4 to permission Access Levels.**

One indirect exposure: `Ads Management Standard Access` is a listed dependency of `leads_retrieval` (§12.3), so a
tier downgrade could plausibly disturb it. **[unconfirmed]** — no page describes that interaction. The §8 keep-alive
already prevents the tier downgrade, so this stays theoretical.

**What actually threatens Advanced Access is a different mechanism entirely:** the annual Data Use Checkup, which
Advanced Access makes mandatory (§12.5), and which is a *deadline* rather than a usage floor. Missing it risks
platform access. **[unconfirmed]** — no page states a permission is revoked for inactivity the way 10.4 does for the
tier; <https://developers.facebook.com/docs/development/maintaining-data-access/data-use-checkup/> was checked
specifically for one.

**Two maintenance obligations, two mechanisms, one of them a calendar item:**

| Axis | What decays | Trigger | Mitigation |
|---|---|---|---|
| B — Marketing API Access Tier | Full → dev tier | 30 days non-use (§10.4); maintenance bar is 500 calls / 15 days | Cron'd keep-alive read, ~35 calls/day (§8) |
| A — `leads_retrieval` Advanced Access | Platform access | **Annual DUC deadline**, notification-driven | Calendar reminder + monitored app-admin contact address |

A keep-alive cannot answer a questionnaire. **The app admin contact email must be one a solo builder actually
reads** — a missed DUC notification is a silent, product-ending failure, and it is the same failure mode #5 called a
single point of failure.

### 12.7 What this changes about provisioning

1. **App Review is back on, on a schedule, for one permission.** It gates *lead delivery from real Clients*, not
   publishing. Publishing (§1–§7) still needs nothing.
2. **It is not a blocker to starting.** The submission requires ≥1 successful call per requested permission within
   30 days of submitting, so it *cannot* be filed until the lead flow works against a test Page. Build first,
   submit second — the order is forced, not chosen.
3. **Business Verification moves back onto the critical path**, having been taken off it in §1. It is the
   unbounded item, so start it early even though nothing else waits on it.
4. **#5's fallback is now load-bearing.** #5 built the landing page first precisely because it has no approval gate.
   That sequencing is correct and should not be relitigated: it means a refused or delayed `leads_retrieval` review
   costs attribution quality, not the product.

### 12.8 Additional sources for this addendum

- <https://developers.facebook.com/docs/marketing-api/guides/lead-ads/> — "your app must undergo App Review", Business Verification, Development-mode lead restriction
- <https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving> — token type and permissions for lead-level vs ad-level data, Leads Access Manager default
- <https://developers.facebook.com/docs/permissions/reference/leads_retrieval> — description, allowed usage ("advertiser authorized CRM platforms"), dependency list, review ask
- <https://developers.facebook.com/docs/permissions/reference/pages_manage_ads> — description, dependencies, three screencasts
- <https://developers.facebook.com/docs/permissions/> — checked for dependency/access-level matching rule; silent
