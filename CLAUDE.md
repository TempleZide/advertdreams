# advertdreams

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues, driven through the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, each label string equal to its name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Prose style

Everything written into this repo, including issue and pull request bodies, goes through the `unslop` skill in `.claude/skills/unslop/`. It always applies.

Two exemptions. Quoted source text is never edited, even when it breaks a rule. The files in `docs/agents/` are byte-identical copies of the mattpocock skill templates and their wording is what those skills read, so leave them alone and re-sync them from upstream instead.
