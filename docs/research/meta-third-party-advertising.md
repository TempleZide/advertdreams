# Meta policy: advertising on behalf of Client businesses

Research for [#3](https://github.com/TempleZide/advertdreams/issues/3). Verified 2026-08-23.

## Question

advertdreams runs Meta ads for Client businesses from its own agency ad account and pays the ad
spend itself. Meta requires ads to run from a Facebook Page. Whose Page can that be, what must a
Client grant us, what happens when a Client has no Page, and what must be disclosed?

## Method and confidence

Everything below is checked against live Meta documentation on 2026-08-23, not recalled.

Two limits shaped what could be confirmed, and they matter when reading this document:

- **`facebook.com/business/help/*` is bot-blocked.** Every Business Help Center URL returns a
  generic "Sorry, something went wrong" error page to any automated fetch (verified directly by
  `curl` with a browser user-agent, and via the Wayback Machine, which stores only the JS shell).
  Anything whose only source is the Business Help Center is marked **UNCONFIRMED** and needs a
  human with a logged-in browser. That human check is naturally part of [#15](https://github.com/TempleZide/advertdreams/issues/15).
- `developers.facebook.com`, `transparency.meta.com` and `facebook.com/legal/*` all fetch fine.
  These are the primary sources most of the load-bearing findings rest on.

Each finding is tagged **CONFIRMED** (quoted from a page fetched during this research),
**PARTIAL** (fetched, but the page did not fully answer), or **UNCONFIRMED** (could not reach a
primary source; stated with what is known and what is missing).

## Short answer

1. **The Page should be the Client's own Page, and it stays the Client's.** Meta's agency model is
   built for exactly this: the Client's business grants our business partner access to the Page,
   the Page appears to us as a *client asset*, not an owned one, and our ad account runs ads
   promoting it. Ownership never transfers.
2. **The minimum grant is the `ADVERTISE` task on the Page** — documented as "Create ads, Create
   unpublished Page Posts, If an Instagram account is connected to the Page, create ads". For lead
   ads we also need `MANAGE_LEADS`.
3. **The single shared agency ad account is not permitted.** Meta Developer Policy 10.5: *"Don't
   combine multiple end advertisers or their Meta business assets in the same ad account."* This is
   the most consequential finding here and it directly constrains [#14](https://github.com/TempleZide/advertdreams/issues/14).
   The structure must be one ad account per Client, all owned by advertdreams' business portfolio.
4. **Business Verification is required for us**, because our app will be granted permissions by
   many external Client businesses. Marketing API **Full Access** is also required to manage other
   people's ad accounts.
5. **No advertiser-identity disclosure is required for ordinary commercial ads** outside the EU and
   outside political/social-issue advertising. The Page name *is* the disclosure — the ad visibly
   runs as the Client's Page. Paying for a Client's ads from our own payment method is not itself
   a disclosure trigger.

---

## Findings

### 1. A Facebook Page is required, and it is named in the ad creative — CONFIRMED

Ad creatives carry `object_story_spec.page_id`:

> `page_id` (numeric string): "ID of a Facebook page. An unpublished page post will be created on
> this page. User must have Admin or Editor role for this page."

Source: <https://developers.facebook.com/docs/marketing-api/reference/ad-creative-object-story-spec/>

Note the tension: this reference page says "Admin or Editor role" (the older Page-roles vocabulary)
while the Pages API documents a task-based model where `ADVERTISE` is the ads task (finding 2).
Meta has not unified the terminology across its own reference material. The task model is the
current one; treat "Admin or Editor" as legacy phrasing for the same capability.

**Instagram**: `instagram_actor_id` is gone. Marketing API v22.0+ uses `instagram_user_id`
("The Instagram user account that the ad will be posted to"), with `instagram_story_id` →
`source_instagram_media_id` and `effective_instagram_story_id` → `effective_instagram_media_id`.
v21.0 was deprecated **9 September 2025**, accelerated from a previously announced January 2026
date. Any code or spec referencing `instagram_actor_id` is stale.
Source: <https://developers.facebook.com/blog/post/2025/08/11/instagram-marketing-api-update/>

### 2. What the Client must grant: the ADVERTISE task on their Page — CONFIRMED

The current Page task values and what each permits:

| Task | Permits |
|---|---|
| `ADVERTISE` | "Create ads, Create unpublished Page Posts, If an Instagram account is connected to the Page, create ads" |
| `MANAGE_LEADS` | "View and manage leads" |
| `CREATE_CONTENT` | "Publish content as the Page on the Page" |
| `MODERATE` | "Respond to comments on Page posts as the Page, Delete comments" |
| `ANALYZE` | "View Insights of the Page, View which Page admin published a post or comment" |
| `MESSAGING` | "Send messages as the Page" |
| `MANAGE` | "Assign and manage Page tasks" |
| `VIEW_MONETIZATION_INSIGHTS` | "View monetization insights" |

Source: <https://developers.facebook.com/docs/pages-api/overview>

`ADVERTISE` is the minimum for what advertdreams does, and it is worth noting that it covers the
Instagram half too when an Instagram account is connected to the Page — one grant, both surfaces.
`MANAGE_LEADS` is additionally needed for lead ads (finding 6). `CREATE_CONTENT` is **not** needed:
ads use *unpublished* Page posts, which `ADVERTISE` already covers. Asking a Client only for
`ADVERTISE` (+ `MANAGE_LEADS`) is a materially easier sell than asking for admin, and it should be
the default ask.

### 3. Client Pages are a first-class concept: `client_pages` vs `owned_pages` — CONFIRMED (read path)

The Business node distinguishes assets a business *owns* from assets it has been *granted*:

> The `client_pages` edge provides access to "client-owned pages" that a business has access to.
> `GET /{business-id}/client_pages`. "This endpoint doesn't have any parameters."
> Each returned Page node carries `permitted_tasks` — "Tasks that are assignable to this page".

Source: <https://developers.facebook.com/docs/marketing-api/reference/business/client_pages/>

Two things follow:

- Meta explicitly models the arrangement advertdreams needs. A Page owned by the Client's business
  and accessed by ours is the *supported, named* configuration — not a workaround. Ownership does
  not need to transfer for our ad account to advertise the Client's Page.
- **Creating the grant is not an API operation.** The edge is read-only ("You can't perform this
  operation on this endpoint"). The grant is a UI-and-approval flow between two businesses, so
  onboarding cannot fully automate it — there will be a step where a human at the Client clicks
  approve. Design onboarding around that, and expect it to be the step Clients get stuck on.

I could not confirm from a primary source that the ad account and the Page must (or must not) be in
the same business portfolio. What *is* confirmed is the mechanism that makes the cross-business
case work at all: the Page grants `ADVERTISE` to our business, and our system user holds
`ads_management` on the ad account. See open question A.

### 4. **One end advertiser per ad account.** The single shared agency account is out — CONFIRMED

This is the finding that most changes the plan.

**Meta Developer Policy 10.5:**

> "Don't combine multiple end advertisers or their Meta business assets in the same ad account,
> unless you meet the requirements described [here]"

Source: <https://developers.facebook.com/devpolicy/>

The linked exception page states the rule's purpose and the only escape hatch:

> The separation requirement enables tracking of ownership and accountability for ad content, spend
> and data per advertiser, while limiting disruption when enforcement action is needed against one
> advertiser.

The exception requires adopting a `vendor_id` **or** `brand` signal, carried in Product Catalog
data or in Meta Pixel / Conversions API event data — and "Meta reserves the right to revoke this
alternative exception at its discretion."

Source: <https://developers.facebook.com/docs/development/terms-and-policies/separate-ad-accounts>

That exception is built for e-commerce platforms and marketplaces that run catalog ads for many
merchants. advertdreams runs lead-gen ads with no product catalog, so it does not apply, and
building toward a discretionary, revocable exception is not a foundation worth having.

**Consequence:** "advertdreams' own agency ad account" as a *single* account holding every Client
is not permissible. The correct reading of that map constraint is **agency-owned, one ad account
per Client** — all ad accounts owned by advertdreams' business portfolio, funded by advertdreams'
payment method, but one per end advertiser.

The upside is that Meta's own stated rationale for the rule is exactly the containment goal of
[#14](https://github.com/TempleZide/advertdreams/issues/14): separation exists so enforcement
against one advertiser does not disrupt the others. The policy and the risk posture agree. #14 now
has a much narrower question — not "which structure", but the operational cost of per-Client
accounts and what the recovery path looks like when one is restricted.

Two related policy clauses land on the business model:

- **10.7 — data separation:** "Only use data from an end-advertiser's campaign to optimize or
  measure the performance of that end-advertiser's Meta campaign", and "Keep Meta's data that you
  maintain on behalf of one advertiser separately from that of other advertisers." This forecloses
  pooling Client campaign data into a cross-Client optimisation model, which is an obvious future
  temptation for a vertical-specialised product. Worth recording before it gets designed in.
- **10.6 — fee transparency, effective 3 February 2027:** "If requested by an end advertiser, you
  must disclose to such end advertiser (i) the amount that you spent on Meta advertising on behalf
  of such end advertiser, separate from your fees, and the associated fee structure you charge."
  advertdreams' pricing model bundles ad spend into a subscription. This clause does not prohibit
  that, but it means a Client can demand a spend-vs-fee breakdown, and we must be able to produce
  one. That is a reporting requirement with a date on it, and it arrives before we would otherwise
  have thought about it.
- **10.8:** developers must ensure their clients agree to Meta's Terms of Service and applicable
  advertising policies — so the Client agreement needs a clause binding the Client to Meta's terms.

### 5. Business Verification and Marketing API access level — CONFIRMED

> "As of February 1, 2023, if your app requires advanced level access to permissions, you might
> need to complete Business Verification."
> Apps that "allow other Businesses to access their own data must be connected to a Business that
> has completed Business Verification."
> Without it: "app users from other Businesses will be unable to grant these apps permissions and
> all features will be inactive."
> Exception: "If your app will only be used by app users who have a role on the app itself you do
> not need to complete verification."

Source: <https://developers.facebook.com/docs/development/release/business-verification/>

The exception does not describe advertdreams — Clients are external businesses granting our app
access to their Pages. **Business Verification is required**, and it gates onboarding entirely: an
unverified business cannot receive asset grants at all. It should be the first item in
[#15](https://github.com/TempleZide/advertdreams/issues/15), since verification takes real
calendar time (document submission and review) and nothing else can be tested until it clears.

On API access level:

> "If your app is managing other people's ad accounts, you need advanced [Full] access to the
> `ads_read` and/or `ads_management` permissions."

Source: <https://developers.facebook.com/docs/marketing-api/overview/authorization>

Meta has renamed the tiers: **Limited Access** (formerly "Standard") and **Full Access** (formerly
"Advanced"). The qualification threshold for Full Access "has been decreased from 1,500 to 500
Marketing API calls in the past 15 days". Rate limits: Limited Access max score 60; Full Access max
score 9,000 (reads 1 point, writes 3). The `ads_management` business-use-case quota is
`(100000 if Full Access, else 300) + 40 * Num of Active ads` **per ad account per hour** — quota is
per ad account, not pooled across the agency, which per-Client accounts (finding 4) makes an
advantage rather than a constraint. Full Access also raises the system-user cap from 1 to 10.

Sources: <https://developers.facebook.com/docs/marketing-api/overview/rate-limiting/>,
<https://developers.facebook.com/docs/marketing-api/overview/authorization>

Note Policy **10.4**: ads API access "may be downgraded to Development access after 30 days of
non-use" — a real hazard for a solo builder with gaps between build sessions. Once Full Access is
granted, it needs periodic traffic to keep it.

### 6. Lead ads: lead access is granted separately from Page access — CONFIRMED

Retrieving leads needs:

> "A Page or User access token requested by a person who can advertise on the ad account"

with `leads_retrieval`, `pages_manage_ads` and `pages_show_list` for lead-level data (plus
`ads_management`, `pages_read_engagement`, `pages_show_list` for ad-level fields).

Critically, there is a **second, separate gate** — the Leads Access Manager:

> "If the Page admin did not customize leads and has not granted access permission with the Leads
> Access Manager, then all Page admins will have leads access permission."

Source: <https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving/>

So a Client can grant `ADVERTISE` on the Page, we can successfully run lead ads, and we can still
be unable to read the leads — which would break the entire product, since delivering leads *is* the
product. Onboarding must verify lead retrieval end-to-end with a live test lead before a Client is
considered onboarded. Do not treat "ads are running" as evidence that leads will arrive.

Relevant help-center pages, all **UNCONFIRMED** (bot-blocked), for the human check in #15:
`facebook.com/business/help/1440176552713521` (About Leads Access),
`/618808448980683` (Enable Leads Access), `/540596413257598` (Assign or remove permissions in
Leads Access Manager).

The docs also reference "the number of leads created in the past 90 days" in a rate-limit
calculation. This is a rate-limit window, **not** a documented retention period — but it is a hint
worth not relying on. Pull leads into our own store promptly rather than treating Meta as the
system of record.

### 7. Disclosure: no advertiser-identity disclaimer for ordinary commercial ads — CONFIRMED, with one EU exception

Meta's Advertising Standards top-level sections are: Community Standards; Unacceptable Content;
Fraud, Scams and Deceptive Practices; Restricted Goods and Services; Objectionable Content;
Intellectual Property Infringement; Social Issue, Electoral or Political Advertising; Product and
Format-Specific Policies; Advertising Policies Affecting Business Assets; Data Use Restrictions.

Source: <https://transparency.meta.com/policies/ad-standards/>

What applies to advertdreams:

- **No "paid for by" disclaimer for commercial ads.** The disclaimer-and-authorisation regime sits
  under *Social Issue, Electoral or Political Advertising*. Civil-construction lead-gen ads are not
  in that category. The ad runs as the Client's Page and that Page name is the advertiser identity
  the viewer sees — which is accurate, since the Client *is* the advertiser. The fact that
  advertdreams operates the account and funds the spend needs no on-ad disclosure.
  (Partially confirmed: the standards index confirms the category exists and carries special
  transparency requirements; the sub-page itself 404'd on fetch, so the precise claim that the
  disclaimer is *limited* to those categories is inferred from the document structure rather than
  quoted. High confidence, not quoted. See open question C.)
- **EU is different — CONFIRMED.** Advertisers must provide "the full legal name of the person,
  company, business, charity or institution on whose behalf your ad is being presented", and the
  payor information *if different*. advertdreams pays for ads presented on behalf of the Client, so
  beneficiary and payor genuinely differ and both must be declared. Only relevant if we ever run
  ads targeting the EU; for a domestic civil-construction book it should not arise, but it is a
  hard blocker on any EU expansion and worth knowing now.
- **Landing page consistency — CONFIRMED:** "The products and services promoted in an ad must match
  those promoted on the landing page." Our generated landing pages must clearly be the Client's
  business and match the ad's claims. This constrains the lead-capture landing page design:
  a generic advertdreams-branded form would be a policy risk.
- **Identity verification on suspicion — CONFIRMED:** "if we detect signals of possible
  misrepresentation, suspicious activity, or inauthentic behavior in your ad content, you may be
  required to complete a verification process." Many similar ads for many small businesses from one
  operator is a plausible trigger. Keep documentary proof of Client authorisation retrievable.

### 8. Who Meta holds responsible — CONFIRMED

**Self-Serve Ad Terms, Section 14, "If you are placing ads on someone else's behalf":**

> "You must have permission to place those ads, and agree as follows"
> "You represent and warrant that you have the authority to and will bind the advertiser to these
> Self-Serve Ad Terms, the Terms of Service, and the Commercial Terms"
> "If the advertiser you represent violates these Self-Serve Ad Terms... we may hold you
> responsible for that violation"
> "We may provide campaign reporting information to the end advertiser for whom you placed a
> campaign"

Source: <https://www.facebook.com/legal/self_service_ads_terms>

**Commercial Terms:**

> "You agree that you will ensure that any third party on whose behalf you access or use any Meta
> Product for any business or commercial purpose will abide by the applicable terms"

plus an indemnity: "you agree to indemnify and hold us harmless from and against any damages,
losses, and expenses of any kind".

Source: <https://www.facebook.com/legal/commercial_terms>

Read together with Policy 10.8, this means:

- Running ads for Clients is **explicitly permitted** — Meta wrote a clause for it.
- advertdreams carries the policy liability for what Clients' ads say, and warrants it has the
  Client's authority. The Client agreement must therefore contain an explicit grant of authority to
  place ads, a binding of the Client to Meta's terms, and content warranties from the Client
  (licence and truthfulness of supplied photos and claims). This is a contract requirement falling
  out of platform policy, and it feeds [#11](https://github.com/TempleZide/advertdreams/issues/11) —
  intake must capture the authorisation, not just the creative inputs.
- Because we pay, we are the payer of record; the terms do not prohibit an agent funding a client's
  ads. No finding contradicted the "ad spend as cost of goods" model.

### 9. When a Client has no Page — PARTIAL, see open question B

Confirmed: a Page is mandatory (finding 1) — every ad creative names a `page_id`. There is no
Page-less ad path in current creative specs.

Confirmed and useful: **Instagram presence does not require the Client to have an Instagram
account.** A Page Backed Instagram Account (PBIA) can be created via the API and used to run
Instagram ads — it "will look like running ads from a Facebook Page, although it's actually from a
'shadow' Instagram account for that Facebook Page". Limits: no one can log in to it, it cannot post
or comment, each Page may have at most one, and creating one requires at least the ADVERTISER role
on the Page. Source: <https://developers.facebook.com/docs/graph-api/reference/page/page_backed_instagram_accounts/>
(*Confidence note: this URL 404'd on direct fetch during this research; the content above came from
a search index of that same developer-docs page. Treat as likely-correct and verify in #15.*)

That is genuinely valuable for the target market: a civil-construction Client with no social
presence at all needs **one** thing created — a Facebook Page — and Instagram placement then comes
free via PBIA. It reduces "what we must promise a Client with no social presence" to a single
asset.

What I could **not** confirm is the ownership question, which is the hard part. See open question B.
What can be said with confidence:

- Page creation is a person-level action in the Facebook UI. I found no evidence of a Page-creation
  API endpoint in current docs (the Pages API overview covers managing existing Pages only), so in
  practice a Page gets created by a human logged in to a personal Facebook profile.
- Whoever's business portfolio claims that Page controls it. If advertdreams creates and owns the
  Page, the Client is a tenant on their own brand — and the exit problem is real: when the
  relationship ends, the Page, its followers, its reviews, its ad history and its accumulated
  social proof sit in our portfolio.
- **Recommendation regardless of what the transfer mechanics turn out to be:** have the *Client*
  create the Page, from a Client-owned personal profile, and then grant us `ADVERTISE`. Walk them
  through it during sales-assisted onboarding (which the map already assumes — self-serve signup is
  out of scope for v1). This keeps the arrangement inside the well-documented `client_pages` model
  from finding 3, avoids the transfer question entirely, and avoids the misrepresentation risk of
  advertdreams operating a Page that presents as a business we are not. It costs one guided step at
  onboarding and removes an entire category of exit dispute. A `wizard`-style onboarding script is
  a good fit for this.

---

## Implications for advertdreams

**Settled by this research:**

1. Client's own Page, granted to us with the `ADVERTISE` task (+ `MANAGE_LEADS` for lead ads).
   Ownership stays with the Client. This is Meta's documented `client_pages` model.
2. **One ad account per Client**, all owned by advertdreams' business portfolio and funded by our
   payment method. The pooled single-account reading of the map constraint is not permissible under
   Developer Policy 10.5.
3. Business Verification is a hard prerequisite and blocks all onboarding until complete.
   Marketing API Full Access is required to manage Clients' ad accounts.
4. No on-ad disclosure obligation for our commercial ads outside the EU. The Client's Page name is
   the advertiser identity, and it is accurate.
5. The Client agreement must grant authority to place ads, bind the Client to Meta's terms
   (Policy 10.8), and carry Client content warranties — we hold the liability either way.

**Newly surfaced work:**

- [#14](https://github.com/TempleZide/advertdreams/issues/14) is narrowed, not answered: the
  structure is decided by policy (per-Client accounts), so what remains is the operational cost of
  provisioning them and the restriction-recovery playbook.
- [#15](https://github.com/TempleZide/advertdreams/issues/15) should start with Business
  Verification, and should carry the human-browser checks listed under the open questions below.
- [#11](https://github.com/TempleZide/advertdreams/issues/11) intake must collect: the Client's
  Page (or a guided step to create one), the asset grant, Leads Access Manager permission, and a
  written authorisation to advertise on their behalf.
- **New, not on the map:** Policy 10.6 (effective 3 Feb 2027) lets a Client demand ad spend broken
  out from our fees. Our bundled subscription pricing must be able to produce that breakdown. This
  belongs with the pricing-model ticket.
- **New, not on the map:** Policy 10.7 forbids using one Client's campaign data to optimise
  another's. Record this before any cross-Client optimisation feature is designed.
- Policy 10.4: Full Access can be downgraded after 30 days of API non-use — a real risk given a
  solo builder's cadence.

## Open questions

**A. Must the ad account and the Page be in the same business portfolio?**
Not confirmed either way from any primary source. What *is* confirmed is that Meta models
client-owned Pages accessed by another business as a first-class case (`client_pages`), which is
strong evidence that cross-business is supported — it is hard to read that edge as describing
anything else. The page most likely to state the boundary rule explicitly,
`facebook.com/business/help/563249781254715` ("About Account Sharing Limitation"), is bot-blocked.
*Resolve by:* a logged-in human opening that page, or empirically during #15.

**B. If a Client has no Page, can we create and own one, and what breaks at exit?**
Unresolved. Two sub-questions, neither reachable from fetchable sources:
(i) whether Meta's Page/Community policies permit a business Page representing Client X to be owned
and operated by advertdreams — the relevant misrepresentation rules live in help-center and policy
pages I could not fetch;
(ii) the current Page-transfer mechanism between business portfolios and what it costs — cooldowns,
whether both parties must be verified, and what is lost (followers, reviews, ad history, learning
phase, linked Instagram/WhatsApp).
*Mitigation:* the recommendation in finding 9 — have the Client create and own the Page from the
start — sidesteps both sub-questions entirely. Adopting it means B never needs answering. It should
only be reopened if a Client genuinely cannot or will not create a Page, and then (ii) must be
answered *before* we take ownership of anything, not after.

**C. Is the "paid for by" disclaimer strictly limited to social/electoral/political ads?**
High confidence yes, from the structure of the Advertising Standards index, but the sub-page 404'd
and the claim is not quoted from source. Low practical risk — the failure mode of assuming it
applies more broadly would be over-disclosure, not a violation.

**D. All Business Help Center UI copy is unverified.** The partner-access and asset-sharing flows
(`facebook.com/business/help/708679622611131`, `/1717412048538897`), leads access
(`/1440176552713521`, `/618808448980683`, `/540596413257598`) and account sharing limitations
(`/563249781254715`) could not be read. The technical model is confirmed from developer docs; the
*click path* we will hand to Clients is not. Write onboarding instructions only after seeing these
in a logged-in browser.

**E. "Business Portfolio" vs "Business Manager" naming.** Meta appears to have renamed Business
Manager to Business Portfolio, and both terms still appear in Meta's own materials. Not confirmed
from a primary announcement. Cosmetic, but it will affect the wording of Client-facing instructions.

## Sources

All fetched 2026-08-23.

- Meta Developer Policies — <https://developers.facebook.com/devpolicy/>
- Separate ad accounts for end advertisers (Policy 10.5 exception) — <https://developers.facebook.com/docs/development/terms-and-policies/separate-ad-accounts>
- Business Verification — <https://developers.facebook.com/docs/development/release/business-verification/>
- Marketing API authorization — <https://developers.facebook.com/docs/marketing-api/overview/authorization>
- Marketing API rate limiting — <https://developers.facebook.com/docs/marketing-api/overview/rate-limiting/>
- Ad creative object_story_spec — <https://developers.facebook.com/docs/marketing-api/reference/ad-creative-object-story-spec/>
- Instagram Marketing API update (field renames) — <https://developers.facebook.com/blog/post/2025/08/11/instagram-marketing-api-update/>
- Business `client_pages` edge — <https://developers.facebook.com/docs/marketing-api/reference/business/client_pages/>
- Pages API overview (task values) — <https://developers.facebook.com/docs/pages-api/overview>
- Page access tokens — <https://developers.facebook.com/docs/pages/access-tokens>
- Lead ads retrieval — <https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving/>
- Page Backed Instagram Accounts — <https://developers.facebook.com/docs/graph-api/reference/page/page_backed_instagram_accounts/> (404 on direct fetch; content via search index)
- Meta Advertising Standards — <https://transparency.meta.com/policies/ad-standards/>
- Self-Serve Ad Terms — <https://www.facebook.com/legal/self_service_ads_terms>
- Meta Commercial Terms — <https://www.facebook.com/legal/commercial_terms>
