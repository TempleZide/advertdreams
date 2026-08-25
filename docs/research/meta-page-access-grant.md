# How a Client grants advertdreams Page access and Leads access

Research for [#22](https://github.com/TempleZide/advertdreams/issues/22), parent map [#2](https://github.com/TempleZide/advertdreams/issues/2).
Researched 2026-08-24 against live Meta developer and business documentation.
Current Graph / Marketing API version at time of writing: **v26.0**, released 2026-07-29 —
[Graph API versions](https://developers.facebook.com/docs/graph-api/changelog/versions/).

Every claim below is cited to a Meta-authored page or explicitly marked unconfirmed. No third-party
source is relied on for any claim; where a well-known error string or behaviour exists *only* in
third-party reports, it is named as such and not treated as established.

---

## A note on sources, before anything else

This ticket asks two kinds of question. The engineering kind — *what endpoint, what permission,
what token* — is answerable from `developers.facebook.com`, which fetches cleanly. The onboarding
kind — *what does the Page admin see, and where* — lives in the Meta Business Help Center at
`facebook.com/business/help/...`, and those articles are client-rendered: a direct fetch returns
only a `<title>`, and a plain `curl` with a browser user-agent returns a 1,542-byte Meta error
shell ("Sorry, something went wrong"), not a 403. `web.archive.org` is unreachable from this
environment.

The earlier research for [#3](https://github.com/TempleZide/advertdreams/issues/3) hit this wall
and left the Leads Access articles permanently marked "UNCONFIRMED (bot-blocked)". **That wall has
now been got round.** The Help Center article bodies quoted in this document were retrieved by
pulling the article text out of the raw HTML and by routing through a rendering proxy; URL
discovery used the Help Center's own search endpoint rather than a search engine, so every
citation below points at a Meta-owned page. The content is Meta's, quoted verbatim.

Two honest caveats on that. First, the retrieval was indirect, so a human with a logged-in browser
should spot-check the load-bearing quotes — particularly the Leads Access ones in §4, which carry
the heaviest consequences in this document. Second, help-articles are not versioned and Meta edits
them without notice, so a quote is evidence about 2026-08-24 and not a contract.

What still cannot be got at, at all, is *the experience*: how many notifications arrive, what they
look like, what a confused owner-operator does with them. Screenshots of the real flow, taken by a
person running a real request against a real Page, remain a prerequisite for writing onboarding
copy. That is named as a task at the end.

---

## Direct answer

**A Client grants advertdreams access by sharing their Page with our business portfolio as a
partner — Meta's UI calls it "Request shared access to a Facebook Page", the API calls it an
`AGENCY` claim — and, contrary to what [#3's research](./meta-third-party-advertising.md)
concluded, we *can* initiate that request programmatically from our own product.**

**But almost none of the rest of it can happen inside our product, and the reason is not the
request — it is the two preconditions and the second grant.**

| Step | Can it happen in our product? |
|---|---|
| Client tells us their Page | Yes |
| **Client's Page must be in a business portfolio** | **No — and this may not be true yet** |
| We send the access request | **Yes** — `POST /{business-id}/client_pages` or `POST /{page-id}/agencies` |
| Client approves it | No — Business Manager, ~3 clicks, no documented notification |
| We detect approval | Yes, by polling. **No webhook exists** |
| **Client grants Leads Access** | **No — separate screen, no API, no webhook, cannot be requested** |
| We verify leads are actually readable | Only by reading a real lead |

**Three findings dominate everything else:**

1. **Meta's API documentation states "A business must own the page" as a requirement of the agency
   claim.** If that is enforced, then a typical mom-and-pop Client — whose Page has never been near
   Business Manager — must first create a business portfolio and claim their own Page into it
   *before* our request can even be received. That is a multi-step Business Manager journey by a
   non-technical person, and it is the real onboarding cost. Meta's Business Suite help article
   describes the request as reaching "someone with full control of the Page **or** person with full
   control of the business portfolio the Page is in", which reads as though an unclaimed Page works
   after all. **The two pages contradict each other and Meta never reconciles them.**

2. **Leads Access is a separate grant with no API, no webhook, and no read-back — and its
   permission check binds to the human being behind the token, not to our app.** Meta states it
   outright: a lead fetch "fails if the people backing the UAT or PAT don't have leads access
   permission." That is a direct threat to the system-user architecture
   [#18](https://github.com/TempleZide/advertdreams/issues/18) settled on. The same help article
   says a partner business must hold "a Page admin role" before it can even be assigned leads
   access — which, if accurate, means `ADVERTISE` is not enough and the map's minimal ask needs
   revisiting.

3. **Leads are deleted after 90 days and there is no signal when access breaks.** Retention is now
   confirmed, not inferred. Combined with the absence of any revocation webhook, a silently broken
   grant becomes permanently unrecoverable data loss on a 90-day fuse.

**There is no hosted flow that does what the ticket hopes for.** Facebook Login for Business is
real, is Meta's general-purpose business onboarding dialog, and is the closest thing — but it
grants *our app* delegated access to assets the Client designates. It does not create a
business-to-business partner grant with Page tasks. Those are different mechanisms and are not
interchangeable, though they can be chained.

**Recommendation: build the API request path, and design onboarding around escorting the Client
through two Business Manager visits rather than around avoiding them.** The map's "guides them
through granting access" language is the right instinct and this research supports it — but
"guides" has to mean real hand-holding through Meta's UI, with an honest waiting state, not a
button in our product that makes it all happen.

---

## 1. The mechanism, and its three variants

Meta offers three flows that a non-expert will confuse, and picking the wrong one wastes a Client's
patience. The article that lays all three out together is
[About adding Pages to your business portfolio](https://www.facebook.com/business/help/938185683209159).

### 1a. Adding a Page = claiming ownership. Not our flow.

> "When you add a Page to your business portfolio, you are claiming the Page as your own. To add a
> Page, you must be the owner of the Page."

Source: [About adding Pages to your business portfolio](https://www.facebook.com/business/help/938185683209159)

The steps live in
[Add a Facebook Page to your business portfolio](https://www.facebook.com/business/help/720478807965744),
and its prerequisites rule it out for us explicitly: the Page must not be "owned by another
person/business". The API mirrors this — `POST /{business-id}/owned_pages` returns error **3977,
"To claim a Page in Business Manager, you must already be an Admin of the Page"**
([owned_pages reference](https://developers.facebook.com/docs/graph-api/reference/business/owned_pages/)).

This is ownership transfer, which the map forbids. Named here only so nobody reaches for it.

There is one detail in this flow worth carrying anyway, because it is documented **only** in the
developer docs and appears nowhere in the Help Center: a **7-day seasoning rule.** If the caller
has been a Page Admin or `MANAGER` "for more than 7 days" the ownership claim is approved
immediately; at 7 days or less it needs manual approval
([Business Asset Management: Pages](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/pages)).
Anyone building against the UI alone would never discover this.

### 1b. "Request shared access to a Facebook Page" — this is our flow

Source: [Request access to a Page in Meta Business Suite](https://www.facebook.com/business/help/183277585892925)

In the UI: Settings → Pages → **+ Add** → **"Request shared access to a Facebook Page"** → enter
the Page name or URL → choose partial access or full control, and if partial, "select the
task-based permissions you need" → Confirm.

The defining sentence, and it is exactly the map's model:

> "When you request access to a Page, you're asking for permission to another person's or
> business's Page. You aren't taking ownership of the Page..."

**One prerequisite falls on us, not the Client, and it is easy to miss:**

> "you must add a primary Page before you can request access to another person's or business's
> Page."

An agency portfolio with no Page of its own cannot send this request at all. advertdreams needs its
own Facebook Page in its own portfolio before the first Client can be onboarded. Small, cheap,
and a hard blocker if discovered late.

Where the request lands:

> "You've now sent your request to someone with full control of the Page **or** person with full
> control of the business portfolio the Page is in."

That disjunction is load-bearing and is discussed in §1d.

Note also a permanent ceiling on partner-granted Pages, which is fine for us but should be known:
even with full control, a partner cannot delete or deactivate the Page, manage Instagram
connections, download Page information, or control branded content settings — "If you have full
control of a Page a partner assigned to you, these sensitive actions are restricted"
([About Page access for partners](https://www.facebook.com/business/help/1811748502628726)).

### 1c. Partner requests operate on portfolios, not Pages — and presuppose infrastructure

There is a second, adjacent family of flows keyed to *business portfolio IDs*
([Add partners to your business portfolio](https://www.facebook.com/business/help/708679622611131)):

- [Give a partner access to your assets](https://www.facebook.com/business/help/1717412048538897) —
  the Client drives it, and needs *our* portfolio ID.
- [Ask a partner to share assets with your business](https://www.facebook.com/business/help/408759743051505) —
  we drive it, and it needs **the Client's portfolio ID, name, and email address**, plus 2FA on our
  portfolio. Nine steps. "Your partner can approve or deny your request, or change which asset
  types and permissions to share."

**The practical difference is the whole ballgame for a self-serve product.** 1b needs nothing from
the Client but a Page URL and their approval. 1c needs the Client to already have a business
portfolio, to know its ID, and to hand over an email. For a Client who has never opened Business
Suite, **1b is the only viable path and 1c is fantasy.** Onboarding should never ask a small
business owner for a portfolio ID.

### 1d. The unclaimed Page: a direct contradiction between Meta's own pages

This is the sharpest unresolved item in this document and it sits directly on the map's
self-serve assumption.

**The developer docs say the target Page must be owned by a business.** The Business Asset
Management guide lists, verbatim among the requirements for the `client_pages` agency claim:

> "A business must own the page."

Source: [Business Asset Management: Pages](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/pages)

The Business-to-Business guide frames the whole feature the same way: "A Meta Business Manager may
request access to an ad account or Page owned by another Business Manager"
([Business-to-Business Functions](https://developers.facebook.com/docs/marketing-api/businessmanager/business-to-business)).

**The Business Suite help docs imply it works anyway.** Article 183277585892925 says the request
reaches "someone with full control of the Page **or** person with full control of the business
portfolio the Page is in" — the first branch describes precisely a Page with a full-control person
and no portfolio behind it.

**No Meta document reconciles these.** The most likely reading is that the API surface is stricter
than the UI surface, but Meta never says so, and building on a guess here is building on the
single assumption that decides whether onboarding is one step or six.

If the strict reading is right, the Client's real journey is: create a business portfolio → claim
their own Page into it (subject to the 7-day seasoning rule above, if they only just became admin)
→ *then* approve our request. **That is a materially worse self-serve story than the map assumes,
and it is worth knowing before onboarding screens are designed rather than after.** It is also
cheap to settle: one real unclaimed Page, one claim request. See "What to verify next".

---

## 2. Yes, it can be initiated programmatically — and this overturns a prior finding

The research for [#3](https://github.com/TempleZide/advertdreams/issues/3) concluded:

> "**Creating the grant is not an API operation.** The edge is read-only ('You can't perform this
> operation on this endpoint'). The grant is a UI-and-approval flow between two businesses, so
> onboarding cannot fully automate it."

**That is wrong on the mechanism, and it is wrong because it trusted an auto-generated reference
page over two hand-written guides.** Both exist, both are current, and they contradict each other.
This is the second time on this map that two Meta pages have disagreed — the first being the
Special Ad Category / Housing conflict now owned by
[#20](https://github.com/TempleZide/advertdreams/issues/20) — and it will not be the last.

### The contradiction, stated precisely

The [Business `client_pages` reference](https://developers.facebook.com/docs/graph-api/reference/business/client_pages/)
says, for Creating: "You can't perform this operation on this endpoint." Same for Updating and
Deleting. Only Reading is supported, and no permissions are listed at all.

The [Business Asset Management Pages guide](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/pages)
gives a working POST to that same edge, under a heading literally called "Claim Pages as Agency":

```
curl \
  -F "page_id=<PAGE_ID>" \
  -F "permitted_tasks=['ADVERTISE', 'ANALYZE']" \
  -F "access_token=<ACCESS_TOKEN>" \
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/client_pages"
```

with its semantics:

> "If the requester has admin permission on the page, this request will be automatically approved."
> … "If not, then the Page Admin will need to approve the request."
>
> "If you make an `AGENCY` claim, but do not have proper Page permissions, the response is
> `PENDING`. The Admin for that Page can log in and grant the access, deny it, or report the claim
> as a spam."
>
> "The access token must have the `pages_manage_metadata` and `pages_show_list` permissions"

**Believe the guide.** Four pieces of corroboration, all primary:

1. The [Business-to-Business Functions](https://developers.facebook.com/docs/marketing-api/businessmanager/business-to-business)
   guide independently documents the same three request calls —
   `POST /{BUSINESS_ID}/client_pages`, `POST /{BUSINESS_ID}/client_ad_accounts`,
   `POST /{PAGE_ID}/agencies` — and states verbatim: **"These calls send out a notification to the
   admins of the ad account or Page, which asks them to accept the access request."**
2. A dedicated edge exists to read the results: `GET /{business-id}/pending_client_pages` returns
   `BusinessPageRequest` nodes for pages the business "requested access to but are pending
   approval"
   ([reference](https://developers.facebook.com/docs/graph-api/reference/business/pending_client_pages/)).
   A read-only ecosystem has nothing to put in that collection.
3. `GET /{page-id}/agencies` returns `access_requested_time` and `access_status` — fields that only
   exist because requests are made
   ([reference](https://developers.facebook.com/docs/graph-api/reference/page/agencies/)).
4. The `PENDING` response semantics only make sense for a write.

The `/marketing-api/reference/` pages are machine-generated from the API schema and have been
observed here to under-report supported operations on at least three edges. **Standing rule for
this map: where a Meta guide and a Meta reference disagree about whether an operation exists,
believe the guide and verify with one live call.**

### The two directions, and what each needs

**`POST /{business-id}/client_pages`** — we ask. Params `page_id`, `permitted_tasks`. Token needs
`pages_manage_metadata` and `pages_show_list`. Two further constraints from the guide worth
recording: **"The Agency cannot re-share the Page to another Business"**, and once approved the
agency can "start running ads on the Page (through Ad Accounts they have access) right away."

**`POST /{page-id}/agencies`** — they assign us, or we ask; the same endpoint behaves as
request-or-grant depending on whose token is used. Params `business` ("The business ID of the
agency that you want to assign to this Page") and `permitted_tasks`. Reading it requires "A Page
access token requested by a person who can perform the `MANAGE` task on the Page" plus
`business_management`, or `pages_manage_metadata` and `pages_show_list`. The grant-side condition:

> "If the access token used to make the API call belongs to a user or system user who has access to
> the requested asset via a business, the access to the asset can only be granted if this business
> is the `OWNER` of the asset."

Source: [Business-to-Business Functions](https://developers.facebook.com/docs/marketing-api/businessmanager/business-to-business)

**The POST section of the `agencies` reference carries no permissions block of its own** — the
permissions appear only under Reading. Explicit doc silence on what token the write needs.

Same reference-versus-guide split appears in reverse on deletion: the reference says DELETE is
unsupported, while the Business-to-Business guide documents `DELETE /{PAGE_ID}/agencies` with a
`business` param. Unresolved.

### The task vocabulary is much larger than the overview admits

[#3's research](./meta-third-party-advertising.md) took its task table from the
[Pages API overview](https://developers.facebook.com/docs/pages-api/overview), which lists eight:
`ADVERTISE`, `ANALYZE`, `CREATE_CONTENT`, `MANAGE`, `MANAGE_LEADS`, `MESSAGING`, `MODERATE`,
`VIEW_MONETIZATION_INSIGHTS`.

The real `permitted_tasks` enum, documented identically on
[`/{page-id}/agencies`](https://developers.facebook.com/docs/graph-api/reference/page/agencies/) and
[`/{page-id}/assigned_users`](https://developers.facebook.com/docs/graph-api/reference/page/assigned_users/),
has thirty members. Beyond the eight: `MODERATE_COMMUNITY`, `MANAGE_JOBS`, `PAGES_MESSAGING`,
`PAGES_MESSAGING_SUBSCRIPTIONS`, `READ_PAGE_MAILBOXES`, `CASHIER_ROLE`,
`GLOBAL_STRUCTURE_MANAGEMENT`, and a full parallel `PROFILE_PLUS_*` set for the New Pages
Experience — including **`PROFILE_PLUS_ADVERTISE` and `PROFILE_PLUS_MANAGE_LEADS`.**

**So the New Pages Experience task vocabulary is alive**, and this document's earlier working
assumption that it had been retired was wrong. But Meta publishes the `PROFILE_PLUS_*` names as
**enum members only — no descriptions, and no classic→NPE mapping table anywhere.** Meanwhile the
NPE documentation paths themselves are gone: `/docs/pages/overview-new-pages-experience` returns
404 and `/docs/pages/new-pages-experience` redirects to generic Pages docs. Meta has removed the
*explanation* while keeping the *enum*.

**Practical consequence: do not hard-code a task list.** Read `permitted_tasks` off the Page node
and request from what is actually offered. A Client on the New Pages Experience may need
`PROFILE_PLUS_ADVERTISE` where another needs `ADVERTISE`, and no Meta page tells you which.

### Edges that are not the answer, ruled out so nobody re-checks

- **`/{business-id}/pages`** — DELETE only; Reading, Creating and Updating all "You can't perform
  this operation on this endpoint". A dissociation endpoint, not an access-request one
  ([reference](https://developers.facebook.com/docs/graph-api/reference/business/pages/)).
- **`/{business-id}/pending_client_pages`** and **`/pending_owned_pages`** — GET only.
- **`/{page-id}/assigned_users`** — assigns individual business or system users to a Page the
  business already holds. Cannot create a cross-business request.
- **`/{business-id}/invited_users`** — **does not exist.** 404, and absent from the Business node's
  edge list. The nearest real things are `/{business-id}/pending_users` (GET only) and
  `/{business-id}/business_users` (POST by email, invites a *person* into *our* business, and is
  restricted: "Apps can only target businesses (or child businesses of those businesses) that have
  claimed them").

---

## 3. Hosted flows: what exists, and why none of them is the answer

### Facebook Login for Business — real, and the closest thing

Source: [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/facebook-login-for-business)

A Meta-hosted dialog driven by a *business login configuration* created in the App Dashboard, which
yields a `config_id` passed to `FB.login()` or the OAuth dialog — "`config_id` has replaced `scope`
(which should not be used)". The Client is shown the configuration and grants access to the assets
they designate.

What comes back is either a user access token or a **Business Integration System User access
token**, the latter for apps that "perform programmatic, automated actions on your business
clients' assets without having to rely on input from an app user", and which **"default to never
expire for the common offline server-to-server communication."** A non-expiring, business-scoped
token is genuinely valuable — it removes an entire class of silent onboarding regression where a
Client changes their password and our access dies.

**But it does not do what the ticket is hoping for.** The scoping is explicit:

> "Access is explicitly delegated at the time of authorization. Your app can only access the assets
> that were designated by your business client when they completed the Facebook Login for Business
> flow."

Access is granted **to our app**, over assets that stay in the Client's portfolio. It is not a
business-to-business partner grant, and it does not assign Page tasks to advertdreams' portfolio.
Our agency-owned ad account still needs the Page shared to *our business* for
`object_story_spec.page_id` to work from our own system user token — and FLFB does not produce
that.

The two can be chained: use FLFB to obtain a Client token carrying `business_management` +
`pages_show_list` + `pages_manage_metadata`, then call `POST /{page-id}/agencies` with it to create
the partner grant. That is a real design and it is probably the best in-product experience
available. It is also the most expensive one, because:

> "To serve businesses that you do not own or manage, your app must be approved for **Advanced
> Access** via **Meta's App Review**."

and the product is positioned for **Tech Providers**. That is consistent with the platform rule —
"Permissions with Standard Access can only be requested from app users who have a role on the
requesting app"
([Access Levels](https://developers.facebook.com/docs/graph-api/overview/access-levels)) — and with
every permission involved: `pages_manage_metadata`, `pages_show_list` and `business_management` all
require App Review for third-party data, and "Business Verification is required for all apps making
requests for Advanced Access"
([Permissions reference](https://developers.facebook.com/docs/permissions)).

### The others, checked and ruled out

- **WhatsApp Embedded Signup** — real, and **WhatsApp-only**. Built on an FLFB configuration; does
  not cover Pages or ad accounts. App Review mandatory; Business + Access Verification raise
  onboarding limits from 10 to 200 customers per rolling week
  ([Embedded Signup](https://developers.facebook.com/docs/whatsapp/embedded-signup)).
- **Meta Business Extension** — real, and **Pixel / Catalog / Shops only**: "a popup-based solution
  that allows users to easily set up the Meta Pixel, Catalog, and Shops (optional)". Cannot grant
  Page tasks. Its docs contain an "Offsite Deprecation" section whose content could not be read
  ([MBE](https://developers.facebook.com/docs/meta-business-extension)).
- **"Business Login for Direct Business Partners"** — **not a documented Meta product name.** Four
  candidate doc URLs 404, and the string appears nowhere in the FLFB page. It may be an App
  Dashboard configuration-template label; do not build a plan around it.
- **Partnership Ads Hub / partnership ad codes** — **could not be verified.** Six candidate URLs
  404, and the v26.0 Page node reference has no edge containing "partnership", "branded_content",
  "collaborative" or "invite". Flagged as an open item rather than a negative finding, because the
  session's search budget was exhausted and a URL sweep was impossible. Directionally it would
  govern *using another entity's identity in a creative*, not obtaining Page task access, so it
  would not substitute anyway.
- **Hosted share/invite links for asset sharing** — none documented. The notification-and-approve
  flow triggered by the POST calls is the closest thing, and its UI lives in the Client's own
  Business Manager.

### One structural alternative nobody has costed: the 2-Tier Business Manager

Worth naming because it is a different answer to the same problem and is not on the map.
[2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)
lets a parent portfolio "create and delete hundreds or thousands of small Business Managers (Child
Business Managers) underneath a Parent Business Manager", aimed explicitly at agencies, resellers
and website builders. Because we would *create* the Client's business, there would be nothing to
request.

Two catches. The docs state "The Parent Business Manager pays for the Child Business Managers' ad
activity and bills their clients separately" — which is already our model, so that is a fit, not a
problem. And the docs state **no** allowlist, partnership or Meta-approval requirement, which at
that scale is a silence to be sceptical of rather than a green light. It also does not solve the
Page problem by itself: the Client's existing Page still has to get into the child portfolio. Not a
recommendation — a thing to be aware of before anyone assumes the current structure is the only one.

---

## 4. Leads Access: the finding that should change a decision

The map already lists "Proving Leads access at onboarding" as unspecified. This research makes it
sharper and more alarming than it looked.

### It is unambiguously a second, separate grant

The authoritative page is
[About leads access in Meta Business Suite](https://www.facebook.com/business/help/1440176552713521):

> "Leads access in Meta Business Suite gives people with full control of the business portfolio the
> flexibility to customize which people, CRM systems or partners can download leads."

> "If someone with full control of the portfolio doesn't customize who can access leads, the
> default rule applies and all Page admins or people with messaging permissions can download leads.
> **Once someone with full control of the portfolio starts customization, new people, CRM systems
> or partners need to be added manually.**"

The grant lives on its own screen:
[Assign or remove permissions in leads access](https://www.facebook.com/business/help/540596413257598)
gives the path as **Meta Business Suite → Business portfolio → Settings → Integrations → Leads
access**, then "Assign people", "Assign partners" or "Assign CRMs". Not the Pages screen, not the
Partners screen.

### And it sits *on top of* a Page role, which may break the map's minimal ask

From the same article:

> "**Only the business that owns the Page can assign leads access permissions to partner businesses
> or agencies.** Assigning leads access permission to a partner gives that partner the ability to
> assign leads access to its employees. A shared Page won't appear in the partner's leads access
> until the partner has been assigned: A Page admin role. Permission in leads access."

> "If you don't see the name or ID of the person or partner you're looking for, make sure that they
> have a role assigned to your Page. **People can't have access to your leads data if they don't
> have a Page role assigned.**"

Two consequences, both awkward:

1. **It can never be a single click alongside the task grant.** The partner must already hold the
   Page role before they appear in the Leads Access picker. Two sequential Client visits,
   mandatory, in that order.
2. **The stated bar is "a Page admin role", not `ADVERTISE`.** The map's minimal ask —
   `ADVERTISE` + `MANAGE_LEADS`, chosen precisely because it is an easier sell than admin — may not
   clear it. Whether "Page admin role" in help-article prose means the `MANAGE` task, or is loose
   phrasing for "any Page role", **is not stated anywhere.** If it means `MANAGE`, the whole
   easy-ask argument in [#3's research](./meta-third-party-advertising.md) weakens.

### The permission check binds to the human, not to our app

This is the single most architecturally consequential sentence found in this research:

> "If you use your own CRM, after it receives the real-time update regarding a new lead, the CRM
> uses a user access token (UAT) or Page access token (PAT) to fetch the lead data from Meta.
> **This fails if the people backing the UAT or PAT don't have leads access permission.** Make sure
> the people backing the UAT or PAT appear in the people section of leads access to avoid issues."

Source: [About leads access](https://www.facebook.com/business/help/1440176552713521)

[#18](https://github.com/TempleZide/advertdreams/issues/18)'s conclusion rests on advertdreams
holding system-user tokens and no Client ever holding one. That works for ad accounts we own. For
leads it collides with a check applied to *the identity behind the token* — and a system user's
"identity" for leads-access purposes is not something Meta documents at all. Whether a system user
can be added in the Leads Access people list, or whether it inherits from the partner grant, or
whether it simply cannot hold leads access: **unanswered by any Meta page found.**

This deserves to be settled before the token architecture is locked, because the failure mode is
the worst one the product has: ads running, money spending, leads accruing, nothing delivered, no
error anywhere.

### There is no API and no read-back

Searched for and not found: any endpoint to grant, revoke, or *query* Leads Access. Not on the Page
node (whose only leadgen fields are `leadgen_forms`, `leadgen_tos_accepted`,
`leadgen_tos_acceptance_time`, `leadgen_tos_accepting_user`, `leadgen_fat`), not in Business Asset
Management, not in the Retrieving Leads guide. The closest API surface is `MANAGE_LEADS` in
`permitted_tasks`, and **Meta never documents whether setting `MANAGE_LEADS` via API is the same
thing as the Business Suite leads-access grant.** The default-rule sentence quoted above does not
mention `MANAGE_LEADS` at all.

**Treat them as distinct until proven otherwise**, and note the consequence: we cannot
programmatically check that a Client's leads will be readable. The only proof is reading a real
lead with the exact token identity production will use — a probe under a different identity proves
nothing, given the rule above.

This is why the map's open item should be upgraded from "may need a live test Lead" to "requires
one". Without it, "onboarded" and "advertising into a void" are indistinguishable from inside our
system.

### Naming drift, and what reading a lead requires

The developer docs still call it the "Leads Access Manager"; the Business Suite calls it "leads
access" under Settings → Integrations. Same feature, two names, and the developer doc is the stale
one. Its entire treatment of the subject is one paragraph:

> "If the Page admin did not customize leads and has not granted access permission with the Leads
> Access Manager, then all Page admins will have leads access permission. If leads access permission
> is customized by the business admins, then it depends on the business admin's configuration for
> whether a Page basic admin has leads access permission or not."

Reading leads needs "A Page or User access token requested by a person who can advertise on the ad
account **and on the Page**", plus `ads_management`, `leads_retrieval` ("**Warning:** The
`leads_retrieval` permission is required to read leads"), `pages_show_list`, `pages_read_engagement`
and `pages_manage_ads` — plus `pages_manage_metadata` for webhooks
([Retrieving Leads](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving/)).
`leads_retrieval` additionally depends on Ads Management Standard Access, and its App Review asks
you to "Provide specific examples of why your app needs to access leads for the pages that grant
you access"
([leads_retrieval](https://developers.facebook.com/docs/permissions/reference/leads_retrieval)).
That is exactly our story and should be told that way.

### Retention is real: 90 days, and it is a deletion, not a rate limit

[#3's research](./meta-third-party-advertising.md) correctly refused to treat the 90-day figure in
the rate-limit formula as a retention period. There is now a direct source, and the answer is that
90 days is *also* a real retention limit:

> "Leads data will be available for download for up to **90 days** from the time the Instant Forms
> is submitted by a user."

> "Even if you are viewing the Lifetime results of your campaign, you will only be able to download
> leads from the last 90 days. We don't make leads available for download after this period due to
> security and storage considerations."

Source: [About expired leads](https://www.facebook.com/business/help/1526849577619206)

Messages are exempt: "Messages your business receives from people will remain in your Page's Inbox
and will not be removed after 90 days."

**Combined with the absence of any revocation signal (§5), this is an unrecoverable-data-loss
window.** A grant that silently breaks is invisible until a read fails, and if nobody reads for 90
days the leads are gone by design. Pull leads into our own store on arrival; never treat Meta as
the system of record; and reconcile often enough that the gap can never approach 90 days.

---

## 5. Detecting a grant: polling only, and no notification we can promise

### There is no webhook. This is a hard no, not an unknown.

The [webhook reference index](https://developers.facebook.com/docs/graph-api/webhooks/reference/)
lists exactly nine topics: Ad Account, Application, Catalog, Instagram, Managed Meta Account, Page,
Permissions, User, WhatsApp Business Account. There is no business object, no business-asset
object, and no partner or asset-sharing topic. Each plausible candidate was checked:

- **`page`** — has `leadgen`, `feed`, the messaging fields, `page_change_proposal`,
  `page_upcoming_change` and profile fields. Nothing for roles, assigned users, agencies or
  permission changes. (`page_change_proposal` and `page_upcoming_change` concern Page *info* change
  proposals — do not mistake them for an access signal.)
- **`permissions`** — "a user's granting or revoking a permission **to your app**", with fields
  `bookmarked`, `connected`, `public_search`, `social_ads`. App-install scope, not business assets.
- **`ad_account`** and **`application`** — nothing access-related in either.

**No webhook fires when a Page is shared, a task is granted, a partner is added, or leads access is
assigned or revoked.** Polling is the only documented option, and revocation in particular is
invisible until something fails.

The `leadgen` webhook itself needs a long-lived Page access token and the app installed on the Page
via `POST /{page-id}/subscribed_apps`. Its payload carries only `leadgen_id`, `page_id`, `form_id`,
`ad_id`, `adgroup_id`, `created_time` — so a token that passes the leads-access check is still
needed to fetch the body. Meta's Pages webhook guide states its task requirement only in the
context of the `feed` field and **never mentions `leadgen`**; the exact task needed to subscribe to
`leadgen` is doc-silent.

### The polling surface

| Probe | What it tells us | Caveat |
|---|---|---|
| `GET /{business-id}/pending_client_pages` | Requests still awaiting approval | Pending is expressed by membership; no status field documented on the node |
| `GET /{business-id}/client_pages` | Positive confirmation, with `permitted_tasks` | The check to build on — asserts the end state. Reference documents **no required permissions**, a doc gap |
| `GET /{page-id}/agencies` | `access_status`, `access_requested_time`, `access_updated_time`, `permitted_tasks` — the nearest thing to a real state machine | Needs a Page token from someone with `MANAGE`. **We will hold `ADVERTISE`, so this is readable by the Client, not by us** |
| `GET /{business-id}/clients` | The Business-to-Business guide says to check `access_status` here for pending | **The [clients reference](https://developers.facebook.com/docs/marketing-api/reference/business/clients/) does not document an `access_status` field at all** — only `adaccount_permissions`, `application_permissions`, `page_permissions`, `productcatalog_permissions`, `shared_ca_count`. Third guide-vs-reference contradiction |
| `GET /me/accounts?fields=tasks` | Which Pages a token's user holds, with tasks | Needs a user token, so only useful on an FLFB-style path |
| `GET /{page-id}/assigned_users` | Per-user tasks | Needs a `MANAGE` Page token. Not available to us. Ruled out early to save someone a day |
| **Leads access** | **Nothing** | No probe exists. A real lead read is the only detector |

### What the Client sees, and where — the part we cannot promise

The developer docs offer one sentence, and it names no channel: "These calls send out a
notification to the admins of the ad account or Page, which asks them to accept the access request"
([Business-to-Business Functions](https://developers.facebook.com/docs/marketing-api/businessmanager/business-to-business)).

The Help Center is more specific about *location* and, unhelpfully, gives two of them.
[Request access to a verified Page](https://www.facebook.com/business/help/208127917574982) is the
only article naming a destination: "The Page owner will get your request in the Requests tab in
Settings." The general version of the same flow (183277585892925) says nothing at all.

[Approve access to a Page in a business portfolio](https://www.facebook.com/business/help/619744345300739)
documents **two routes with different lengths**:

- **From Business Suite, 3 clicks**: Settings → under **Requests**, select **"Other requests"** →
  Approve or Decline.
- **From Page settings, 7 clicks**: Page → Settings → Page setup → next to "Page access" click Next
  → "Review request" → verify details, Next → "Accept" (password re-entry may be required).

And the Requests sub-tab is itself contradicted:
[Approve a request to add a person to your business portfolio](https://www.facebook.com/business/help/507616032280621)
directs the user to **"Frequently used requests"** rather than "Other requests". These are
different request types, but no Meta page says which lands in which bucket — so an admin told to
"check the Requests tab" has two places to look and no guidance.

**Most importantly: no Meta document states that an email is sent, a Facebook notification is
fired, or a Business Support Home alert is raised for an inbound Page access request.** Every
documented path is *pull*: the admin has to go and look.
[About Meta Business Support Home](https://www.facebook.com/business/help/254088759757736) covers
only "Outstanding" and "Resolved" account-issue tabs and does not mention a Requests feature at
all. A related note in
[Differences between Page access and business portfolio access](https://www.facebook.com/business/help/449213029060839)
observes that once a Page is in a portfolio you "manage all access from the business portfolio and
not from your Facebook Page" — implying the notification surface moves, without saying where to.

**This is a product risk, not a documentation nitpick. We cannot tell a Client "you'll get an
email" on any documented basis.** Onboarding must give exact click paths, and should probably send
our own email at the moment we fire the request, because Meta's may not exist.

---

## 6. When the person signing up is not a Page admin

The ticket calls this out as common — the small business whose nephew made the Page — and Meta
treats three sub-cases differently.

**The API request path is unusually forgiving, and this is a real argument for it.** The request is
made by *our* business against a Page ID; the response is `PENDING` when we lack Page permissions,
and "The Admin for that Page can log in and grant the access". Nothing requires the person in our
signup form to be that admin. **A Client can finish signup, give us a Page URL, and have the nephew
approve later from his own account** — which fits the map's "self-serve with async activation"
constraint better than any flow needing admin rights at signup time.

**An FLFB-based flow is unforgiving.** `POST /{page-id}/agencies` needs a token from someone who can
perform `MANAGE`. If the person in front of us is not an admin, the dialog will not offer the Page
and no product design fixes it.

**Finding out who the admin is: mostly not possible.**
[About Page transparency](https://www.facebook.com/help/323314944866264) surfaces Confirmed Page
Owners, Confirmed Page Partners and a primary country — it does **not** name individual admins of
an ordinary Page, and Meta documents no lookup that does.

**Meta documents a hole exactly where this Client lives.**
[How do I give someone access to my Facebook Page?](https://www.facebook.com/business/help/152071822895768)
carries a scope disclaimer: "This article is for Pages that are part of a business portfolio… If
your Page is not part of a business portfolio, your Facebook Page access levels are different." It
never says how they differ, and links to nothing that does. A Help Center search for the phrase
returns zero results. **The family-made Page that was never a business asset is precisely the case
Meta declines to document.**

**The dispute path exists, and it is heavy.**
[Submit a Page admin dispute](https://www.facebook.com/business/help/1580486349413648) — Business
Support Home → start a chat → select **Page Admin Dispute**. It requires three documents in
non-editable format: government ID of the requester; an attestation letter on letterhead carrying
the Page ID and URL, the requester's profile URL, user ID and email, the names of current admins,
and a signed certification line; and an ownership document (incorporation papers, domain agreement,
utility bill, business licence, tax certification, bank statement or trademark docs). A separate
process, [full control of a business portfolio](https://www.facebook.com/business/help/474856681929983),
uses a different chat option and keys to the portfolio ID.

Three silences in those articles matter: **no review SLA, no appeal route, and no statement of what
happens to the Page during review.** And the enumerated eligibility categories are former
employees or contractors, deceased admins with a death certificate, accidental self-removal,
Location Pages, and third-party disputes with a court order — **"my nephew set it up and won't
answer" fits none of them**, and Meta does not say whether such a request is accepted at all.

**Design implications, stated plainly.** Ask for the Page URL, never for the Client's Facebook
credentials. Do not ask "are you an admin of your Page?" — a non-technical owner answers that
confidently and wrongly about half the time. Make "someone else administers this Page" a
first-class onboarding path with a shareable prompt for whoever holds the keys, not an error state.
And do not build a product promise around the dispute process: it is a months-shaped human process
with no SLA, and a Client stuck there is a Client who cannot be activated.

---

## 7. Failure modes

**Denial and spam-reporting.** "The Admin for that Page can log in and grant the access, deny it,
or report the claim as a spam"
([Pages guide](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/pages)).
Spam reporting is the one to fear, because an unexpected access request landing on a distracted
owner is exactly what gets reported, and it accrues against *our* business across all Clients.
Mitigation is product design, not code: the request must arrive when the Client is expecting it,
under a name matching the one they just paid, with our own message arriving first.

**Pending-request cap.** "You are limited to 200 pending Page requests **if your business is
connected to a CRM**"
([Request access to a verified Page](https://www.facebook.com/business/help/208127917574982)). No
cap is stated for businesses not connected to a CRM — Meta neither gives a number nor says it is
unlimited. At our scale 200 is not a near-term constraint, but a backlog of never-approved requests
from churned or stalled signups could accumulate toward it, so pending requests want cleaning up.

**Expiry: not documented for our flow.** The only expiry anywhere is in
[Approve a request to add a person to your business portfolio](https://www.facebook.com/business/help/507616032280621):
"The invitation request must be approved within 30 days or it will expire." **That is a
people-invitation to a portfolio — not a Page access request and not a partner asset request.** No
expiry is documented for either of the requests our onboarding would actually send. Do not assume
30 days generalises. Treat pending as potentially indefinite, reconcile from
`pending_client_pages` rather than from our own timers, and do not build a state machine that
assumes a request self-clears. Cancellation is documented for partner requests (visible and
cancellable in the Partners tab) but **no cancel path is documented for Page access requests.**

**Revocation.** Either side can end it, and there is no signal. The Client's path is documented
([Remove someone's access to a Page](https://www.facebook.com/business/help/273201236806115) —
"Only people with full control of the business portfolio can remove people from Pages", and note
"When you remove someone from a Page, it does not remove them from your business portfolio"; and
[Remove partners](https://www.facebook.com/business/help/2222659621282858), which conspicuously
**does not state what happens to the partner's existing access to shared assets after removal**).
The downstream symptoms are documented in
[Troubleshoot why you can't switch into a Facebook Page](https://www.facebook.com/business/help/1496590570745105):
"You've been removed from the business portfolio", "The Page has been removed from the business
portfolio", "You don't have partial access (business tools and Facebook) to the Page".

Since we fund the Ad Spend, discovering a revocation late means spending on a campaign we can no
longer manage. **A periodic reconciliation of `client_pages` against our active Client list is not
a nicety, it is a money control** — and it doubles as the Policy 10.4 keep-alive read that
[#18](https://github.com/TempleZide/advertdreams/issues/18) already requires.

**Permission-model precedence — a real trap.** From
[Differences between Page access and business portfolio access](https://www.facebook.com/business/help/449213029060839):

> "if from your Page you give someone access to only manage content, but later give them full
> control of the Page from your business portfolio, this person will have full control of the
> Page."

Portfolio-level grants override Page-level grants. Meta's remedy is procedural: once a Page is in a
portfolio, manage all access from the portfolio. If our onboarding ever instructs a Client to set
something at the Page level, a later portfolio change can silently overwrite it.

**Pages can be deactivated by over-aggressive revocation.** "At least one person must have full
control over a Facebook Page in a business portfolio for the Facebook Page to remain active"
([About Page access](https://www.facebook.com/business/help/1101781386943864)). Worth knowing
before we ever advise a Client on tidying up their permissions.

**Two permission vocabularies, no mapping.** The developer docs still define the classic five Page
roles as task arrays — admin (`MANAGE, CREATE_CONTENT, MODERATE, ADVERTISE, ANALYZE`), editor,
moderator, advertiser (`ADVERTISE, ANALYZE`), analyst
([asset management overview](https://developers.facebook.com/docs/marketing-api/business-manager/asset-management/overview)).
The Help Center defines a completely different three-tier model: "business tools only", "business
tools and Facebook", and "full control", grouped by Content, Community activity, Messages and
calls, Ads, Insights, Leads
([About Page access](https://www.facebook.com/business/help/1101781386943864)). **Meta publishes no
mapping table between them.** If our product ever shows a Client what they are granting, we will be
guessing at the translation — and this is also why "a Page admin role" in §4 cannot be pinned to a
task.

**Leads access revoked or never granted.** The silent one, and the worst. Ads run, spend goes out,
leads accrue at Meta and reach nobody, with no error in our system. No API, no webhook, no probe.
Meta documents the removal mechanics but **never documents the runtime symptom** — no page states
what error a previously-working lead fetch returns after access is pulled. The only stated
behaviour is causal: "This fails if the people backing the UAT or PAT don't have leads access
permission." On a 90-day deletion clock.

**Two error strings that are folklore, not documentation.** `(#200) Requires business_management
permission` and "You do not have permission to access lead" are widely reported in third-party and
community posts and **appear in no primary Meta page** checked here — not in Retrieving Leads, not
in Testing & Troubleshooting, not in the lead edge references. Error code 200 is documented
generically as "Permissions error". Do not write error-handling copy that matches on those strings
without verifying them against a live failure.

**Development mode cannot read leads.** Apps in Development mode cannot retrieve leads except for
app-role members, and the Lead Ads Testing Tool needs "a page role of **Advertiser** or above",
permits one test lead per form, and "you cannot use the tool in developer mode"
([Testing & Troubleshooting](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/testing-troubleshooting)).
This matches [#18's addendum](./meta-access-tier-resolution.md) and constrains how the mandatory
end-to-end lead test can be built.

---

## 8. Corrections to the record

1. **[#3's research](./meta-third-party-advertising.md) finding 3 is overturned on mechanism.** Its
   claim that "Creating the grant is not an API operation" rests on the auto-generated
   `client_pages` reference, contradicted by two Meta guides and by the existence of
   `pending_client_pages` and the `access_status` field. The *request* can be automated. Its
   practical advice — "expect it to be the step Clients get stuck on" — stands, and is if anything
   understated.

2. **[#3's research](./meta-third-party-advertising.md) task table is incomplete.** Eight tasks is
   what the Pages API overview shows; the real `permitted_tasks` enum has thirty, including a full
   `PROFILE_PLUS_*` set for the New Pages Experience. Do not hard-code the eight.

3. **[#3's research](./meta-third-party-advertising.md) was right to refuse the 90-day figure as
   retention, and is now superseded by a direct source.** 90 days is both the rate-limit window and
   a real deletion policy.

4. **[#18](https://github.com/TempleZide/advertdreams/issues/18)'s "no App Review" conclusion is
   narrowed, and its system-user premise is challenged.** The conclusion holds for ad accounts we
   own. It does not extend to a Client-facing login flow, where Advanced Access via App Review is
   stated outright. And the leads-access check binding to "the people backing the UAT or PAT" is a
   direct question mark over the system-user architecture that carried #18's argument.

5. **The Leads Access help pages, marked permanently unconfirmable by
   [#3's research](./meta-third-party-advertising.md), are now quoted.** They should still be
   spot-checked by a human, per the note at the top.

---

## 9. What this changes on the map

- **"Self-serve" needs re-reading in light of §1d.** If a Client's Page must already sit in a
  business portfolio, the honest onboarding flow has the Client creating a portfolio and claiming
  their own Page before we can do anything. That is not a step we can hide, and pretending
  otherwise will produce an onboarding funnel that dies silently. **Settle this before designing
  onboarding screens.**
- **"Proving Leads access at onboarding" should graduate from "not yet specified" to a required
  onboarding gate.** No API, no webhook, no probe, a check that binds to a human identity, and a
  90-day deletion clock. A live test Lead is the only proof that a Client is genuinely activated.
- **The token architecture needs a decision it has not had.** Whether a system user can hold leads
  access is unanswered and load-bearing. It should be tested before more is built on the
  system-user assumption.
- **The minimal ask may not be minimal.** If "a Page admin role" is required for a partner to
  appear in the Leads Access picker, `ADVERTISE` + `MANAGE_LEADS` is not sufficient and the
  easy-sell argument weakens. Unresolved, and worth resolving before onboarding copy promises
  anything about how little we are asking for.
- **advertdreams needs its own Facebook Page in its own portfolio before the first Client.** Small,
  cheap, and a hard blocker if found late.
- **[#11](https://github.com/TempleZide/advertdreams/issues/11) (intake) inherits concrete
  requirements**: collect the Page URL rather than credentials; treat "someone else administers
  this Page" as a first-class path; send our own notification when we fire the request, because
  Meta's may not exist; and hold an honest "waiting on Meta" state with exact click instructions.
- **A commercial note, provisional until relayed per the map's Team constraint:** the in-product
  hosted experience (Facebook Login for Business) costs App Review and Tech Provider positioning.
  Since [#18's addendum](./meta-access-tier-resolution.md) already establishes that
  `leads_retrieval` requires App Review regardless, we are making one submission either way — the
  question is only how many permissions go in it. That reframing should be part of the relay.

---

## 10. Could not confirm

Ordered by how much a decision depends on them.

1. **Whether an agency access request works against a Page owned by no business portfolio.**
   Developer docs say "A business must own the page"; the Business Suite help article implies
   otherwise. Decides whether self-serve onboarding works for a typical small business.
2. **Whether a system user can hold Leads Access**, given the check binds to "the people backing
   the UAT or PAT". Load-bearing for the token architecture.
3. **Whether "a Page admin role" for leads-access assignment means the `MANAGE` task or any Page
   role.** Decides whether the map's minimal ask survives.
4. **Whether `MANAGE_LEADS` via API is the same grant as Business Suite leads access.** Meta never
   relates the two.
5. **Whether `POST /{business-id}/client_pages` actually works**, given its reference page denies
   it. Same question for `DELETE /{page-id}/agencies`.
6. **What the `PROFILE_PLUS_*` tasks mean and how they map to classic tasks.** Enum members only,
   no prose, no mapping, NPE doc paths 404.
7. **The notification channel for an inbound access request.** No Meta page states that any email,
   notification or alert is sent. Every documented path is pull-only. Blocks onboarding copy.
8. **Which Requests sub-tab a Page access request lands in** — "Other requests" vs "Frequently used
   requests", contradicted between two articles.
9. **Expiry and cancellation of a Page access request.** Undocumented; the 30-day figure applies
   only to portfolio people-invitations.
10. **The pending-request cap for a business not connected to a CRM.** 200 is stated only for
    CRM-connected businesses.
11. **Access levels for a Page not in a business portfolio.** Meta names them as different, never
    explains, and Help Center search returns zero results.
12. **What happens to a partner's existing asset access after partner removal** — silent in the
    removal article itself.
13. **Dispute review SLA, appeal route, and Page status during review** — silent in both dispute
    articles. Also whether a dispute outside the enumerated categories is accepted at all.
14. **The runtime error returned when leads access is missing or revoked.** The two commonly cited
    strings appear in no primary Meta page.
15. **Whether "Partnership Ads Hub" or partnership ad codes exist**, and what they cover. Six URLs
    404; a proper sweep was impossible because the session's search budget was exhausted.
16. **The exact Page task required to subscribe to the `leadgen` webhook.** The Pages webhook guide
    discusses only `feed`.
17. **Whether the 2-Tier Business Manager Solution really has no approval gate.** The docs are
    silent at a scale where silence is suspicious.

### What to verify next, cheapest first

1. **One live agency claim against a genuinely unclaimed test Page**, watched from the target
   account. Settles #1, #5, #7, #8 and #9 in a single experiment, and it is by far the highest-value
   thing on this list. This wants to be a `wayfinder:task`.
2. **A human with a logged-in Business Suite walks the Leads Access screens and screenshots them**,
   attempting to assign a partner business and a system user. Settles #2, #3 and #4 — the three
   that threaten the architecture.
3. **One live `GET /{business-id}/clients`** to see whether `access_status` is really returned.
4. **One live lead read** with the exact token identity production will use, then a deliberate
   revocation and a second read. Settles #14 and proves the onboarding gate works.

---

## Sources

**Meta developer documentation** (fetched directly, 2026-08-24):

- [Business-to-Business Functions](https://developers.facebook.com/docs/marketing-api/businessmanager/business-to-business) — the request/grant/remove calls, the notification sentence, `access_status`
- [Business Asset Management: Pages](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/pages) — "Claim Pages as Agency", the POST sample, `PENDING`, grant/deny/spam, "A business must own the page", the 7-day rule
- [Business Asset Management overview](https://developers.facebook.com/docs/marketing-api/business-asset-management)
- [Asset management overview](https://developers.facebook.com/docs/marketing-api/business-manager/asset-management/overview) — the classic five Page roles as task arrays
- [Business `client_pages` reference](https://developers.facebook.com/docs/graph-api/reference/business/client_pages/) — the contradicting "can't perform this operation"
- [Business `pending_client_pages` reference](https://developers.facebook.com/docs/graph-api/reference/business/pending_client_pages/)
- [Business `owned_pages` reference](https://developers.facebook.com/docs/graph-api/reference/business/owned_pages/) — error 3977
- [Business `pages` reference](https://developers.facebook.com/docs/graph-api/reference/business/pages/) — DELETE only
- [Business `clients` reference](https://developers.facebook.com/docs/marketing-api/reference/business/clients/) — documented fields, no `access_status`
- [Page `agencies` reference](https://developers.facebook.com/docs/graph-api/reference/page/agencies/) — POST params, the 30-member `permitted_tasks` enum, `access_status`
- [Page `assigned_users` reference](https://developers.facebook.com/docs/graph-api/reference/page/assigned_users/) — `MANAGE` token requirement, same enum
- [Pages API overview](https://developers.facebook.com/docs/pages-api/overview) — the incomplete eight-task table
- [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/facebook-login-for-business) — `config_id`, token types, Advanced Access, Tech Provider positioning
- [Graph API access levels](https://developers.facebook.com/docs/graph-api/overview/access-levels)
- [Permissions reference](https://developers.facebook.com/docs/permissions) and [`leads_retrieval`](https://developers.facebook.com/docs/permissions/reference/leads_retrieval)
- [Business Manager API: get started](https://developers.facebook.com/docs/marketing-api/business-manager-api/get-started)
- [2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)
- [Lead Ads: Retrieving Leads](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving/)
- [Lead Ads: Testing & Troubleshooting](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/testing-troubleshooting)
- [Webhooks reference index](https://developers.facebook.com/docs/graph-api/webhooks/reference/) and [Page webhooks](https://developers.facebook.com/docs/graph-api/webhooks/reference/page)
- [WhatsApp Embedded Signup](https://developers.facebook.com/docs/whatsapp/embedded-signup)
- [Meta Business Extension](https://developers.facebook.com/docs/meta-business-extension)
- [Graph API versions](https://developers.facebook.com/docs/graph-api/changelog/versions/)

**Meta Business Help Center** (Meta-authored; retrieved indirectly, see the note at the top — spot-check before relying on a quote in a contract or in customer-facing copy):

- [About adding Pages to your business portfolio](https://www.facebook.com/business/help/938185683209159)
- [Add a Facebook Page to your business portfolio](https://www.facebook.com/business/help/720478807965744)
- [Request access to a Page in Meta Business Suite](https://www.facebook.com/business/help/183277585892925)
- [Request access to a verified Page](https://www.facebook.com/business/help/208127917574982)
- [Approve access to a Page in a business portfolio](https://www.facebook.com/business/help/619744345300739)
- [Approve a request to add a person to your business portfolio](https://www.facebook.com/business/help/507616032280621)
- [About Page access](https://www.facebook.com/business/help/1101781386943864)
- [About Page access for partners](https://www.facebook.com/business/help/1811748502628726)
- [Differences between Page access and business portfolio access](https://www.facebook.com/business/help/449213029060839)
- [Add partners to your business portfolio](https://www.facebook.com/business/help/708679622611131)
- [Give a partner access to your assets](https://www.facebook.com/business/help/1717412048538897)
- [Ask a partner to share assets with your business](https://www.facebook.com/business/help/408759743051505)
- [Remove partners from your business portfolio](https://www.facebook.com/business/help/2222659621282858)
- [Remove someone's access to a Page in a business portfolio](https://www.facebook.com/business/help/273201236806115)
- [About leads access in Meta Business Suite](https://www.facebook.com/business/help/1440176552713521)
- [Assign or remove permissions in leads access](https://www.facebook.com/business/help/540596413257598)
- [About expired leads](https://www.facebook.com/business/help/1526849577619206)
- [Submit a Page admin dispute](https://www.facebook.com/business/help/1580486349413648)
- [Submit a request to get full control of a business portfolio](https://www.facebook.com/business/help/474856681929983)
- [How do I give someone access to my Facebook Page?](https://www.facebook.com/business/help/152071822895768)
- [Troubleshoot why you can't switch into a Facebook Page](https://www.facebook.com/business/help/1496590570745105)
- [About Meta Business Support Home](https://www.facebook.com/business/help/254088759757736)
- [About Page transparency](https://www.facebook.com/help/323314944866264)

No third-party source is cited or relied on for any claim in this document.
