import {join} from "node:path";

import {mapApiReferences} from "@tsed/vitepress-theme/composables/api/mappers/mapApiReferences.js";
import type {ApiResponse, ApiSymbol} from "@tsed/vitepress-theme/composables/api/interfaces/Api.js";
import fsExtra from "fs-extra";

import api from "../../../public/api.json" with {type: "json"};

const {writeFile} = fsExtra;
const apiReferences = mapApiReferences(api) as ApiResponse;

export interface ApiSidebarOptions {
  groups?: ApiSidebarGroup[];
  thirdPartyGroup?: string;
}

export interface ApiSidebarGroup {
  pattern: RegExp;
  text: string;
}

interface SidebarItem {
  collapsed?: boolean;
  items?: SidebarItem[];
  link?: string;
  text: string;
}

export async function buildReferenceSidebar(docsRoot: string, options?: ApiSidebarOptions) {
  const sidebarPath = join(docsRoot, "public/reference-sidebar.json");
  await writeFile(sidebarPath, JSON.stringify(getSidebar(options), null, 2));
}

export function getSidebar({groups = [], thirdPartyGroup = "Third parties"}: ApiSidebarOptions = {}) {
  const sections = groups.map(({text}) => ({text, items: [] as SidebarItem[]}));
  const thirdParties = {text: thirdPartyGroup, items: [] as SidebarItem[]};

  Object.entries(apiReferences.modules).forEach(([module, {symbols}]) => {
    const item: SidebarItem = {
      text: module,
      collapsed: true,
      items: symbols.map((symbol: ApiSymbol) => {
        return {
          text: symbol.symbolName,
          link: symbol.path ?? ""
        };
      })
    };

    const sectionIndex = groups.findIndex(({pattern}) => pattern.test(module));
    (sectionIndex === -1 ? thirdParties : sections[sectionIndex]).items.push(item);
  });

  return [...sections, thirdParties].map((section) => ({
    ...section,
    items: section.items.sort((a, b) => a.text.localeCompare(b.text))
  }));
}

export function getApiReferenceLinks() {
  return Object.entries(apiReferences.modules)
    .sort(([moduleA], [moduleB]) => moduleA.localeCompare(moduleB))
    .map(([module, {symbols}]) => {
      const links = symbols
        .filter((symbol: ApiSymbol) => symbol.path)
        .sort((symbolA: ApiSymbol, symbolB: ApiSymbol) => symbolA.symbolName.localeCompare(symbolB.symbolName))
        .map((symbol: ApiSymbol) => `- [${symbol.symbolName}](${symbol.path}.md)`)
        .join("\n");

      return `## ${module}\n\n${links}`;
    })
    .join("\n\n");
}
