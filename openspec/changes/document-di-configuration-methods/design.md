## Context

`DIConfiguration` already has class-level documentation, but its individual methods are largely undocumented. The requested change is documentation-only and must retain all existing runtime semantics.

## Goals / Non-Goals

**Goals:**

- Describe each constructor, public, and protected method in clear English TSDoc.
- Document parameter, default-value, and return behavior when it is part of the method contract.
- Validate the resulting documentation with the repository API documentation build.

**Non-Goals:**

- Change configuration behavior, types, or API surface.
- Add tests for unchanged runtime behavior.

## Decisions

- Add concise TSDoc immediately above every method to keep documentation adjacent to the code it describes.
- Use existing service documentation phrasing and TSDoc tags for consistency.
- Document protected implementation methods as requested, even though the tracker normally focuses on exported symbols.

## Risks / Trade-offs

- [Documentation becoming inconsistent with implementation] → Base each description on the current method body and signatures, and avoid speculative behavior.
- [TSDoc parser incompatibility] → Use supported tags and run `yarn api:build`.
