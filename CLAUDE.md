# advertdreams

Read [`AGENTS.md`](AGENTS.md) first. It holds the working instructions for every agent: the wayfinder map, the ticket types, the vocabulary, the research already done, and the prose rules.

What follows is Claude-specific wiring only.

## Skill files

The mattpocock engineering skills read three files in `docs/agents/`. They are byte-identical copies of the upstream templates, so re-sync them rather than editing them.

- Issue tracker: GitHub Issues through the `gh` CLI. See `docs/agents/issue-tracker.md`.
- Triage labels: the five canonical roles, each label string equal to its name. See `docs/agents/triage-labels.md`.
- Domain docs: single-context, so `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Prose style

The `unslop` skill in `.claude/skills/unslop/` always applies, to issue and pull request bodies as much as to documents. `AGENTS.md` states the policy and the two exemptions.
