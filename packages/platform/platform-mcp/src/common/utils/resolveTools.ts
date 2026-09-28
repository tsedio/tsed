import {inject, injector, type TokenProvider} from "@tsed/di";
import {MCP_PROVIDER_TYPES} from "../constants/constants.js";
import type {ToolProps} from "../fn/defineTool.js";
import type {PlatformMcpSettings} from "../interfaces/PlatformMcpSettings.js";

export type ResolvedTool = ToolProps<any, any> & {name: string; handler: any};

export function resolveTools(settings: PlatformMcpSettings): ResolvedTool[] {
  const tokens = new Set<TokenProvider>(settings.tools);

  injector()
    .providers.getMany(MCP_PROVIDER_TYPES.TOOL)
    .forEach((provider) => tokens.add(provider.token));

  return [...tokens].map((token) => inject<ResolvedTool>(token));
}
