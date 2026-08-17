import {join} from "node:path";

import {mapApiReferences} from "@tsed/vitepress-theme/composables/api/mappers/mapApiReferences.js";
import fsExtra from "fs-extra";

import api from "../../public/api.json" with {type: "json"};

const {writeFile} = fsExtra;
const IS_CORES = /core|@tsed\/di|hooks|schema$|\/exceptions$|engines|json-mapper|open-spec/;
const IS_PLATFORM = /platform/;
const IS_ORM = /adapters|ioredis|mikro-orm|mongoose|objection|prisma/;

const groups = [
  ["Core", IS_CORES],
  ["Platform", IS_PLATFORM],
  ["ORM", IS_ORM]
];

const sections = groups.map(([text]) => ({text, items: []}));
const thirdParties = {text: "Third parties", items: []};

for (const [module, {symbols}] of Object.entries(mapApiReferences(api).modules)) {
  const item = {
    text: module,
    collapsed: true,
    items: symbols.map((symbol) => ({text: symbol.symbolName, link: symbol.path}))
  };
  const sectionIndex = groups.findIndex(([, pattern]) => pattern.test(module));
  (sectionIndex === -1 ? thirdParties : sections[sectionIndex]).items.push(item);
}

for (const section of [...sections, thirdParties]) {
  section.items.sort((a, b) => a.text.localeCompare(b.text));
}

await writeFile(join(import.meta.dirname, "..", "..", "public", "reference-sidebar.json"), JSON.stringify([...sections, thirdParties], null, 2));
