// PROTOTYPE — throwaway. Composites copy.json over the Client's own photos into three
// 1440x1800 Meta feed creatives, using headless Chromium as the renderer.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const dir = new URL('.', import.meta.url).pathname
const intake = JSON.parse(readFileSync(dir + 'intake.json', 'utf8'))
const copy = JSON.parse(readFileSync(dir + 'copy.json', 'utf8'))
const { business_name, phone, brand } = intake.client
const photo = (id) => `../photos/hi/${id}.jpg`

const css = `
@font-face { font-family: Anton; src: url(../fonts/Anton.ttf); }
@font-face { font-family: Inter; src: url(../fonts/Inter-400.ttf); font-weight: 400 }
@font-face { font-family: Inter; src: url(../fonts/Inter-600.ttf); font-weight: 600 }
@font-face { font-family: Inter; src: url(../fonts/Inter-800.ttf); font-weight: 800 }
* { margin: 0; padding: 0; box-sizing: border-box }
body { width: 1440px; height: 1800px; overflow: hidden; font-family: Inter, sans-serif;
       background: ${brand.ink}; position: relative; -webkit-font-smoothing: antialiased }
img { width: 100%; height: 100%; object-fit: cover; display: block }
.frame { position: absolute; inset: 0 }
.wordmark { position: absolute; top: 0; left: 0; right: 0; padding: 44px 56px; z-index: 3;
            display: flex; justify-content: space-between; align-items: center;
            background: linear-gradient(#000d, #0000) }
.wordmark b { font-weight: 800; font-size: 34px; letter-spacing: .13em; color: #fff;
              text-transform: uppercase }
.wordmark span { font-weight: 600; font-size: 32px; color: #fff; opacity: .92 }
.scrim { position: absolute; left: 0; right: 0; bottom: 0; height: 62%; z-index: 1;
         background: linear-gradient(#0000 0%, #000000cc 46%, #000000f2 100%) }
.stack { position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; padding: 0 72px 88px }
.kicker { display: inline-block; background: ${brand.primary}; color: #fff; font-weight: 800;
          font-size: 30px; letter-spacing: .18em; text-transform: uppercase;
          padding: 16px 26px 14px; margin-bottom: 30px }
h1 { font-family: Anton; font-weight: 400; text-transform: uppercase; color: #fff;
     font-size: 132px; line-height: .93; letter-spacing: -.005em }
.sub { font-size: 44px; font-weight: 600; color: #ffffffdd; margin-top: 26px; line-height: 1.25 }
.cta { display: flex; align-items: center; gap: 34px; margin-top: 46px }
.btn { background: ${brand.primary}; color: #fff; font-weight: 800; font-size: 40px;
       padding: 30px 48px; border-radius: 10px; letter-spacing: .01em }
.tel { font-family: Anton; font-size: 56px; color: #fff; letter-spacing: .01em }
.label { position: absolute; z-index: 3; background: #000000d9; color: #fff; font-weight: 800;
         font-size: 32px; letter-spacing: .16em; text-transform: uppercase; padding: 16px 26px }
.half { position: absolute; left: 0; right: 0; height: 670px; overflow: hidden }
.band { position: absolute; left: 0; right: 0; bottom: 0; height: 460px; background: ${brand.ink};
        padding: 54px 72px; display: flex; flex-direction: column; justify-content: center }
.band h1 { font-size: 96px }
.band .sub { margin-top: 16px; font-size: 38px }
.band .cta { margin-top: 30px }
.rule { position: absolute; left: 0; right: 0; top: 670px; height: 8px;
        background: ${brand.primary}; z-index: 4 }
.points { margin: 38px 0 0; list-style: none }
.points li { font-size: 46px; font-weight: 600; color: #fff; padding-left: 66px; margin-bottom: 22px;
             position: relative }
.points li::before { content: "✓"; position: absolute; left: 0; top: -2px; color: #fff;
                     font-weight: 800; font-size: 46px }
.brandblock { position: absolute; left: 0; right: 0; bottom: 0; height: 730px;
              background: ${brand.primary}; padding: 66px 72px 60px;
              display: flex; flex-direction: column }
.brandblock h1 { font-size: 112px }
.spacer { flex: 1 }
.footline { display: flex; justify-content: space-between; align-items: flex-end }
.footline .sub { margin: 0; font-size: 38px }
.whitebtn { background: #fff; color: ${brand.ink}; font-weight: 800; font-size: 40px;
            padding: 28px 44px; border-radius: 10px }
`

const page = (body) =>
  `<!doctype html><meta charset=utf-8><style>${css}</style>${body}`

const wordmark = `<div class=wordmark><b>${business_name}</b><span>${phone}</span></div>`

