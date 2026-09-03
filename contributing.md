# Contributing

Thanks for wanting to add a tool! Please read this before opening a PR.

If you find this list useful, consider [starring the repo](https://github.com/Zio-Tibia/awesome-no-signup-tools) — it helps others discover it.

## What qualifies

- The tool must be usable **without creating an account or signing up** (no email gate, no OAuth wall).
- It must be **free** to use for the core functionality described.
- Prefer tools that do **client-side processing** (no file/data upload to a server) — this isn't a hard requirement, but it's a strong plus and should be noted in the description if true.
- No tools that require a credit card to start, even for a "free trial".
- Ads or analytics (e.g. AdSense, Google Analytics) on the tool's site are **not** a reason to exclude it. "No signup" and "client-side" refer to how the tool itself processes your data, not to whether the site is ad-supported. Don't claim a tool has no tracking unless you've actually verified it.
- **One tool per domain.** Only one page from a given root domain (e.g. `example.com`) may be listed, regardless of subpage, tool, or language variant. This keeps the list diverse and prevents it from being used to bulk-list every page of a single site. Link to the domain's main/root tool page, not a specific sub-tool, unless the root domain isn't itself a usable tool.

If a tool is rejected, it may be logged in [no-go-list.md](no-go-list.md) so we don't reconsider it without a reason.

## How to add a tool

1. Add a single line to the relevant category list in [README.md](README.md).
2. **Add it to the bottom of the list**, not alphabetically. This keeps diffs small and avoids merge conflicts.
3. Use this line format:

   ```md
   - [Tool Name](https://example.com/) - Short, factual description ending in a period.
   ```

4. If your tool doesn't fit an existing category, propose a new one in your PR description — don't create it silently.

## Description guidelines

- One sentence, factual, no marketing language ("best", "amazing", "revolutionary").
- Mention if it's client-side processing when true, but don't describe a tool as "privacy-friendly" just because it's client-side — ads/analytics may still be present.
- End with a period.

## Checklist before opening a PR

- [ ] The tool works with **no signup/registration** required
- [ ] The tool is **free** to use (core functionality)
- [ ] I added **one line** at the **bottom** of the correct category list
- [ ] The description is factual and follows the format above
- [ ] The link goes directly to the tool (not an affiliate/referral link)
- [ ] I am not the owner of the tool, or I have disclosed that I am in the PR description
- [ ] No other tool from the same root domain is already listed
- [ ] (Optional) I starred the repo
