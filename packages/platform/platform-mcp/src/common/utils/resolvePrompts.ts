import {inject, injector, type TokenProvider} from "@tsed/di";
import {MCP_PROVIDER_TYPES} from "../constants/constants.js";
import type {PromptsSettings} from "../fn/definePrompt.js";
import type {PlatformMcpSettings} from "../interfaces/PlatformMcpSettings.js";

export type ResolvedPrompt = PromptsSettings & {name: string};

export function resolvePrompts(settings: PlatformMcpSettings): ResolvedPrompt[] {
  const tokens = new Set<TokenProvider>(settings.prompts);

  injector()
    .providers.getMany(MCP_PROVIDER_TYPES.PROMPT)
    .forEach((provider) => tokens.add(provider.token));

  return [...tokens].map((token) => {
    const definition = inject<ResolvedPrompt>(token);

    return {...definition, name: definition.name || String(token)};
  });
}
