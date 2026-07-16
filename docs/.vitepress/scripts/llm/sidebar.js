import {join} from "node:path";

import {mapApiReferences} from "@tsed/vitepress-theme/composables/api/mappers/mapApiReferences.js";
import fsExtra from "fs-extra";

import api from "../../../public/api.json" with {type: "json"};

const {writeFile} = fsExtra;

const IS_CORES = /core|@tsed\/di|hooks|schema$|\/exceptions$|engines|json-mapper|open-spec/;
const IS_PLATFORM = /platform/;
const IS_ORM = /adapters|ioredis|mikro-orm|mongoose|objection|prisma/;

export async function buildReferenceSidebar(docsRoot) {
  const sidebarPath = join(docsRoot, "public/reference-sidebar.json");
  await writeFile(sidebarPath, JSON.stringify(getSidebar(), null, 2));
}

export function getSidebar() {
  const coreModules = [];
  const platformModules = [];
  const ormModules = [];
  const thirdParties = [];

  Object.entries(mapApiReferences(api).modules).forEach(([module, {symbols}]) => {
    const item = {
      text: module,
      collapsed: true,
      items: symbols.map((symbol) => {
        return {
          text: symbol.symbolName,
          link: symbol.path
        };
      })
    };

    if (IS_CORES.test(module)) {
      coreModules.push(item);
    } else if (IS_PLATFORM.test(module)) {
      platformModules.push(item);
    } else if (IS_ORM.test(module)) {
      ormModules.push(item);
    } else {
      thirdParties.push(item);
    }
  });

  return [
    {
      text: "Core",
      items: coreModules.sort((a, b) => a.text.localeCompare(b.text))
    },
    {
      text: "Platform",
      items: platformModules.sort((a, b) => a.text.localeCompare(b.text))
    },
    {
      text: "ORM",
      items: ormModules.sort((a, b) => a.text.localeCompare(b.text))
    },
    {
      text: "Third parties",
      items: thirdParties.sort((a, b) => a.text.localeCompare(b.text))
    }
  ];
}
