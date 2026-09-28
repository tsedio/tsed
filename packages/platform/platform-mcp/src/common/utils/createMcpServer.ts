import {constant} from "@tsed/di";
import {McpServer, type ResourceTemplate} from "@modelcontextprotocol/server";
import type {PlatformMcpSettings} from "../interfaces/PlatformMcpSettings.js";
import {resolvePrompts, type ResolvedPrompt} from "./resolvePrompts.js";
import {resolveResources, type ResolveResource} from "./resolveResources.js";
import {resolveTools, type ResolvedTool} from "./resolveTools.js";

export type CreateMcpServerOpts = PlatformMcpSettings & {
  tools: ResolvedTool[];
  prompts: ResolvedPrompt[];
  resources: ResolveResource[];
};

export function resolveMcpServerOptions(settings: PlatformMcpSettings): CreateMcpServerOpts {
  return {
    ...settings,
    tools: resolveTools(settings),
    prompts: resolvePrompts(settings),
    resources: resolveResources(settings)
  };
}

export function createMcpServer(settings: CreateMcpServerOpts) {
  const name = settings.name || constant<string>("name") || "tsed-mcp";
  const version = settings.version || constant<string>("version") || "0.0.0";
  const {websiteUrl, description, title, icons} = settings;

  const server = new McpServer(
    {
      websiteUrl,
      description,
      icons,
      title,
      name,
      version
    },
    settings?.serverOptions
  );

  settings.tools.forEach(({name, handler, ...opts}) => {
    server.registerTool(name!, opts as any, handler as any);
  });

  settings.resources.forEach(({name, handler, uri, template, ...opts}) => {
    if (uri) {
      server.registerResource(name, uri, opts, handler as any);
    } else {
      server.registerResource(name, template as ResourceTemplate, opts, handler as any);
    }
  });

  settings.prompts.forEach(({name, handler, ...opts}) => {
    server.registerPrompt(name, opts as any, handler as any);
  });

  return server;
}
