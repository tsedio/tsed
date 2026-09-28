import {inject, injector, type TokenProvider} from "@tsed/di";
import type {ResourceTemplate} from "@modelcontextprotocol/server";
import {MCP_PROVIDER_TYPES} from "../constants/constants.js";
import type {ResourceSettings} from "../fn/defineResource.js";
import type {PlatformMcpSettings} from "../interfaces/PlatformMcpSettings.js";

export type ResolveResource = ResourceSettings & {uri?: string; template?: ResourceTemplate; name: string};

export function resolveResources(settings: PlatformMcpSettings): ResolveResource[] {
  const tokens = new Set<TokenProvider>(settings.resources);

  injector()
    .providers.getMany(MCP_PROVIDER_TYPES.RESOURCE)
    .forEach((provider) => tokens.add(provider.token));

  return [...tokens].map((token) => {
    const definition = inject<ResolveResource>(token);

    return {...definition, name: definition.name || String(token)};
  });
}