const layouts = {
  hero: (c) => page(`
    <div class=frame><img src="${photo(c.photo_id)}"></div>
    <div class=scrim></div>
    ${wordmark}
    <div class=stack>
      <div class=kicker>${c.kicker}</div>
      <h1>${c.headline}</h1>
      <div class=sub>${c.subline}</div>
      <div class=cta><div class=btn>${c.cta}</div><div class=tel>${phone}</div></div>
    </div>`),

  before_after: (c) => page(`
    <div class=half style="top:0"><img src="${photo(c.before_photo_id)}"></div>
    <div class=half style="top:678px"><img src="${photo(c.after_photo_id)}"></div>
    <div class=rule></div>
    <div class=label style="top:120px;left:0">${c.before_label}</div>
    <div class=label style="top:798px;left:0;background:${brand.primary}">${c.after_label}</div>
    ${wordmark}
    <div class=band>
      <h1>${c.headline}</h1>
      <div class=sub>${c.subline}</div>
      <div class=cta><div class=btn>${c.cta}</div><div class=tel>${phone}</div></div>
    </div>`),

  proof: (c) => page(`
    <div class=frame style="bottom:730px;overflow:hidden"><img src="${photo(c.photo_id)}"></div>
    ${wordmark}
    <div class=brandblock>
      <h1>${c.headline}</h1>
      <ul class=points>${c.points.map((p) => `<li>${p}</li>`).join('')}</ul>
      <div class=spacer></div>
      <div class=footline>
        <div><div class=sub style="opacity:.9">${c.subline}</div><div class=tel style="font-size:58px;margin-top:6px">${phone}</div></div>
        <div class=whitebtn>${c.cta}</div>
      </div>
    </div>`),
}

mkdirSync(dir + 'out', { recursive: true })
for (const [name, render] of Object.entries(layouts)) {
  writeFileSync(`${dir}out/${name}.html`, render(copy[name]))
  execFileSync('chromium', [
    '--headless', '--no-sandbox', '--hide-scrollbars',
    '--window-size=1440,1800', '--force-device-scale-factor=1',
    '--virtual-time-budget=4000',
    `--screenshot=${dir}out/${name}.png`,
    `file://${dir}out/${name}.html`,
  ], { stdio: 'ignore', cwd: dir })
  console.log(`out/${name}.png`)
}

// A single page a non-developer can open and judge: each creative in a mock feed post,
// at roughly the size a phone shows it.
const card = (name, c) => `
  <article>
    <header><b>${business_name}</b><span>Sponsored</span></header>
    <p class=body>${c.primary_text}</p>
    <img src="${name}.png" alt="">
    <footer><div><small>${name.replace('_', '/')} layout</small>
      <b>${c.headline}</b></div><div class=cta>${c.cta}</div></footer>
  </article>`

writeFileSync(dir + 'out/review.html', `<!doctype html><meta charset=utf-8>
<title>Ad creative prototype — ${business_name}</title>
<style>
 @font-face { font-family: Inter; src: url(../fonts/Inter-400.ttf); font-weight: 400 }
 @font-face { font-family: Inter; src: url(../fonts/Inter-600.ttf); font-weight: 600 }
 @font-face { font-family: Inter; src: url(../fonts/Inter-800.ttf); font-weight: 800 }
 body { font-family: Inter, sans-serif; background: #eef0f3; margin: 0; padding: 40px 20px;
        color: #14181f }
 h1 { font-size: 26px; max-width: 1180px; margin: 0 auto 6px }
 .lede { max-width: 1180px; margin: 0 auto 34px; font-size: 16px; line-height: 1.55; color: #444 }
 .row { display: flex; gap: 24px; justify-content: center; align-items: flex-start; flex-wrap: wrap }
 article { width: 380px; background: #fff; border-radius: 10px; overflow: hidden;
           box-shadow: 0 1px 3px #0002 }
 header { display: flex; justify-content: space-between; align-items: baseline;
          padding: 14px 16px 8px; font-size: 14px }
 header span { color: #65686c; font-size: 12px }
 .body { margin: 0; padding: 0 16px 12px; font-size: 15px; line-height: 1.4 }
 article img { width: 100%; display: block }
 footer { display: flex; justify-content: space-between; align-items: center;
          background: #f0f2f5; padding: 12px 16px; gap: 12px }
 footer small { display: block; color: #65686c; font-size: 11px; text-transform: uppercase;
                letter-spacing: .08em }
 footer b { font-size: 15px }
 .cta { background: #e4e6eb; padding: 9px 14px; border-radius: 6px; font-weight: 600;
        font-size: 14px; white-space: nowrap }
</style>
<h1>Would this contractor run these?</h1>
<p class=lede>Three creatives for <b>${business_name}</b> (${intake.client.base_town}) —
 service: <b>${intake.campaign_service}</b>. Every photograph is the Client's own. The copy was
 written by Claude Sonnet from the intake record; the layout is HTML/CSS composited over the photo.
 Images are 1440&times;1800, Meta's recommended feed size.<br><br>
 The two questions: <b>would a contractor pay for these</b>, and <b>would they run them</b>?</p>
<div class=row>${Object.entries(layouts).map(([n]) => card(n, copy[n])).join('')}</div>
`)
console.log('out/review.html')

// A single self-contained file: images inlined as data URIs, system fonts only. Opens
// anywhere, including straight off a GitHub raw URL — nothing to unpack, no assets to lose.
const jpeg = (name) => {
  execFileSync('magick', [`${dir}out/${name}.png`, '-resize', '900x', '-quality', '82',
    `${dir}out/.${name}-web.jpg`])
  const b64 = readFileSync(`${dir}out/.${name}-web.jpg`).toString('base64')
  execFileSync('rm', [`${dir}out/.${name}-web.jpg`])
  return `data:image/jpeg;base64,${b64}`
}

const standalone = readFileSync(dir + 'out/review.html', 'utf8')
  .replace(/@font-face \{[^}]*\}\n\s*/g, '')
  .replace(/font-family: Inter, sans-serif/, "font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif")
  .replace(/src="(\w+)\.png"/g, (_, n) => `src="${jpeg(n)}"`)
writeFileSync(dir + 'review-standalone.html', standalone)
console.log('review-standalone.html')
