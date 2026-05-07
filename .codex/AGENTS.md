# Codex Adapter Notes

Shared OpenSpec skill logic is owned by `.agents/skills`.

The `.codex/skills` path is an adapter that exposes those shared skills to Codex. Do not edit shared skill implementations through this path. Keep Codex-specific prompt wrappers under `.codex/prompts`.