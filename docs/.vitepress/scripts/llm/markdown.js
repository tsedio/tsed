import {extname, join} from "node:path";

import fsExtra from "fs-extra";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import unified from "unified";

const {readFile} = fsExtra;
const markdownProcessor = unified().use(remarkParse).use(remarkStringify, {fences: true, bullet: "-"}).use(remarkCleanApiMarkdown);
const INLINE_SNIPPET_RE = /^<<<\s+@\/([^\s]+?)(?:\s+\[(.+?)\])?\s*$/gm;
const SYMBOL_TOKEN_RE = /@@([A-Za-z0-9_.-]+)@@/g;
const symbolIndexCache = new Map();

export async function transformMarkdown(content, options = {}) {
  const {docsRoot} = options;
  let nextContent = content;

  if (docsRoot) {
    nextContent = await inlineExampleBlocks(nextContent, docsRoot);
    nextContent = await replaceSymbolLinks(nextContent, docsRoot);
  }

  const {frontmatter, body} = extractFrontmatter(nextContent);
  const processed = await markdownProcessor.process(body.trimStart());
  const cleanedBody = String(processed).trimStart();
  return frontmatter ? `${frontmatter}\n${cleanedBody}` : cleanedBody;
}

async function inlineExampleBlocks(content, docsRoot) {
  const matches = [];
  let match;

  while ((match = INLINE_SNIPPET_RE.exec(content)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      relativePath: match[1],
      label: match[2] ?? "",
      original: match[0]
    });
  }

  if (!matches.length) {
    return content;
  }

  let result = "";
  let lastIndex = 0;

  for (const entry of matches) {
    result += content.slice(lastIndex, entry.start);
    result += await loadSnippetBlock(entry, docsRoot);
    lastIndex = entry.end;
  }

  result += content.slice(lastIndex);
  return result;
}

async function replaceSymbolLinks(content, docsRoot) {
  const index = await loadSymbolIndex(docsRoot);
  return content.replace(SYMBOL_TOKEN_RE, (match, symbolName) => {
    const entry = index.get(symbolName);

    if (!entry) {
      console.warn(`[build-llm-contents] Unable to resolve symbol ${symbolName}`);
      return match;
    }

    return `[${symbolName}](/ai${entry.path}.md)`;
  });
}

async function loadSymbolIndex(docsRoot) {
  if (symbolIndexCache.has(docsRoot)) {
    return symbolIndexCache.get(docsRoot);
  }

  const apiPath = join(docsRoot, "public/api.json");
  const data = JSON.parse(await readFile(apiPath, "utf8"));
  const map = new Map();

  Object.values(data.modules ?? {}).forEach((module) => {
    module.symbols?.forEach((symbol) => {
      if (symbol.symbolName && symbol.path) {
        map.set(symbol.symbolName, symbol);
      }
    });
  });

  symbolIndexCache.set(docsRoot, map);
  return map;
}

async function loadSnippetBlock(entry, docsRoot) {
  const absolutePath = join(docsRoot, entry.relativePath);

  try {
    const code = await readFile(absolutePath, "utf8");
    const language = getLanguageFromExtension(extname(absolutePath));
    const labelSuffix = entry.label ? ` [${entry.label}]` : "";
    return `\`\`\`${language}${labelSuffix}\n${code.trimEnd()}\n\`\`\``;
  } catch (error) {
    console.warn(`[build-llm-contents] Unable to inline snippet ${absolutePath}: ${error.message}`);
    return entry.original;
  }
}

function getLanguageFromExtension(extension) {
  return extension ? extension.replace(/^\./, "") : "";
}

function remarkCleanApiMarkdown() {
  return (tree) => {
    let headingInfo;

    tree.children = tree.children.filter((node) => {
      if (node.type === "html") {
        const trimmed = node.value.trim();

        if (trimmed.startsWith("<script setup>")) {
          return false;
        }

        if (trimmed.startsWith('<div class="flex space-x-3"')) {
          headingInfo = headingInfo ?? extractHeading(trimmed);
          return false;
        }
      }

      return true;
    });

    if (headingInfo?.title) {
      const headingNode = {
        type: "heading",
        depth: 1,
        children: [
          {
            type: "text",
            value: headingInfo.module ? `${headingInfo.title} - ${headingInfo.module}` : headingInfo.title
          }
        ]
      };

      const insertIndex = tree.children.findIndex((node) => node.type !== "yaml");
      const targetIndex = insertIndex === -1 ? tree.children.length : insertIndex;
      tree.children.splice(targetIndex, 0, headingNode);
    }
  };
}

function extractFrontmatter(content) {
  if (!content.startsWith("---")) {
    return {frontmatter: "", body: content};
  }

  const match = content.match(/^(---[\s\S]*?\n---\s*\n?)/);

  if (!match) {
    return {frontmatter: "", body: content};
  }

  const frontmatter = match[1].trimEnd();
  const body = content.slice(match[1].length);

  return {frontmatter, body};
}

function extractHeading(value) {
  const titleMatch = value.match(/<h1>([\s\S]*?)<\/h1>/i);
  const moduleMatch = value.match(/<div class="module-name">([\s\S]*?)<\/div>/i);

  return {
    title: titleMatch?.[1]?.trim() ?? "",
    module: moduleMatch?.[1]?.trim() ?? ""
  };
}
