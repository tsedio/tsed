import {inject, injector} from "@tsed/di";
import {MCP_PROVIDER_TYPES} from "../constants/constants.js";
import type {ToolProps} from "../fn/defineTool.js";
import type {PlatformMcpSettings} from "../interfaces/PlatformMcpSettings.js";
import {isClass} from "@tsed/core";

export type ResolvedTool = ToolProps<any, any> & {name: string; handler: any};

export function resolveTools(settings: PlatformMcpSettings): ResolvedTool[] {
  const classTokens = settings.tools?.filter((tool) => isClass(tool)) || [];
  const handlerTools = (settings.tools?.filter((tool) => !isClass(tool)) || []).map((token) => {
    return inject<ResolvedTool>(token);
  });

  const classTools = injector()
    .providers.getMany(MCP_PROVIDER_TYPES.TOOL)
    .map((provider) => {
      const definition = inject<ResolvedTool>(provider.token);

      if ("token" in definition && "propertyKey" in definition) {
        if (!classTokens.includes(definition.token)) {
          return false;
        }

        return definition;
      }

      return false;
    })
    .filter(Boolean) as ResolvedTool[];

  return [...handlerTools, ...classTools];
}
