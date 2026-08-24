// PROTOTYPE — throwaway. Answers issue #8: is generated ad creative good enough to sell?
// Fills prompt.md with intake.json, runs it through the `claude` CLI, validates the
// character limits Meta imposes, writes copy.json.
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const dir = new URL('.', import.meta.url).pathname
const intake = readFileSync(dir + 'intake.json', 'utf8')
const prompt = readFileSync(dir + 'prompt.md', 'utf8').replace('{{INTAKE}}', intake.trim())

// ponytail: shells out to the `claude` CLI so the prototype needs no API key. Production
// would use the Batch API with a prompt cache breakpoint on everything above `## Intake`.
const raw = execFileSync('claude', ['-p', prompt, '--model', 'sonnet'], {
  encoding: 'utf8',
  maxBuffer: 1 << 22,
})

// The model likes to preface the JSON with a sentence. Take the outermost object.
const json = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)
const copy = JSON.parse(json)

// Meta's limits, enforced here rather than hoped for in the prompt.
const LIMITS = {
  kicker: 24, headline: 27, subline: 42, cta: 18,
  before_label: 12, after_label: 12,
}
const problems = []
for (const [layout, c] of Object.entries(copy)) {
  for (const [field, max] of Object.entries(LIMITS)) {
    const v = c[field]
    if (typeof v === 'string' && v.length > max)
      problems.push(`${layout}.${field}: ${v.length}/${max} — "${v}"`)
  }
  for (const [i, p] of (c.points ?? []).entries())
    if (p.length > 24) problems.push(`${layout}.points[${i}]: ${p.length}/24 — "${p}"`)
  const n = c.primary_text?.length ?? 0
  if (n < 50 || n > 150) problems.push(`${layout}.primary_text: ${n}, want 50-150`)
}

writeFileSync(dir + 'copy.json', JSON.stringify(copy, null, 2) + '\n')
console.log(problems.length ? 'OVER LIMIT:\n' + problems.join('\n') : 'copy.json written, all fields within limits')
process.exitCode = problems.length ? 1 : 0
