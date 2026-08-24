# Context

Glossary for advertdreams. Terms only — no implementation detail, no decisions. Decisions live in `docs/adr/` and on the wayfinder map.

## Client

A business that pays advertdreams a subscription. Small business or independent owner. The first Clients are civil construction businesses. A Client is the paying entity; the person who logs in and uploads photos is a **Client Owner** where the distinction matters.

## Lead

A potential customer of the Client, captured by advertdreams and handed to the Client. A Lead originates from one of the Client's Campaigns and arrives by landing-page form submission, phone call, or SMS to a Tracking Number.

Not every inbound contact is a Lead: what qualifies (wrong numbers, spam, repeat callers) is an open decision, not settled here.

## Vertical

A category of business that shares intake questions, service vocabulary, and creative patterns — for example civil construction, hair salons, photographers. A Vertical is data, not code: adding one means adding a record, not a module. Civil construction is the only Vertical at launch.

## Service

A specific job a Client sells, drawn from their Vertical's vocabulary — "stump removal", "land clearing", "driveway grading". Ads are generated per Service, not per Client in the abstract.

## Intake

The information collected from a Client that everything else is generated from: their Services, service area, photos, budget, and contact routing. Intake questions are defined by the Vertical.

## Creative

One generated advertisement: an image plus ad copy. Multiple Creatives are generated per Service so the Client can choose and so the platform can optimise between them.

## Campaign

A Client's advertising activity on Meta for a set of Services — the targeting, the budget, and the Creatives running against it. A Campaign is what spends money and what a Lead is attributed to.

## Tracking Number

A phone number owned by advertdreams, assigned to a Client, and forwarded to the Client's real number. Calls and texts to it are recorded as Leads and attributed to the Campaign that published it.

## Ad Spend

Money paid to Meta to run a Client's Campaign. advertdreams pays this from its own ad account and recovers it through the subscription price, so Ad Spend is a cost of goods, not a pass-through.
