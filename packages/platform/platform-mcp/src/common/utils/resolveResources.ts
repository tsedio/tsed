import {inject, injector} from "@tsed/di";
import type {ResourceTemplate} from "@modelcontextprotocol/server";
import {MCP_PROVIDER_TYPES} from "../constants/constants.js";
import type {ResourceSettings} from "../fn/defineResource.js";
import type {PlatformMcpSettings} from "../interfaces/PlatformMcpSettings.js";
import {isClass} from "@tsed/core";

export type ResolveResource = ResourceSettings & {uri?: string; template?: ResourceTemplate; name: string};

export function resolveResources(settings: PlatformMcpSettings): ResolveResource[] {
  const classTokens = settings.resources?.filter((resource) => isClass(resource)) || [];
  const handlerResources = (settings.resources?.filter((resource) => !isClass(resource)) || []).map((token) => {
    const definition = inject<ResolveResource>(token);

    return {...definition, name: definition.name || String(token)};
  });

  const classResources = injector()
    .providers.getMany(MCP_PROVIDER_TYPES.RESOURCE)
    .map((provider): ResolveResource | false => {
      const definition = inject<ResolveResource>(provider.token);

      if ("token" in definition && "propertyKey" in definition) {
        if (!classTokens.includes(definition.token)) {
          return false;
        }

        return definition;
      }

      return false;
    })
    .filter(Boolean) as ResolveResource[];

  return [...handlerResources, ...classResources];
}
