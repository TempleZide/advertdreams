# Agent instructions

Read this before doing anything in this repo. It applies to every agent and every tool. `CLAUDE.md` and `GEMINI.md` point here and add only what is specific to those tools.

New to the project? [`README.md`](README.md) says what advertdreams is and how the pieces fit. Come back here for how to work.

## The one rule that catches everyone

This repo is planning, not product. There is no application code and none gets written yet. The work is deciding the product shape and the business model, one question at a time, in GitHub Issues.

If a ticket looks like it wants code, it wants a decision. The exception is a `wayfinder:prototype` ticket, which builds a throwaway to answer a question and lives on its own branch, never on `main`.

## The wayfinder map

Work is organised as a map, which is one GitHub issue holding the destination, the standing constraints, and every decision made so far. For this project that is [issue #2](https://github.com/TempleZide/advertdreams/issues/2).

Read the map first, every session. Its Notes section holds constraints that are settled and must not be relitigated without redrawing the whole map. Several plausible ideas are already ruled out there, and proposing one again wastes a session.

Tickets are GitHub sub-issues of the map, labelled by what resolving them takes:

| Label | What it means |
|---|---|
| `wayfinder:research` | Find out a fact about the outside world. Meta's policy, a supplier's price, a competitor's product. |
| `wayfinder:grilling` | Argue a decision out with Sean until it is settled. No external research needed. |
| `wayfinder:prototype` | Build a throwaway to answer a question the argument cannot. |
| `wayfinder:task` | Produce or provision something a decision waits on. Register an account, write a document. |
| `wayfinder:map` | The map issue itself. Only one. |

The frontier is the set of open tickets with no open blocker and no assignee. Take the first in map order. Blocking uses GitHub's native issue dependencies, so `gh issue view` shows it.

Resolving a ticket has three steps and skipping the third is the common failure. Comment the answer on the issue, close the issue, then append a line to the map's Decisions so far section. A decision that never reaches the map is invisible to the next session.

Use the `gh` CLI for all of this. `docs/agents/issue-tracker.md` has the exact commands.

## Vocabulary

[`CONTEXT.md`](CONTEXT.md) defines the terms advertdreams owns: Client, Lead, Vertical, Service, Intake, Creative, Site, Campaign, Tier, Tracking Number, Ad Spend. Use those words as written. Do not drift to synonyms the glossary avoids, and do not invent a term without adding it there.

[`docs/jargon.md`](docs/jargon.md) decodes the vocabulary that belongs to Meta, to telephony, and to the advertising trade. CPL, App Review, instant form, A2P 10DLC. Where the two files collide, `CONTEXT.md` wins.

[`docs/adr/`](docs/adr/) holds architecture decision records. It is empty today because no stack exists yet. If your output contradicts an ADR, say so out loud rather than quietly overriding it.

## Research already done

Ten documents in [`docs/research/`](docs/research/), each behind a closed ticket. Read the relevant one before researching the same ground again.

| Document | What it established |
|---|---|
| `meta-third-party-advertising.md` | Ads run from the Client's own Facebook Page, granted as a client asset. Developer Policy 10.5 forbids pooling advertisers, so it is one ad account per Client. |
| `meta-marketing-api-access.md` | No App Review needed to publish from an agency ad account. The real limit is a write burst of roughly 20 calls per 5 minutes. |
| `meta-lead-capture.md` | Lead Ads are the only mechanism carrying per-lead attribution. A hosted page cannot resolve a click back to an ad, and click-to-call returns nothing. |
| `meta-access-tier-resolution.md` | Standard Access is enough and costs no App Review. A documented 5 ad account creation cap is the open risk. |
| `meta-page-access-grant.md` | We can request the Page grant by API, but the Client approves it manually and no webhook reports any access change. Leads Access is a wholly separate grant with no API at all. |
| `tracking-number-providers.md` | Twilio at roughly $8 per Client per month. A2P 10DLC registry fees dominate the cost and delay SMS by days at onboarding. |
| `ai-ad-creative.md` | Composite over the Client's real job photos rather than generate imagery, at 2 to 3.5 cents per creative set. The model invents about one false claim per run. |
| `client-page-hosting.md` | Hosting a Site costs cents per Client per month. The domain is the only line item that matters, and a subdomain we own is the right default. |
| `tiktok-marketing-api.md` | Adding TikTok later is an addition, not a rewrite, but it forces a Creative to be more than one image and needs a legal entity before the first API call. |
| `competitive-landscape.md` | The bundle already exists at a $600 to $800 per month floor, while half of US small businesses budget under $1,000 for all marketing including spend. The gap is price, not features. |

## Prototypes

Both live on their own branches and are deliberately not merged to `main`.

`prototype/ad-creative` holds three generated advertisements for a real civil construction business, which is the evidence that the creative quality is good enough to sell. `prototype/splash` holds a product splash page. Its README flags one claim on the page that is still unsettled, so read that before showing the page to anyone.

## How to write

Everything written into this repo goes through the unslop rules in [`.claude/skills/unslop/SKILL.md`](.claude/skills/unslop/SKILL.md). That file is plain Markdown and readable by any tool. It applies to issue bodies, pull request bodies, commit messages, and documents alike. Claude reaches it as a skill; other agents should read it and follow it.

The short version. No em dashes. Sentence case headings. Say what a thing does rather than how it feels. Name the actor instead of using passive voice. Cut the puffery vocabulary the file lists.

Two exemptions. Quoted source text is never edited, even when it breaks a rule. The files in `docs/agents/` are byte-identical copies of upstream skill templates, so leave them alone and re-sync from upstream instead of editing them.

## Two things to know about this repo

It is going private, and a collaborator working through Gemini is joining. Nothing written here should assume a public audience.

Commercial decisions are provisional. Sean drives the sessions and relays to a partner who is the project lead and the financier. Where reversing a decision would be expensive, say in the ticket that it needs confirming.
