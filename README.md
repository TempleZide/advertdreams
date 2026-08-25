# advertdreams

End-to-end marketing for US small businesses. Mom-and-pop shops and owner-operators, not enterprise.

A business subscribes. advertdreams hosts a web presence for them, turns their own photos and videos into advertisements, publishes and manages those ads, captures the leads, and hands them back through a dashboard. One subscription covers everything, ad spend included.

**This repo is planning, not product.** No application code is written yet. The work happening here is deciding the product shape and business model, one resolved question at a time, in GitHub Issues. See [Where the thinking lives](#where-the-thinking-lives).

## How it fits together

```mermaid
flowchart LR
    subgraph client["Client<br/>a small business"]
        owner["Client Owner<br/>signs up, pays,<br/>uploads photos"]
    end

    subgraph advertdreams["advertdreams"]
        intake["Intake<br/>services, service area,<br/>media, budget"]
        creative["Creative generation<br/>ad copy over the<br/>Client's own photos"]
        site["Site<br/>one styled page on<br/>a subdomain we own"]
        dash["Dashboard<br/>+ SMS and email push"]
    end

    subgraph meta["Meta"]
        page["Client's Facebook Page<br/>shared with us as a<br/>client asset"]
        acct["Ad account<br/>we own it,<br/>one per Client"]
        camp["Campaign<br/>runs the Creatives"]
    end

    phone["Tracking Number<br/>ours, forwards to<br/>the Client's phone"]
    lead(["Lead<br/>a potential customer<br/>of the Client"])

    owner --> intake
    owner -. "grants Page access<br/>and Leads access" .-> page
    intake --> creative
    intake --> site
    creative --> camp
    page --> camp
    acct --> camp

    camp -- "ad is shown" --> lead
    lead -- "instant form" --> camp
    lead -- "form on the page" --> site
    lead -- "calls or texts" --> phone
    phone -- "forwards the call" --> owner

    camp -- "leadgen webhook" --> dash
    site --> dash
    phone --> dash
    dash --> owner
```

A Lead arrives by one of three routes, and they are not interchangeable. Meta's instant forms are the only path that carries per-lead attribution back to the ad that produced it. The form on the Site gets higher-intent leads but cannot prove which ad sent them. The Tracking Number is the only thing that can attribute a phone call, which is why it is mandatory rather than an upsell.

## How the money works

The Client pays a subscription and nothing else. No per-lead fee, because a per-lead fee invites a monthly argument about what counts as a lead.

advertdreams funds the ad spend out of its own ad account and recovers it in the subscription price. Ad spend is a cost of goods, not a pass-through. Every tier therefore carries a hard cap on ad spend, and pricing has to cover that cap.

## What v1 is

- **Meta only.** TikTok is second, and no decision may foreclose it.
- **Civil construction is the first vertical.** A vertical is data, not code. It is a set of intake questions, a service vocabulary and a batch of prompt templates, so adding salons later means adding records.
- **One styled page for the Site**, chosen from a handful of ready-made styles, on a subdomain advertdreams owns. It has to grow into a real multi-page site later without a redesign. A Client's own domain is an upgrade, never the onboarding path.
- **Self-serve signup, async activation.** The Client signs up and pays on the web. Ad account creation and phone number registration finish in hours or days, so the dashboard needs an honest "being set up" state.
- **Creative approval by silence.** New creatives queue and publish themselves after 48 hours unless the Client kills them, which takes one notification and one tap. The veto is real and necessary, because the model invents a false claim about once per run.

## Where the thinking lives

| What | Where |
|---|---|
| What a Client, Lead, Creative, Site and Tier actually mean | [`CONTEXT.md`](CONTEXT.md) |
| Advertising and Meta jargon: CPL, App Review, instant form, A2P 10DLC | [`docs/jargon.md`](docs/jargon.md) |
| The open questions and everything settled so far | [Issue #2, the wayfinder map](https://github.com/TempleZide/advertdreams/issues/2) |
| Research findings behind the settled decisions | [`docs/research/`](docs/research/) |
| Recorded architecture decisions | [`docs/adr/`](docs/adr/) |
| How agents should work in this repo | [`docs/agents/`](docs/agents/), [`CLAUDE.md`](CLAUDE.md) |

**Start with the map.** Issue #2 holds the standing constraints, one line per resolved question, and what is deliberately still open. Four plausible ideas are already ruled out or deferred there: per-lead pricing, a multi-page website builder, TikTok at launch, and Client-funded ad spend. Read its Notes before proposing anything.
