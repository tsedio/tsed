# Claude Adapter Notes

Shared OpenSpec skill logic is owned by `.agents/skills`.

The `.claude/skills` path is an adapter that exposes those shared skills to Claude. Do not edit shared skill implementations through this path. Keep Claude-specific command wrappers under `.claude/commands/opsx`.