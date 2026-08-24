# Context

Glossary for advertdreams. Terms only — no implementation detail, no decisions. Decisions live in `docs/adr/` and on the wayfinder map.

## Client

A business that pays advertdreams a subscription. Small business or independent owner. The first Clients are civil construction businesses. A Client is the paying entity; the person who logs in and uploads photos is a **Client Owner** where the distinction matters.

## Lead

A potential customer of the Client, captured by advertdreams and handed to the Client. A Lead originates from one of the Client's Campaigns and arrives by instant-form submission, by a form on the Client's Site, or by phone call or SMS to a Tracking Number.

Not every inbound contact is a Lead: what qualifies (wrong numbers, spam, repeat callers) is an open decision, not settled here.

## Vertical

A category of business that shares intake questions, service vocabulary, and creative patterns — for example civil construction, hair salons, photographers. A Vertical is data, not code: adding one means adding a record, not a module. Civil construction is the only Vertical at launch.

## Service

A specific job a Client sells, drawn from their Vertical's vocabulary — "stump removal", "land clearing", "driveway grading". Ads are generated per Service, not per Client in the abstract.

## Intake

The information collected from a Client that everything else is generated from: their Services, service area, photos, budget, and contact routing. Intake questions are defined by the Vertical.

## Creative

One generated advertisement: an image or a video, plus ad copy. Multiple Creatives are generated per Service so the Client can choose and so the platform can optimise between them. Creatives are built from the Client's own media, not generated from nothing.

## Site

The web presence advertdreams hosts for a Client — where their ads send people, and where a Lead can fill in a form. Chosen by the Client from a small set of ready-made styles and filled with their own Services, service area, and media.

Deliberately not called a "page": the Client also has a Facebook Page, which is a different thing owned by a different party.

## Campaign

A Client's advertising activity on an ad platform for a set of Services — the targeting, the budget, and the Creatives running against it. A Campaign is what spends money and what a Lead is attributed to.

## Tier

A level of subscription. A Tier fixes the price the Client pays, the Ad Spend included at that price, and what else the Client gets. Every Tier carries a cap on Ad Spend, because advertdreams funds it.

## Tracking Number

A phone number owned by advertdreams, assigned to a Client, and forwarded to the Client's real number. Calls and texts to it are recorded as Leads and attributed to the Campaign that published it.

## Ad Spend

Money paid to Meta to run a Client's Campaign. advertdreams pays this from its own ad account and recovers it through the subscription price, so Ad Spend is a cost of goods, not a pass-through.
