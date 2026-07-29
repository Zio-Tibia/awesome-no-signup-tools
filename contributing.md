# Contributing

Thanks for wanting to add a tool! Please read this before opening a PR.

## What qualifies

- The tool must be usable **without creating an account or signing up** (no email gate, no OAuth wall).
- It must be **free** to use for the core functionality described.
- Prefer tools that do **client-side processing** (no file/data upload to a server) — this isn't a hard requirement, but it's a strong plus and should be noted in the description if true.
- No tools that require a credit card to start, even for a "free trial".

If a tool is rejected, it may be logged in [no-go-list.md](no-go-list.md) so we don't reconsider it without a reason.

## How to add a tool

1. Add a single row to the relevant category table in [README.md](README.md).
2. **Add it to the bottom of the table**, not alphabetically. This keeps diffs small and avoids merge conflicts.
3. Use this row format:

   ```md
   | [Tool Name](https://example.com/) | Category | Short, factual description ending in a period. |
   ```

4. If your tool doesn't fit an existing category, propose a new one in your PR description — don't create it silently.

## Description guidelines

- One sentence, factual, no marketing language ("best", "amazing", "revolutionary").
- Mention if it's client-side/privacy-friendly when true.
- End with a period.

## Checklist before opening a PR

- [ ] The tool works with **no signup/registration** required
- [ ] The tool is **free** to use (core functionality)
- [ ] I added **one row** at the **bottom** of the correct category table
- [ ] The description is factual and follows the format above
- [ ] The link goes directly to the tool (not an affiliate/referral link)
- [ ] I am not the owner of the tool, or I have disclosed that I am in the PR description
