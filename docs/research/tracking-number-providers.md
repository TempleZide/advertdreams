# Tracking phone number providers: capability and per-Client cost

Research for [#6](https://github.com/TempleZide/advertdreams/issues/6). Prices verified **2026-08-23** against live provider pages. Telecom pricing moves, so re-verify before quoting a Client. Every figure is cited to a primary source or explicitly flagged as unconfirmed.

---

## Answer

**Use Twilio.** Budget **~$8 per Client per month** at typical volume (**$6–$16** across a normal-to-busy month), plus **~$20 one-time per Client** for A2P 10DLC registration.

The decisive finding is that **the telephony is not the cost**. Raw Twilio usage for a busy small contractor is under $4/month. The cost that matters is **A2P 10DLC registration, which in the ISV/reseller model appears to be per-Client rather than per-platform**: roughly $20 one-time plus $1.50–$10/month for *every* Client, and a registration step that gates onboarding by hours to days. That single line item is larger than all the calls and texts combined, and it is the number that belongs in the pricing model as a hard floor.

CallRail and the other call-tracking specialists are priced as a finished product sold to an end business, not as an input to a SaaS reselling numbers. They cost 1.3–1.6x Twilio for advertdreams' volume profile, the gap widening as call volume rises, and what they charge for is largely redundant. advertdreams owns its own `Lead` and `Campaign` model per [#10](https://github.com/TempleZide/advertdreams/issues/10) regardless, which covers the dashboard, the attribution and the reporting.

**Plivo is genuinely cheaper than Twilio** on telephony, by about **$1.70/Client/month**, and is a legitimate alternative rather than a rounding error at scale. It does not flip the recommendation, because the saving is ~20% of a per-Client cost whose larger half is registry fees that Plivo charges too. See *Alternatives* below for the numbers and the crossover point.

---

## Cost model

### Volume assumption

A small US civil-construction contractor on a modest advertdreams Meta campaign. Phone is one of two lead channels (the landing-page form is the other), so phone volume is a fraction of total leads.

| | Typical month | Busy month |
|---|---|---|
| Inbound calls (incl. spam/wrong number) | 25 | 75 |
| Billed minutes per call | 3 | 4 |
| Total billed minutes | 75 | 300 |
| Inbound SMS | 15 | 50 |
| Outbound SMS (auto-reply + lead alerts to the Client Owner) | 20 | 90 |
| Call recording | all calls, 12-month retention | same |

**Unconfirmed:** average inbound call duration for home-services contractors is not published by CallRail or any benchmark source I could reach. The 3-minute figure is a modelling assumption, not a sourced benchmark. Twilio rounds *each leg* up to the next whole minute independently, so "3 billed minutes" corresponds to roughly a 2.1–3.0 minute actual call. Volume figures are likewise assumptions, originally calibrated to a home-services CPL of ~$91 attributed to [WebFX 2026 benchmarks](https://www.webfx.com/blog/home-services/home-services-marketing-benchmarks/). **Correction, [#29](https://github.com/TempleZide/advertdreams/issues/29): that figure does not exist at that source.** WebFX publishes all-channel CPLs there ($76-$100 high-volume band), and its actual Facebook figure for home improvement is $24.29. The working Meta range is **$41-$51** (Superads construction $50.86, Jul 2025-Jul 2026; WordStream home improvement $41.26). A lower CPL means more leads per dollar, so the call volumes below are conservative rather than optimistic, and the ~$8/Client/month conclusion is unaffected because A2P registry fees do not scale with call volume. the widely-cited "300 tracked calls/month" benchmark describes a much larger contractor than advertdreams' target Client.

### Twilio, per Client per month

| Line item | Calculation | Typical | Busy |
|---|---|---|---|
| US local number | $1.15/mo | $1.15 | $1.15 |
| Inbound voice leg | min × $0.0085 | $0.64 | $2.55 |
| Forwarding leg (outbound to Client's real phone) | min × $0.0140 | $1.05 | $4.20 |
| Call recording | min × $0.0025 | $0.19 | $0.75 |
| Recording storage (steady state at 12-month retention) | 12 × min × $0.0005 | $0.45 | $1.80 |
| Inbound SMS | msg × $0.0083 | $0.12 | $0.42 |
| Outbound SMS incl. carrier fee | msg × ($0.0083 + $0.0045) | $0.26 | $1.15 |
| **Telephony subtotal** | | **$3.86** | **$12.02** |
| A2P 10DLC campaign, monthly, per Client | $1.50–$10.00 | $1.50–$10.00 | $1.50–$10.00 |
| **Total** | | **$5.36–$13.86** | **$13.52–$22.02** |

**Plan on ~$8/Client/month for the pricing model**, with a ceiling of ~$22 for an unusually busy Client. Plus **~$20 one-time per Client** at onboarding ($4 brand + $15 campaign vetting), rising to ~$44 if a brand fails standard vetting and needs enhanced vetting.

A forwarded call bills **both legs**. That is the single most commonly missed fact in call-tracking cost models. Combined rate on a local number: **$0.0225/minute**. ([Twilio: How much am I charged for call forwarding](https://support.twilio.com/hc/en-us/articles/223132367-How-Much-am-I-Charged-for-Call-Forwarding-with-Twilio); rates from [Twilio US voice pricing](https://www.twilio.com/en-us/voice/pricing/us).)

Recording storage is cumulative and easy to under-budget: it bills every stored minute every month. At 12-month retention it settles at ~12x the first month's storage line. Shortening retention to 90 days cuts that line by 75%.

### CallRail, per Client per month

Assuming advertdreams pools all Clients into one CallRail account on the entry **Lead Tracking** plan at **$50/mo** (5 local numbers, 250 minutes, 25 texts included), amortised across 20 Clients:

| Line item | Rate | Typical | Busy |
|---|---|---|---|
| Additional local number | $3.00/mo | $3.00 | $3.00 |
| Additional local minutes | $0.05–$0.06/min | $4.13 | $16.50 |
| Additional texts | $0.03 each | $1.05 | $4.20 |
| Base plan amortised (20 Clients) | $50 ÷ 20 | $2.50 | $2.50 |
| **Total** | | **~$10.70** | **~$26.20** |

Roughly **1.3x Twilio at typical volume and 1.6x at busy volume**, and the gap widens with usage: CallRail's per-minute rate is ~2.4x Twilio's combined two-leg rate and its per-text rate is ~2.3x Twilio's. Rates from [CallRail pricing](https://www.callrail.com/pricing) (live-fetched 2026-08-23).

Note that CallRail's included allowances are per *account*, not per Client, so the "5 numbers / 250 minutes / 25 texts" only absorbs the first few Clients before every Client is pure overage.

---

## Feature comparison

| | Twilio | CallRail |
|---|---|---|
| Local number / month | **$1.15** | $3.00 marginal (5 incl. in $50 base) |
| Toll-free / month | $2.15 | $5.00 |
| Voice, inbound | $0.0085/min | bundled into one tracked-minute meter |
| Voice, forwarding leg | $0.0140/min | (same meter) |
| **Effective forwarded minute** | **$0.0225** | **$0.05–$0.06** |
| SMS out | $0.0083 + ~$0.0045 carrier fee | $0.03 |
| SMS in | $0.0083 | $0.03 |
| MMS out / in | $0.022 / $0.0165 (+$0.01 carrier) | not separately published, **unconfirmed** |
| Call recording | $0.0025/min + $0.0005/min/mo storage | included in plan |
| Transcription | $0.05/min | included on higher tiers |
| Real-time inbound-call webhook | Yes, synchronous HTTP on call arrival | Yes, but use **Pre-Call** or **Call Routing Complete**. The Post-Call webhook has no real-time expectation and can lag up to **20 minutes** while recording and transcription finish |
| Real-time inbound-SMS webhook | Yes, synchronous HTTP on message receipt | Yes, "Text Message Received" webhook |
| Call outcome + duration to the webhook | Yes. `<Dial>` `action` returns `DialCallStatus`, `DialCallDuration`, `DialCallSid`, `DialBridged` | Yes, in post-call payload |
| **Provision by area code via API** | **Yes**. `AvailablePhoneNumbers Local` takes an `AreaCode` parameter | **Yes**. Pass `{"area_code": "303"}` when creating a tracker. It is request-and-assign with no separate search endpoint, and fails cleanly rather than substituting another area code |
| Minimum spend / commitment | None; pure pay-as-you-go | $50/mo floor; annual plans ~10% cheaper |

Twilio sources: [US voice pricing](https://www.twilio.com/en-us/voice/pricing/us), [US SMS pricing](https://www.twilio.com/en-us/sms/pricing/us) (carrier fees confirmed on this page: AT&T $0.0035, T-Mobile $0.0045, Verizon $0.0045, US Cellular $0.005, other $0.004 for long-code outbound SMS; $0.01 for long-code outbound MMS; plus a $0.001 failed-message processing fee), [TwiML request parameters](https://www.twilio.com/docs/voice/twiml#request-parameters), [messaging webhook guide](https://www.twilio.com/docs/messaging/guides/webhook-request), [`<Dial>` verb](https://www.twilio.com/docs/voice/twiml/dial), [AvailablePhoneNumberLocal resource](https://www.twilio.com/docs/phone-numbers/api/availablephonenumberlocal-resource).

### CallRail notes

CallRail is technically capable. It is rejected on price and fit, not capability.

- **Area-code provisioning works.** Pass `{"area_code": "303"}` when creating a tracker via the API. It is request-and-assign with no separate search endpoint, and it fails cleanly when no inventory exists in that area code rather than silently substituting a different one. That last behaviour is actually desirable: a Client must never be handed a number from the wrong area code.
- **Use the right webhook.** CallRail's **Post-Call** webhook explicitly carries *no expectation of real-time delivery and may lag up to 20 minutes* while recording and transcription complete. For real-time `Lead` creation, use **Pre-Call** or **Call Routing Complete** instead. This is an easy trap to fall into, since "post-call" sounds like the obvious choice for logging a completed call.
- **10DLC is not fully handled for you.** AI pre-fills a form, a human reviews and submits it, EIN entry is always manual, and 3–5 business days is typical. CallRail charges **$1.50/month per registered campaign**. There is a real architecture choice here: one agency-wide registration shares a low daily send cap and liability across all Clients, versus a separate CallRail account per Client for better deliverability at $1.50/month each.
- **The real agency price is not public.** CallRail's white-label page advertises no setup fee, no contracts and unlimited company accounts but is sales-gated. Third-party blogs cite ~$147/month, which is rumour and unverified. CallRail's own agency pricing estimator also shows a "Starter $55/mo" tier that does not appear on the main pricing page; the discrepancy could not be reconciled.

### Alternatives, verified

Twilio is the recommendation, but it is not the cheapest. These were checked live on 2026-08-23.

| | US local number/mo | Combined forwarded minute | SMS out | Recording | 10DLC help | Base fee |
|---|---|---|---|---|---|---|
| **Twilio** | $1.15 | $0.0225 | $0.0083 + $0.0045 | $0.0025/min + storage | Self-serve (Trust Hub) | $0 |
| **Plivo** | **$0.50** | **$0.017** ($0.0055 in + $0.0115 out) | $0.0077 + $0.0025–$0.005 | listed $0.0000/min | Self-serve | $0 |
| **Telnyx** | $1.00 | ~$0.004 + SIP trunking fees (*unconfirmed total*) | $0.004 + carrier fee | $0.002/min, $0 storage | Self-serve, best ISV/reseller docs | $0 |
| **SignalWire** | *unconfirmed* | ~$0.0146 (*rate card unconfirmed*) | *unconfirmed* | metered, rate *unconfirmed* | **Registered CSP, actively helps register**, $4/brand | $0 (+$5 to leave trial) |
| **CallTrackingMetrics** | $2.00 | $0.035–$0.045 | *unconfirmed* | included | Self-serve Trust Center | $79–$1,999/mo |

**Plivo is the one worth taking seriously.** At the typical-month volume its telephony subtotal is ~$2.17 against Twilio's $3.86, so **~$1.70/Client/month cheaper**, about 20% of the all-in per-Client cost. That is real but not decisive. The larger half of the per-Client cost is registry fees Plivo charges too, and Twilio's documentation, ecosystem and support are worth more than $1.70/Client to a solo builder. The crossover is volume. At 100 Clients the gap is ~$170/month, at which point re-running this comparison is worth an afternoon.

**Telnyx** has the clearest ISV/reseller 10DLC documentation of any provider surveyed, which matters given the per-Client brand question below. Its headline per-minute rates are the lowest quoted, but they are stated "plus applicable SIP trunking fees" and the stacked total could not be confirmed. The headline is not the price.

**SignalWire** is the only provider that is itself a registered Campaign Service Provider and actively helps with 10DLC registration ($4 per brand submission). If per-Client registration turns out to be the real onboarding bottleneck, that is worth revisiting. Its pricing page renders rates in client-side JavaScript, so its core numbers could not be read; a browser session would be needed to pin them down.

**CallTrackingMetrics** is the most credible turnkey alternative to CallRail if built-in agency tooling (sub-accounts, client markup pricing, client signup pages) is ever wanted instead of building it. Reseller features unlock at Marketing Pro (~$149–179/month) plus $65/domain for white-label, on top of $2/number and ~$0.04/minute.

**Dropped, with reasons:** Bandwidth (sales-quote-gated, enterprise orientation, no self-serve); Ringba ($147+/month floor, built for pay-per-call affiliate routing, so the wrong shape); Retreaver (no public pricing, pay-per-call marketplace); WhatConverts (agency tier from $500/month); Nimbata (bills per answered call rather than per minute, so different unit economics, worth a look only if call durations turn out long); PhoneWagon (**domain unreachable / DNS failure on 2026-08-23**, and I cannot recommend a vendor that may no longer exist).

---

## US regulatory prerequisites

These add setup cost and delay, and one of them is a genuine open legal question.

### A2P 10DLC registration is required, and probably per-Client

Any business sending SMS from a 10-digit long code must register a **Brand** and a **Campaign** with The Campaign Registry. Since **1 February 2025** the major carriers block essentially 100% of unregistered A2P traffic outright. There is no throttling grace period any more, and T-Mobile publicises penalties up to $10,000 per content violation for evasion.

The expensive part is the structure. Because advertdreams is an **ISV provisioning numbers on behalf of many separate end-customers**, carrier policy points to **one Brand and one Campaign per Client**, not one for the platform. No two brands may share a number, and every number must be associated with a campaign. ([Telnyx ISV/10DLC guidance](https://support.telnyx.com/en/articles/5593977-independent-service-vendors-isvs-and-10dlc).) Shared-brand exceptions for ISVs are rare and mostly granted to franchises.

Per Client, that means roughly:

- **Brand registration:** ~$4 one-time (~$4.41 on the sole-proprietor path); **+$40** if the brand fails standard vetting and is escalated to enhanced vetting
- **Campaign vetting:** ~$15 one-time
- **Campaign monthly:** **$1.50–$10/month**, by use case (Low Volume Mixed ≈ $1.50, Sole Proprietor ≈ $2, standard business use cases higher), typically with a 3-month minimum commitment
- **Delay:** standard brand vetting from near-instant to ~48h; enhanced vetting 3–5 business days; campaign vetting minutes to days

Twilio's own brand fees were confirmed directly from [Twilio's A2P 10DLC brand docs](https://www.twilio.com/docs/trust-hub/registrations/a2p-10dlc-brand): **$4.50 base brand fee, +$41.50 for Standard Brand vetting**. Twilio's Trust Hub is the mechanism, not an extra charge on top ([Trust Hub docs](https://www.twilio.com/docs/trust-hub)).

**Unconfirmed:** the exact campaign vetting fee and the monthly campaign fee range. Twilio's authoritative fee article ([help.twilio.com A2P 10DLC pricing](https://help.twilio.com/articles/1260803965530-What-pricing-and-fees-are-associated-with-the-A2P-10DLC-service-)) renders its fee tables in JavaScript and returned no readable table on fetch; TCR's own fee sheet could not be retrieved. The $15 / $1.50–$10 figures are triangulated across several 2026 CPaaS partner docs. **Verify these in the Twilio Console before they go into a pricing model.** They are the largest single component of the per-Client cost.

**There is no useful inbound-only exemption.** CTIA's "conversational" carve-out is understood industry-wide to cover genuine peer-to-peer human texting, not a platform's automated replies. A reply sent from advertdreams' platform to a consumer who texted the tracking number is A2P traffic and needs registration. *(Flagged: CTIA's primary Messaging Principles text could not be fetched directly; this is corroborated by CallRail and multiple compliance vendors but not read at source.)*

The **sole-proprietor brand tier** is capped at 1 campaign, 1 number, ~1 message/second, ~3,000 SMS/day. It cannot serve advertdreams as a platform, though it may be the right tier for each individual contractor Client registered as their own brand.

**Product implication for [#10](https://github.com/TempleZide/advertdreams/issues/10) and [#9](https://github.com/TempleZide/advertdreams/issues/9):** onboarding a Client is not instant. A new Client's number cannot send SMS until their brand and campaign clear. Either onboarding tolerates a days-long SMS-disabled window, or the sales-assisted onboarding flow starts registration before the Client is fully signed.

### The open legal question on STIR/SHAKEN

The default posture for a company that merely buys numbers from a CPaaS is that **the CPaaS is the voice service provider of record**: it signs the calls and carries the Robocall Mitigation Database and FCC Form 499-A obligations. Thousands of CPaaS-built apps, CallRail included, operate this way.

But the FCC's **Eighth Report and Order (FCC 24-120**, adopted Nov 2024, Federal Register Aug 2025, **compliance required 18 September 2025)** expanded "Voice Service Provider" to include businesses that originate calls to the PSTN *on behalf of others* or that *control the phone numbers used in outbound calls*. ([FCC 24-120](https://docs.fcc.gov/public/attachments/FCC-24-120A1.pdf); [Twilio's own coverage](https://www.twilio.com/en-us/blog/FCC-rule-changes-2024).)

advertdreams provisions and controls the tracking numbers, and the forwarding leg is originated on behalf of the Client. That is close to the fact pattern the expanded definition describes. **Twilio explicitly declines to make this determination for customers and tells them to consult their own counsel.** Since 18 September 2025 an entity that *is* a VSP can no longer rely on its carrier's attestation. It needs its own SPC token and certificate, its own RMD filing (annual recertification by 1 March), and likely a Form 499-A (annual, 1 April, with USF exposure above a ~$10,000 de minimis threshold).

**This is the single biggest unresolved risk in this ticket and it needs a telecom regulatory attorney, not an engineering judgement.** If advertdreams is not a VSP: $0 and no delay. If it is: weeks of process and ongoing filings.

Separately, and regardless of VSP status: a forwarded call that presents the original caller's CID can only earn **"B" (partial) attestation** under STIR/SHAKEN, because the carrier can authenticate the caller but cannot vouch that the caller owns the displayed number. This is legal, because legitimate call forwarding is a recognised use case under the Truth in Caller ID Act, which turns on intent to defraud. But B-attestation traffic is more likely to be spam-labelled or filtered. That is a **lead-delivery risk**: a forwarded lead call that the Client's phone labels "Spam Likely" is a lost lead.

### Treat every call as all-party for recording consent

Federal law (18 U.S.C. § 2511) is one-party consent, but 11–13 states require all-party consent (California, Connecticut, Delaware, Florida, Illinois, Maryland, Massachusetts, Michigan, Montana, Nevada, New Hampshire, Pennsylvania, Washington are commonly listed; sources disagree at the margins on CT/NV/MI, so [cross-check the list](https://www.recordinglaw.com/party-two-party-consent-states/) before hardcoding anything).

Because a tracking number can be dialled from any state and courts generally apply the stricter jurisdiction's law, the only safe rule is: **announce recording on every call, universally**. An upfront recorded announcement is the standard mechanism by which continuing the call establishes implied consent.

**The Client consents too.** The contractor is a party to the recorded call. Capture their consent in the service agreement at onboarding rather than relying on implied consent. The caller-side announcement does not cover the Client leg.

Cost: $0 in fees, but it is a real product requirement. Announcement audio has to play before the `<Dial>` bridges, and a consent clause has to go in the Client agreement.

### TCPA / consent for outbound

Texting the Client Owner about their own leads is transactional, not telemarketing. They provided the number in connection with the service they are paying for, so consent is implied for messages closely related to that purpose. **Still capture explicit SMS opt-in in the signup flow.** It is cheap belt-and-braces for an automated message stream.

Replying to a consumer who texted the tracking number first is low-risk *within that conversation* but **does not create durable consent** for later unrelated outbound. *(Flagged: no FCC guidance or case squarely on point was found; treat replies as scoped to the immediate thread.)*

The FCC's 2023 **one-to-one consent rule was vacated** by the 11th Circuit in *Insurance Marketing Coalition Ltd. v. FCC* (24 Jan 2025) and formally repealed by the FCC around Sept 2025. The pre-2023 prior-express-written-consent standard governs in 2026. ([Wiley](https://www.wiley.law/alert-UPDATE-11th-Circuit-Vacates-FCCs-One-to-One-TCPA-Consent-Rule), [MoFo](https://www.mofo.com/resources/insights/250130-eleventh-circuit-vacates-fcc-s-tcpa-one-to-one-consent-rule).) There is no B2B exemption. TCPA protects the number, not the subscriber's business status.

### Minor items

- **CNAM:** optional, free or near-free through the provider, ~2–7 days to propagate. Worth setting on the forwarding leg so the Client's phone shows something recognisable instead of "Unknown".
- **State USF / 911 / regulatory surcharges:** the provider passes these through on the number. Small, but not zero. *Unconfirmed*, so check the provider's fee schedule.
- **Number porting:** not applicable. advertdreams provisions new numbers; nothing is ported.

---

## Implications

1. **The pricing model floor is ~$8/Client/month, not ~$4.** Roughly half of that is 10DLC registry fees that exist whichever provider is chosen. Feeds [#9](https://github.com/TempleZide/advertdreams/issues/9).
2. **Onboarding a Client has a one-time ~$20 telecom cost and a multi-day SMS-enablement delay.** A Client who churns in month one costs more than a month of margin. Feeds [#9](https://github.com/TempleZide/advertdreams/issues/9) on minimum terms.
3. **Twilio's webhooks give the lead pipeline everything it needs**: synchronous inbound-call and inbound-SMS webhooks for real-time `Lead` creation, and a `<Dial>` action callback carrying duration and outcome for qualifying a call as a `Lead` versus a hang-up. Feeds [#10](https://github.com/TempleZide/advertdreams/issues/10).
4. **Call recording is nearly free but not free of obligations.** A recording announcement before the forward, and a Client consent clause, are both build-time requirements. This partly answers the "call recording consent" item the map lists under *Compliance*.
5. **Choosing Twilio means advertdreams builds the call-tracking layer itself**, which is forwarding TwiML, an announcement, webhook handlers and number provisioning. This is small (the `Lead` model and dashboard are being built regardless per [#10](https://github.com/TempleZide/advertdreams/issues/10)) and buys full control of attribution, which is advertdreams' own model, not a vendor's.

## Open risks

- **VSP classification under FCC 24-120 is unresolved and needs an attorney.** If advertdreams is a VSP, it needs its own STIR/SHAKEN certificate, RMD filing and Form 499-A. Twilio will not answer this. This is the one item that could materially change the cost and timeline.
- **The 10DLC campaign monthly fee ($1.50–$10) and campaign vetting fee ($15) are not confirmed against a primary source.** Twilio's fee tables are JavaScript-rendered and TCR's fee sheet was unreachable. Since this is the largest per-Client line item, confirm it in the Twilio Console before the pricing model hardens.
- **Whether 10DLC really requires a brand per Client, or whether advertdreams can register one platform brand, is worth confirming with Twilio directly.** A platform-wide brand would cut the per-Client recurring cost by roughly half and remove the onboarding delay entirely. The ISV guidance says per-Client; getting a definitive answer from Twilio is high-value.
- **B-attestation spam-labelling on forwarded calls is a lead-delivery risk** with no clean fix. Worth measuring in the first live Client rather than assuming.
- **Average call duration is a guess.** The whole per-minute component scales with it. Instrument it on the first Clients and revise.
- **Plivo is ~20% cheaper and the decision should be revisited at scale.** At 100 Clients the difference is ~$170/month. The recommendation rests on Twilio's ecosystem being worth more than $1.70/Client to a solo builder, which stops being true at some point.
- **Several competitor figures could not be confirmed**: Telnyx's stacked SIP trunking fee (so its headline per-minute rate is not its real price), SignalWire's local-number and SMS rates (JavaScript-rendered pricing page), CallTrackingMetrics' per-SMS rate, and CallRail's real agency price. None of these change the recommendation, but none should be quoted as fact.
- **Carrier SMS fees changed in January 2026 (T-Mobile)** and will change again. The carrier-fee figures here were read live from Twilio's pricing page on 2026-08-23 but should be re-read annually.
