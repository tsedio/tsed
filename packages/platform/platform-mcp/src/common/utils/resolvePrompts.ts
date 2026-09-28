import {inject, injector} from "@tsed/di";
import {MCP_PROVIDER_TYPES} from "../constants/constants.js";
import type {PromptsSettings} from "../fn/definePrompt.js";
import type {PlatformMcpSettings} from "../interfaces/PlatformMcpSettings.js";
import {isClass} from "@tsed/core";

export type ResolvedPrompt = PromptsSettings & {name: string};

export function resolvePrompts(settings: PlatformMcpSettings): ResolvedPrompt[] {
  const classTokens = settings.prompts?.filter((prompt) => isClass(prompt)) || [];
  const handlerPrompts = (settings.prompts?.filter((prompt) => !isClass(prompt)) || []).map((token) => {
    const definition = inject<ResolvedPrompt>(token);

    return {...definition, name: definition.name || String(token)};
  });

  const classPrompts = injector()
    .providers.getMany(MCP_PROVIDER_TYPES.PROMPT)
    .map((provider): ResolvedPrompt | false => {
      const definition = inject<ResolvedPrompt>(provider.token);

      if ("token" in definition && "propertyKey" in definition) {
        if (!classTokens.includes(definition.token)) {
          return false;
        }

        return definition;
      }

      return false;
    })
    .filter(Boolean) as ResolvedPrompt[];

  return [...handlerPrompts, ...classPrompts];
}
