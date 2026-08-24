# Prototype: three generated ad creatives

Throwaway. Answers [#8](https://github.com/TempleZide/advertdreams/issues/8): **is AI-generated
ad creative good enough to sell?**

Not production code. Nothing here is meant to survive; the answer is meant to survive.

## Run it

```sh
node generate.mjs   # intake.json + prompt.md -> claude CLI -> copy.json (validates Meta's limits)
node render.mjs     # copy.json + photos -> out/*.png (1440x1800) + out/review.html
```

Needs the `claude` CLI on PATH (no API key) and `chromium` as the renderer. Open
`out/review.html` to judge the creatives in a mock feed.

## The Client

**Appalachian Excavating & Grading**, Lenoir NC — a real one-owner civil construction business in
the Western North Carolina foothills. Intake in `intake.json` is built from their public website:
real services, real service area, real phone. The photographs in `photos/` are their own job
photos, pulled from their site. Campaign service: **Forestry Mulching**.

They were the third business tried. The first two were rejected for a reason that turned out to be
the most important finding here — see below.

## What the pipeline does

1. **Photo triage** — the model reads captions of every uploaded photo and picks which photo suits
   which layout, including which two photos form a genuine before/after pair.
2. **Copy** — headline, subline, CTA and Facebook post body, under Meta's 27-character headline
   limit, from `prompt.md` (a per-vertical template, not code).
3. **Composite** — HTML/CSS over the Client's real photograph, screenshotted by headless Chromium
   at 1440x1800. No image generation anywhere in the pipeline.

Three layouts: `hero` (full-bleed photo, scrim, headline), `before_after` (matched pair, labels,
headline band), `proof` (photo over a brand-colour block with proof points).

## Findings

**1. Photo supply is the binding constraint, not the AI.** Two of the three candidate businesses
had to be abandoned because their website photos were 315x315 and 427x407 thumbnails — below
Meta's 600x750 minimum, let alone the recommended 1440x1800. The third stored phone originals
(`20180827_123551.jpg`, 2500x3333). Layout and copy quality are solved; **photo intake quality is
not**, and it decides whether a Client can be onboarded at all. Onboarding needs to take phone
originals directly, and needs a resolution gate that fails loudly.

**2. Matched before/after pairs are rare and worth asking for by name.** The research on
[#7](https://github.com/TempleZide/advertdreams/issues/7) made before/after the recommended default
layout. It is the strongest of the three here — but only because this Client happened to shoot
matched pairs and name the files `forestry-mulching-before-photoN` / `-after-photoN`. On the first
Client attempted, the model dutifully produced a "before/after" from two unrelated job sites and it
read as *nothing changed*. Intake has to request pairs explicitly, and the pipeline has to be able
to fall back when there are none.

**3. Photo triage is the weakest model step.** Copy quality was good on the first attempt for both
Clients tried. Triage was not: on the first Client it chose a flat photo of raked sand as the hero
image over an available shot of a crane lowering a tank. Captions alone may not be enough — this is
the step that most likely wants the real image passed to a vision model, or a human choosing the
hero photo during review.

**4. The model overclaims even under an explicit no-invention rule.** `prompt.md` says plainly that
nothing outside the intake may be claimed. Both runs still produced one invented claim —
"permits included" on the first Client, "Brush cleared same day" on this one. Neither is in the
intake. **The human approval step in the map is not optional**, and a claims-checking pass is
probably a cheaper second model call than a Client discovering an ad promising something they do
not offer.

**5. Character limits must be enforced in code, not in the prompt.** `generate.mjs` validates every
field and exits non-zero. It has caught nothing yet across two runs, which is the point: it is the
cheapest possible guard against a headline that silently truncates in the feed.

**6. Cost and latency are not worth optimising**, exactly as
[#7](https://github.com/TempleZide/advertdreams/issues/7) predicted. One `claude -p` call produces
all three creative-sets. Compositing is a sub-second Chromium screenshot at zero marginal cost.

## Deliberate shortcuts

- Copy generation shells out to the `claude` CLI so this runs with no API key. Production would use
  the Batch API with a prompt cache breakpoint above `## Intake`.
- Photos are pre-processed once by hand (`magick -resize 1440x`). Production takes phone originals.
- No brand colour extraction — `intake.json` carries a hand-picked hex.
- Three layouts, hard-coded in `render.mjs`. The map wants them as configuration records.
