## Why

TypeScript 6 enforces stricter compilation defaults that are likely to break the current monorepo build. We need a controlled migration to keep the codebase buildable, type-safe, and releasable on the next TypeScript major.

## What Changes

- Upgrade workspace tooling and package configurations to TypeScript 6 compatibility.
- Resolve strict-mode type errors across packages by updating typings, inference boundaries, and unsafe patterns.
- Align shared tsconfig/project references with TypeScript 6 compiler behavior.
- Update CI/build/test flows so TypeScript 6 becomes the supported default for local and pipeline compilation.
- **BREAKING**: Internal and public type signatures may tighten where previously implicit or loosely typed behavior was accepted.

## Capabilities

### New Capabilities

- `typescript-6-compatibility`: Ensures the monorepo compiles and tests successfully with TypeScript 6 strict compilation expectations.

### Modified Capabilities

<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- Affected code: root TypeScript configs and package-level source/test typing across core, platform, specs, orm, graphql, security, third-parties, and utils packages.
- APIs: potential type-level breaking changes for maintainers and consumers relying on previously permissive typings.
- Dependencies/tooling: TypeScript compiler version, tsconfig conventions, and CI checks tied to type-check/build commands.
- Systems: local developer workflow, CI compile gates, and release validation based on successful strict type compilation.
