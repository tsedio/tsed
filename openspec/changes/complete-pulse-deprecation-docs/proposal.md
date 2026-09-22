## Why

Issue [#3376](https://github.com/tsedio/tsed/issues/3376) asks to deprecate `@tsed/pulse` and redirect users to `@tsed/agenda` + Agenda v6. The archived `migrate-tsed-agenda-to-v6` change added a first banner and a config diff, but both Pulse docs entry points still promote `npm install @tsed/pulse @pulsecron/pulse`, the package README lacks the AI-oriented rewrite section, the tutorial lacks the decorator/injection/lifecycle-hook diffs, the README banner is malformed, and the package itself carries no deprecation signal for IDEs or npm.

## What Changes

- Turn `packages/third-parties/pulse/readme.md` and `docs/tutorials/pulse.md` into complete deprecation + migration guides: deprecation banner, Agenda v6 install commands (npm/yarn/pnpm/bun), dependency table, config diff, decorator/injection/lifecycle-hook diffs, and an AI-oriented deterministic rewrite list. Legacy Pulse usage is moved under an explicit "Legacy usage" section.
- Mark the `@tsed/pulse` public API (`JobsController`, `Pulse`, `Every`, `Define`, `PulseSettings`, `PulseService`, `PulseModule`, the `pulse` configuration key) with `@deprecated` TSDoc pointing to `@tsed/agenda`, and prefix the package description with `[DEPRECATED]`.
- Stop promoting Pulse: remove the Pulse card from the docs home page and label the sidebar entry "Pulse (deprecated)".
- Cross-link the Agenda docs (tutorial and README) to the Pulse migration guide.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `pulse-deprecation-guidance`: require Agenda v6 install guidance, package-level deprecation signals, and that Pulse is no longer promoted from the docs home page.

## Impact

- Affected files: `packages/third-parties/pulse/{readme.md,package.json,src/**}`, `docs/tutorials/pulse.md`, `docs/tutorials/agenda.md`, `packages/third-parties/agenda/readme.md`, `docs/index.md`, `docs/.vitepress/config.mts`.
- No runtime behavior change: only TSDoc comments and package metadata change in `@tsed/pulse`.
