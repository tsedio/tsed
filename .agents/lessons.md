# Agent lessons

Rules learned from user corrections. Review them at the start of each session (see `AGENTS.md` > Agent workflow).

Format: one entry per pattern, with the rule, why it matters and how to apply it.

<!-- Add new lessons below. -->

## Keep small but measurable gains in shared utilities and startup code

- **Rule**: when optimizing, keep a ~5% gain on a utility used across many packages, and keep startup-only gains (decorator composition, metadata registration). Do not discard them as noise just because the per-request path is not affected.
- **Why**: Ts.ED runs in serverless functions (AWS Lambda) where cold start time matters, and `@tsed/core` utilities such as `cleanObject` are called from dozens of packages, so small gains add up.
- **How to apply**: discard only changes whose gain is inside the run-to-run variance of the A/B loop. For startup code, say in the commit that the gain targets cold starts.
