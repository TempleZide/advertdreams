# AI static ad creative: achievable quality, cost, latency, and Meta's AI content policy

Research findings for [#7](https://github.com/TempleZide/advertdreams/issues/7). Resolved 2026-08-23.
All prices verified against provider documentation on 2026-08-23. **Model pricing and availability
change fast — re-verify before committing to a number in a pricing model.**

## The direct answer

**Do not generate the image. Composite.**

For a civil-construction contractor the photograph *is* the product claim. A generated image of a
driveway is a picture of a driveway that does not exist, attached to a claim that the advertiser
built it. That is a misrepresentation whether or not Meta catches it, it destroys the one asset the
Client actually has that a national competitor does not, and it puts the agency ad account — which
serves every Client — in front of Meta's deceptive-content review for no gain.

The AI's job in this pipeline is **layout, copy, variant generation, and photo triage** over the
Client's authentic photos. Image *generation* earns a narrow, defensible role: repairing and
extending photos the Client already took (outpainting a 4:3 phone photo to 4:5, removing a wheelie
bin or a licence plate). It does not earn the role of inventing the subject.

This is also the cheap answer, the fast answer, and the low-risk answer, which is unusual and worth
noticing.

## Text model: Claude, and it is not the expensive part

Claude cannot generate or edit images — Anthropic's own vision documentation is explicit: *"No,
Claude is an image understanding model only. It can interpret and analyze images, but it cannot
generate, produce, edit, manipulate, or create images."*
([vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)). So Claude's role here
is the copy and the photo triage, and an image model or a compositor does the pixels.

### Current pricing (verified 2026-08-23)

| Model | ID | Input $/MTok | Output $/MTok | Context | Vision tier |
|---|---|---|---|---|---|
| Claude Opus 5 | `claude-opus-5` | $5 | $25 | 1M | high-resolution |
| Claude Sonnet 5 | `claude-sonnet-5` | $2 | $10 | 1M | high-resolution |
| Claude Haiku 4.5 | `claude-haiku-4-5` | $1 | $5 | 200K | standard |

Source: [Pricing](https://platform.claude.com/docs/en/about-claude/pricing),
[Models overview](https://platform.claude.com/docs/en/about-claude/models/overview).

Two things changed recently and are worth recording, because a stale memory gets both wrong:

- **Sonnet 5's $2/$10 is now the standard price, not introductory.** Anthropic's pricing page states
  the launch-announced introductory rate through 2026-08-31 *"is now the standard price. The
  previously scheduled increase to $3/$15 per million input/output tokens on September 1, 2026 will
  not occur."* Budget against $2/$10 permanently.
- **Batch API is 50% off both directions** (Sonnet 5: $1 / $5 per MTok). Creative generation is not
  latency-sensitive if the Client reviews before publish — see the latency section.

Prompt caching multipliers: 5-minute cache write 1.25x base input, 1-hour write 2x, **cache read
0.1x**. The vertical's prompt template and service vocabulary are the same on every generation, so
they belong behind a cache breakpoint.

### Vision token cost (this is how photo triage is priced)

Claude bills images as visual tokens at `⌈width / 28⌉ × ⌈height / 28⌉`. Claude 4.7 and later are
"high-resolution tier": 2576 px max long edge, 4784 max visual tokens; earlier models cap at 1568 px
/ 1568 tokens. Oversized images are downscaled automatically, which caps the cost.

| Image | Visual tokens |
|---|---|
| 1000 x 750 (downsampled job photo) | 972 |
| 1080 x 1080 (square ad) | 1,521 |
| 1440 x 1800 (Meta's recommended feed size) | 3,380 |

**Downsample before sending.** A 1000x750 triage copy costs 972 tokens; the full 1440x1800 costs
3.5x that for a judgement ("is this photo sharp, well-lit, and does it show finished work?") that
does not need the resolution.

### Cost per generated creative

Modelled pipeline: triage 8 candidate photos at 1000x750, plus ~2,300 tokens of intake answers and
vertical prompt template, producing ~1,500 output tokens (five copy variants: headline, primary
text, description).

| Model | Sync | Batch (50% off) |
|---|---|---|
| Opus 5 | $0.088 | $0.044 |
| Sonnet 5 | $0.035 | $0.018 |
| Haiku 4.5 | $0.018 | $0.009 |

**Sonnet 5 at ~3.5 cents per creative-set is the recommendation.** Ad copy for a driveway contractor
is not a frontier-intelligence problem; it is a constrained-format writing problem with a 27-character
headline limit. Opus 5 is available at 9 cents if evaluation shows copy quality actually moves the
click-through rate, but that is a decision to make on evidence, not upfront.

Against a Client's monthly ad spend this is noise. **The text model is not a cost driver and should
not be optimised as one.** Note the corollary: this also means there is no cost argument against
generating twenty copy variants and letting Meta's delivery optimisation sort them out.

## Image models: what the field looks like, and what it costs

Surveyed honestly, because the recommendation is "mostly don't" and that only carries weight if the
alternative has actually been priced.

### Pricing (verified 2026-08-23)

| Model | ID | Cost per image | Takes an input image? |
|---|---|---|---|
| Gemini 3.1 Flash Image ("Nano Banana 2") | `gemini-3.1-flash-image` | $0.067 @ 1K (batch $0.034) | Yes — editing via input images |
| Gemini 3.1 Flash Lite Image | `gemini-3.1-flash-lite-image` | $0.0336 @ 1K (batch $0.0168) | Yes |
| Gemini 3 Pro Image ("Nano Banana Pro") | `gemini-3-pro-image` | $0.134 @ 1K/2K, $0.24 @ 4K | Yes |
| Gemini 2.5 Flash Image ("Nano Banana") | `gemini-2.5-flash-image` | $0.039 (batch $0.0195) | Yes |
| OpenAI GPT Image | `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini` | token-priced, see below | Yes — edits endpoint with mask |

Source: [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing),
[OpenAI pricing](https://developers.openai.com/api/docs/pricing),
[OpenAI image generation guide](https://developers.openai.com/api/docs/guides/image-generation).

**Google prices generated images as output tokens**: 1120 tokens for a 1K image, 1680 for 2K, 2520
for 4K, billed at the model's output rate. **OpenAI does the same**: a high-quality 1024x1024 costs
4,160 image output tokens and a 1024x1536 costs 6,240, against an image-output rate the pricing page
gives only as a range of **$8-40 per 1M tokens** depending on model. That puts a high-quality
portrait OpenAI image somewhere between roughly **$0.05 and $0.25** — I could not pin the exact
per-model rate, because OpenAI's page defers to an interactive calculator that does not render to
automated fetching. **Flagged as unconfirmed.**

**Imagen 4 is gone.** Google's pricing page lists `imagen-4.0-generate-001` and its variants as
deprecated with a shutdown date of **2026-08-17** — six days before this research. Any prior note
recommending Imagen is stale. This is a good illustration of why the ticket's instruction to verify
rather than recall was the right instruction.

Black Forest Labs' FLUX line is live and current (FLUX 3, FLUX.2, FLUX.2 Max, FLUX.2 Klein, plus the
FLUX Tools editing models), and is the usual choice when you want in-place photo editing at low cost.
BFL's own pricing page renders its table through JavaScript and returned only a video-pricing example
to automated fetching, so **first-party FLUX prices are unconfirmed**. The aggregator
[fal.ai](https://fal.ai/pricing) lists **FLUX Kontext Pro at $0.04 per image** — Kontext is the
editing line, the one that takes your photo as input — which is the right order of magnitude and the
practical way to access these models anyway. Confirm against BFL directly before it goes in a
pricing model.

### The order-of-magnitude conclusion

Generated images land in the **$0.02-0.25 per image** band. Set against the ~2-4 cents the text model
costs, image generation is where the per-creative cost actually lives — it is 1x to 10x the entire
rest of the pipeline. And compositing is **$0**. Ten variants composited cost nothing; ten variants
generated cost real money every time somebody clicks regenerate.

### Text rendering: the providers say it themselves

This is the part worth quoting, because it is the technical crux of the generate-vs-composite
argument and it comes from the vendor rather than from me. OpenAI's own image generation guide, on
its current flagship image models:

> "Although significantly improved, the model can still struggle with precise text placement and
> clarity."

and lists **"Text Rendering"** among the known limitations of the GPT Image family.

Every static ad in this product needs a headline at a fixed character limit, usually a phone number,
and often an accreditation mark. "Struggles with precise text placement and clarity" is
disqualifying for a phone number. A compositor renders it in the right typeface at the right size
with the right kerning, every time, for free — and it can be *validated*, because the text is a
string you put there rather than pixels you have to OCR back to check.

Ideogram and Recraft are the two models usually named as best-in-class for legible in-image text, and
Recraft additionally for brand-consistent and vector output. **I did not confirm their current
pricing or capability claims from primary sources** — flagged as a gap. It is a gap that does not
change the recommendation, though: even a model that renders text perfectly is a slower, costlier,
non-deterministic way to do something CSS already does exactly.

### Watermarking and content credentials

Providers embed provenance signals in generated output — C2PA content credentials, and Google's
SynthID invisible watermarking. Google's pricing page makes no mention of SynthID, so I could not
confirm the current per-model watermarking behaviour from that source; **treat "generated images
carry detectable provenance" as the safe working assumption** rather than a verified per-provider
fact. It aligns with Meta's stated intent to detect third-party AI tools *"through industry-standard
signals"*, and it is the assumption that leads to the safer design either way.

## Generate vs. composite

This is the load-bearing question in the ticket, so it gets the long answer.

### What a contractor's ad actually has to do

A civil-construction ad is not a brand ad. It is a proof-of-competence ad shown to someone within
driving distance who has a cracked driveway or a drainage problem right now. The photograph carries
the proof. A homeowner scrolling past a picture of a resin-bound driveway is asking one question:
*did these people lay that, and does it look like the one I want?* Every credibility signal in the
ad — the slightly wonky camera angle, the neighbour's car in shot, the British weather — is doing
work. A model-generated driveway is smoother, better lit, better composed, and worth less, because
it is answering a question nobody asked.

This is not a moral point, it is a conversion point. The Client's own photos are the only asset in
this business that a competitor cannot buy.

### The three things a generated image gets wrong here

1. **It is a claim the Client cannot stand behind.** The ad says "we did this work". If the image is
   synthetic, that sentence is false. Meta's deceptive-content standards are the smaller half of the
   problem; a homeowner who books on the strength of a generated photo and gets something different
   is a refund, a review, and a complaint against the agency ad account.
2. **Text rendering is still the weak spot.** Every static ad needs a legible headline, often a phone
   number and a licence or accreditation mark. Rendering that *inside* a diffusion model's output is
   the one thing the format is worst at, and it is the one thing a compositor does perfectly, for
   free, in the correct font, at the correct size, every time. Putting text through an image model is
   choosing the unreliable tool for the easy half of the job.
3. **It throws away brand consistency.** Layout done in HTML/CSS or SVG is deterministic: the same
   logo lockup, the same brand colour, the same safe margins, on every creative, across every
   variant, forever. Layout done by a diffusion model is a lottery you re-enter on every generation.

### What compositing actually is

Render a layout over the Client's photo. The mechanics are unglamorous and that is the point:

- An HTML/CSS template rendered to PNG by headless Chromium, or an SVG overlay composited with a
  server-side image library. Either is a solved problem with mature tooling.
- Cost: **effectively zero** — compute only, no per-image API charge.
- Latency: **sub-second**, versus seconds to tens of seconds for a generation call.
- Deterministic, diffable, reviewable, and version-controllable. A layout template is a config
  record, which fits the map's "vertical as data" constraint exactly — the same way intake questions
  and prompt templates are already specified as configuration, not code.
- Variant generation is a loop over templates and copy, not N billed generation calls. Ten variants
  cost the same as one.

The AI contributions to a composited creative are: choosing which photo (vision), writing the copy
(text), and choosing which layout template suits the photo's composition (vision — a wide landscape
shot wants a bottom text bar, a tall shot wants a corner lockup).

### Where generated imagery does earn its place

Not never — but narrowly, and always *over* a real photograph rather than instead of one:

- **Outpainting / image expansion.** Clients shoot 4:3 landscape on a phone. Meta's recommended feed
  size is 4:5 portrait (1440x1800). Extending sky and tarmac to fill the frame is a real problem that
  a generation model solves well, and it does not invent the subject. Meta ships this in its own
  Advantage+ creative suite, which is a strong signal that it is considered acceptable practice.
- **Distraction and privacy removal.** Wheelie bins, skips, licence plates, bystanders' faces.
  Inpainting these out is both a quality and a GDPR improvement.
- **Background cleanup** on an otherwise good shot of finished work.

Each of these has a bright line: the finished work in the frame must be the Client's actual finished
work. Extending the sky is fine. Extending the driveway is not.

### The honest counter-argument

The case *for* generation is the cold-start problem: a Client onboards with no usable photos, or with
photos of only two of the six services they offer. That is a real gap and it will happen.

The answer is not to generate a fake job. It is to make photo capture part of onboarding — the map
already puts photo upload in the dashboard — and, for services with no photo, to run copy-led
creative: a strong typographic layout with a service name, an accreditation mark, and a service-area
line, over a neutral or generic background. That is honest, it is cheap, and it converts worse than a
real photo, which is the correct incentive: it makes the Client want to send photos.

## Meta's policy on AI-generated ad creative

### Disclosure and labelling

There is **no general requirement for a commercial advertiser to self-declare AI-generated imagery**
on Meta. What exists instead is automatic labelling applied by Meta, and a separate mandatory
disclosure that applies only to political, electoral and social-issue advertising — a category
advertdreams does not touch.

Meta's own statement of the labelling rules is in
[Expanding GenAI Transparency for Meta's Ads Products](https://about.fb.com/news/2025/02/gen-ai-transparency-metas-ads-products/)
(published 2025-02-03, updated 2026-06-01):

- *"If an advertiser is using our in-house generative AI creative features and these tools do not
  result in significant edits to the image or video and do not include a photorealistic human, then
  we will not apply any AI labels."*
- Significant edits without a photorealistic human: label appears behind the three-dot menu or next
  to the "Sponsored" label.
- *"When these tools result in the inclusion of an AI-generated photorealistic human, the label will
  appear next to the Sponsored label (not behind the three-dot menu)."*
- On third-party tools: *"We will also begin automatically detecting ads created or edited using
  third-party AI tools through industry-standard signals."*

Meta's Business Help Center is more specific than the newsroom post, and names the mechanism outright
([Ads and AI info labels](https://www.facebook.com/business/help/1010479435004531)):

> "Meta uses industry-standard detection methods, such as C2PA to identify when ad content has been
> created or edited using third-party generative AI tools. **When we detect this metadata, we label
> the content accordingly.**"

and on its own tools:

> "We will automatically apply an AI info label when you use features such as Background Generation,
> Image Generation, or Add Animation to create or significantly edit an image or video."

Two practical details that are easy to miss and worth building around:

- **Ads Manager warns you before you publish.** *"Before publishing, you will see a message during
  the ad creation process letting you know when an AI info label will appear on your ad."* That is a
  free, authoritative test — no guessing about whether a given creative trips the detector.
- **An optional self-disclosure toggle exists in certain regions.** *"You may choose to deliver ads
  to states or countries where local laws or guidelines include specific AI transparency
  requirements... advertisers will have the opportunity to self-disclose that GenAI was used and if
  they do so, the label will appear on the ad next to the Sponsored label."* Meta lists the European
  Region, California, New York, India and Taiwan. Note the framing: Meta offers the toggle; any
  *obligation* comes from local law, not from Meta. **A UK-targeting advertiser is inside the
  European Region here** — worth a legal look, and it is not something Meta will decide for you.

Three consequences for advertdreams:

1. **Labelling is applied by Meta, not declared by the advertiser.** There is no API field to fill in
   and no compliance workflow to build. The lever advertdreams controls is what it sends, not what it
   declares.
2. **For third-party tools the documented trigger is C2PA metadata in the uploaded file**, not a
   pixel classifier. Meta names no image classifier on the ads pathway — classifiers are documented
   only for organic content. If advertdreams sends a generated image, assume it will be detected and
   labelled. Do not build a metadata-stripping step: it is the kind of thing that reads badly if the
   account is ever reviewed by a human, and provider watermarking is designed to survive it anyway.
   **One caveat worth knowing:** boosting an organic post inherits the *organic* labelling regime,
   which does include classifiers — *"Organic labels may remain present when a piece of organic
   content is directly boosted to an ad via the boosting flow."* Publish as ads, not as boosts.
3. **A photorealistic generated human is the worst case.** It puts a visible AI label next to
   "Sponsored" on the ad itself. A generated "friendly contractor in a hi-vis vest" — an obvious
   temptation for this vertical — is precisely the creative choice that earns the most prominent
   label. Avoid generated people entirely.

**The composite approach sidesteps all of this.** A real photograph with a text and graphics overlay
is not generative AI imagery, carries no C2PA generation provenance, and gives Meta's detector
nothing to fire on.

### Restrictions relevant to home and property services

**Before/after imagery is permitted for construction work.** The only live before/after prohibition in
Meta's Advertising Standards is in the
[suicide, self-injury and eating disorders](https://transparency.meta.com/policies/ad-standards/objectionable-content/suicide-selfinjury-eating-disorders/)
standard, which bars ads that

> "Contain side by side imagery depicting before and after weight loss/gain not related to the use of
> a product or service."

Note both limiters: *weight loss/gain*, and only when *not related to a product or service*. The
[Health and Wellness](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness/)
standard is actually permissive — cosmetic before/after transformations are allowed, gated to 18+.
**No Meta advertising standard restricts before/after photographs of construction, groundworks,
driveways or drainage.** The single most effective creative format for this vertical is available,
and it should be the default layout template.

*Sourcing caveat:* the old standalone "Unrealistic Outcomes" policy page, which historically carried
a broader before/after rule, now 404s at its documented URL and no longer appears in the Advertising
Standards contents — its substance seems folded into
[Unacceptable Business Practices](https://transparency.meta.com/policies/ad-standards/fraud-scams/unacceptable-business-practices/).
An `/en-gb/` variant of the old URL still served content when fetched, so Meta's own URL space is
inconsistent here. If someone cites "Meta's Unrealistic Outcomes policy" at you, check whether it
still exists before acting on it. The conclusion above does not depend on that page either way.

**Home improvement may well BE a Housing Special Ad Category ad. Two live Meta pages contradict each
other.** This is the most consequential finding in the document and it reverses my first reading.

Meta's [How to choose a Special Ad Category](https://www.facebook.com/business/help/298000447747885)
page defines Housing as:

> "Ads that promote or directly link to a housing opportunity or related service, including but not
> limited to listings for the sale or rental of a home or apartment, homeowners insurance, mortgage
> insurance, mortgage loans, **housing repairs** and home equity or appraisal services."

"Housing repairs" is on the list, in Meta's own words. But the dedicated
[About ads for housing](https://www.facebook.com/business/help/1198401317374558) page enumerates
sale/rental listings, insurance, mortgage loans, financing, home equity and appraisal, real estate
and house-hunting services, and aggregators — and **does not mention repairs at all**. Its exclusion
list (hotels, resorts, retreats, homeownership tips, fair-housing education) does not exclude them
either. Both lists are explicitly open-ended ("including but not limited to", "and more", "aren't
comprehensive").

So a groundworks contractor sits in a genuine gap between two Meta pages, and neither resolves it.
The governing test on both is the same abstract phrase: *"promotes or directly links to a housing
opportunity or related service."* Driveways and drainage are plausibly a "related service"; they are
plausibly not.

**Why this is the top risk on the map, not a footnote.** If it applies and the category is not
declared, *"your ad may be rejected"* — a flat rejection with nothing wrong with the creative at all.
If it applies and the category *is* declared, the targeting restrictions bite hard
([Marketing API](https://developers.facebook.com/docs/marketing-api/audiences/special-ad-category),
`special_ad_categories` enum: `HOUSING`, `FINANCIAL_PRODUCTS_SERVICES`, `EMPLOYMENT`,
`ISSUES_ELECTIONS_POLITICS`, `NONE`, set at campaign level):

- *"Audiences based on city or pin drop locations will include an expanded radius"* — the Marketing
  API states a floor of *"15 mile or 25 kilometer radius"*, and *"Location exclusion is not
  supported"*
- Age, gender, postcode, exclusion targeting, lookalike audiences and saved audiences limited or
  unavailable; some interests unavailable
- Behaviour and demographic targeting prohibited

A firm that works a 10-mile patch cannot be targeted to a 10-mile patch. That does not merely tune
the targeting model — it changes the unit economics, because advertdreams pays for the wasted
impressions out of its own agency account.

The trigger is being a US advertiser, or targeting the US, Canada, or ~45 European territories
**including the United Kingdom**.

**Do not let this be settled by inference — including mine.** Get a written answer from Meta support,
or run one test campaign each way, before the targeting model or the pricing model is fixed. It
blocks [#8](https://github.com/TempleZide/advertdreams/issues/8) and
[#9](https://github.com/TempleZide/advertdreams/issues/9) more than this creative question does.

### Ad specifications (Facebook Feed image ad)

From [Meta's Ads Guide](https://www.facebook.com/business/ads-guide/update/image):

- Recommended resolution **1440 x 1800 px, 4:5 ratio** (3% aspect ratio tolerance)
- Minimum 600 px wide, 750 px high
- JPG or PNG, max 30 MB
- Primary text 50-150 characters, headline 27 characters

**The 20% text-in-image rule appears to be gone — but this is not fully confirmed.** Meta's Ads Guide
image specification page, fetched directly, states no text-coverage limit at all, and Meta's current
page on the subject is titled
[creative best practices for text in ads](https://www.facebook.com/business/help/223409425500940) —
"best practices", not a rule. Meta's own Advantage+ creative suite generates text overlays for
advertisers, which would be incoherent with an enforced 20% cap.

**Caveat: I could not confirm this verbatim from a primary Meta page.** Meta Business Help Center
articles are JavaScript-rendered and did not return body text to automated fetching; the removal is
attested only by secondary sources and by the *absence* of the rule from the fetchable Ads Guide
spec. Verify by hand in Ads Manager before the creative pipeline is specified — the whole compositing
approach depends on a bold burned-in headline not being a delivery penalty, so this is worth five
minutes of somebody's eyes on the actual page.

Note the 27-character headline limit as a hard constraint on the copy model's output schema. That is
a strong constraint, and worth enforcing structurally rather than hoping the prompt holds.

### Meta's own tools

Meta ships generative AI creative features inside Advantage+ creative — background generation, image
expansion, text variations — and in July 2026 announced
[Muse Image](https://about.fb.com/news/2026/07/introducing-muse-image-meta-ai/), its first in-house
image generation model, stating that *"In the coming weeks, advertisers and agencies will be able to
tap into Muse Image through Advantage+ creative."* No API for third-party programmatic access is
mentioned, and no advertiser pricing is published, so this is not currently something advertdreams
can build against — but it is worth watching, because free in-platform image expansion would remove
the only place generation is actually needed in this pipeline.

### Does generated imagery risk ad rejection?

**Not for being AI-generated — Meta says so directly.** From
[Meta's own guidance](https://www.facebook.com/business/help/1486382031937045):

> "Automated detection does not change ad eligibility. Your ads must still comply with all applicable
> ad policies."

> "You cannot request removal of automated detected labels."

An AI label is a disclosure, not a penalty and not a strike. It is also permanent once applied.
Meta's
[Advertising Standards](https://transparency.meta.com/en-gb/policies/ad-standards/) contain no
prohibition on AI-generated or synthetic ad imagery. The top-level categories are Community
Standards, Unacceptable Content, Fraud/Scams/Deceptive Practices, Restricted Goods & Services,
Objectionable Content, IP Infringement, Social Issue/Electoral/Political Advertising, Product- &
Format-Specific Policies, Business Asset Policies, and Data Use Restrictions. AI provenance is a
*labelling* matter, not a *permissibility* matter.

The real exposure runs through three other doors:

1. **Deceptive content.** Not "you used AI" but "you showed work you did not do". This is the risk
   compositing eliminates by construction.
2. **Intellectual property infringement.** A generation model reproducing a recognisable trademark,
   a competitor's branded product, or a copyrighted design in the background of a driveway shot.
   Compositing over a Client photo does not create this risk; generation does.
3. **Delivery penalty short of rejection.** Meta states that *"Lower-quality ads that do not
   necessarily violate our policies may experience an impact on performance."* Generic-looking
   generated imagery is exactly the profile of a low-quality ad. The penalty here may never show up
   as a rejection — it shows up as a worse cost per lead, which is harder to diagnose and worse for
   the business.

Mechanics worth recording: review is *"typically completed within 24 hours"*, runs on *"images,
video, text and targeting information, as well as an ad's associated landing page"*, and on violation
*"ads are rejected and accounts may be restricted."*

That last clause is the one that matters most for advertdreams specifically. The map's standing
constraint is that **all Clients run through advertdreams' own agency ad account**, so an enforcement
action is not a single Client's problem — it is every Client's problem simultaneously. This asymmetry
is the strongest argument in the whole document for the conservative creative approach: the upside of
generated imagery is marginally prettier ads, and the downside is a restricted account serving the
entire book of business. **Landing pages are reviewed too**, which is a constraint on the lead-capture
ticket, not just this one.

## Latency

The important observation is that **this pipeline is not latency-sensitive**, and designing as if it
were would be a mistake.

The map's publishing model puts a human approval step between generation and publish: advertdreams
generates, the Client approves, advertdreams publishes. Nobody is watching a spinner. On top of that,
Meta's own ad review is *"typically completed within 24 hours"*. A creative-generation pipeline that
takes 90 seconds and one that takes 4 seconds are indistinguishable to every actual user of this
system.

Concrete budget for one composited creative:

| Stage | Latency |
|---|---|
| Photo triage (Claude vision, one call over N photos) | a few seconds |
| Copy generation (Claude, ~1,500 output tokens) | a few seconds |
| Layout composition (headless Chromium or SVG compositing) | sub-second |
| Optional outpainting to 4:5 (image model) | seconds to tens of seconds |
| Upload to Meta + ad review | up to 24 hours |

Anthropic rates comparative latency as Sonnet 5 "Fast", Opus 5 "Moderate", Haiku 4.5 "Fastest"
([models overview](https://platform.claude.com/docs/en/about-claude/models/overview)) — another
reason Sonnet 5 is the sensible default here. Fast mode exists for Opus 5 and Opus 4.8 at $10/$50 per
MTok, and is **not worth buying for this workload**: paying a 2x premium to shave seconds off a step
that is followed by a human review queue and a 24-hour platform review is spending money on nothing.

Two design consequences worth carrying into the pipeline ticket:

1. **Generate creative in batches, not on request.** The Batch API's 50% discount costs nothing here
   because the latency it trades away has no value. Overnight generation of the next period's
   variants is strictly better than synchronous generation.
2. **Latency budget belongs to the Client-facing dashboard, not the generator.** If a Client clicks
   "regenerate" and waits, that is a UI decision to make deliberately — with a queued job and a
   notification, not a blocking request.

## Open risks and things I could not confirm

Listed so they are not quietly forgotten, in order of how much they would hurt.

1. **Housing Special Ad Category — unresolved, and two live Meta pages contradict each other.**
   The Special Ad Category page lists "housing repairs" inside Housing; the dedicated housing page
   omits repairs entirely. Both lists are open-ended. Getting this wrong costs either flat ad
   rejections (category not declared when it should be) or a targeting radius far wider than a local
   trade's service area (declared when it need not be). **Confirm with Meta in writing, or by test
   campaign, before the targeting and pricing models are fixed.** Blocks #8 and #9.
2. **The 20% text-in-image rule.** Believed removed and absent from the fetchable Ads Guide spec, but
   Meta's Business Help Center pages are JavaScript-rendered and would not yield body text to
   automated fetching. The compositing recommendation assumes burned-in headline text carries no
   delivery penalty. Verify by hand in Ads Manager.
3. **What counts as a "significant edit"** for AI labelling. Meta uses the phrase and never defines
   it. This decides whether outpainting a photo to 4:5 earns an AI label. Mitigated in practice by
   the pre-publish warning in Ads Manager — build the check into the workflow rather than reasoning
   about it. Also unconfirmed: whether Meta's own **image expansion** and **text generation** features
   trigger labels; both sit inside the Ad Creative Generative AI Terms but neither appears in the
   labelled-features list.
4. **Whether Meta strips or preserves C2PA / IPTC / EXIF metadata on upload.** No Meta page addresses
   metadata retention. Do not assume either way — relevant both to AI detection and to whether Client
   photo EXIF (including GPS coordinates of a customer's home) leaves the pipeline.
5. **Regional AI-transparency law.** Meta offers an optional self-disclosure toggle for the European
   Region, California, New York, India and Taiwan, but the underlying duty is statutory, not Meta's.
   A UK-targeting advertiser falls inside the European Region grouping. Needs a legal answer, not a
   platform answer.
6. **No Meta rule was found governing stock or generated imagery presented as the advertiser's own
   completed work.** The applicable hooks are claim-based — *"deceptive or exaggerated claims about
   the success of a product or service"* — rather than image-provenance-based. This is an inference,
   not a quoted rule. **It does not weaken the recommendation**, because the case against generated
   imagery here is commercial and ethical before it is regulatory: the argument was never "Meta will
   catch you".
7. **Unconfirmed pricing:** exact OpenAI per-model image-output rate, first-party FLUX prices, and
   Ideogram / Recraft pricing and text-fidelity claims.
8. **Client photo rights, consent and EXIF.** Out of scope for this ticket and already on the map's
   "not yet specified" list, but this research touches it: inpainting out a bystander's face or a
   licence plate is a real privacy measure, and raw Client photos otherwise reach Meta as shot.

**Resolved and no longer open:** whether commercial ads need AI disclosure (they do not — the
mandatory regime is scoped to social-issue, electoral and political ads, which advertdreams does not
touch); whether AI imagery itself risks rejection (it does not — *"Automated detection does not
change ad eligibility"*); and whether construction before/after imagery is permitted (it is).

## Recommendation, in one paragraph

Use **Claude Sonnet 5** (`claude-sonnet-5`, $2/$10 per MTok) for photo triage and copy generation, via
the **Batch API** at 50% off, with the vertical's prompt template behind a **prompt cache breakpoint**
— roughly **2 cents per creative-set**, which is not a cost worth optimising. Composite the copy over
the Client's real photographs with a deterministic HTML/CSS or SVG layout template stored as a
configuration record, at **zero marginal cost and sub-second latency**. Make **before/after the default
layout** — it is the strongest format for this vertical and Meta permits it outside health contexts.
Reserve image *generation* for repairing the Client's own photos (aspect-ratio expansion, distraction
removal) and never for inventing the subject or a person. This keeps the ads honest, keeps the
agency ad account out of deceptive-content review, keeps text legible, and costs less than the
alternative.
