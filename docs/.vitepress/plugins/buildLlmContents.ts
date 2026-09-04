import {join} from "node:path";

import {intro, log, outro, spinner} from "@clack/prompts";

import {copyFiles} from "./utils/copy-files.js";
import {buildReferenceSidebar, type ApiSidebarOptions} from "./utils/sidebar.js";

export interface LlmContentSection {
  destination: string;
  label: string;
  source: string;
}

export interface BuildLlmContentsOptions {
  docsRoot?: string;
  sections?: LlmContentSection[];
  sidebar?: ApiSidebarOptions;
}

const DEFAULT_DOCS_ROOT = join(import.meta.dirname, "..", "..");
/**
 * Each entry describes a docs directory to copy into /public/ai.
 * Markdown is normalized (remark), snippet directives are inlined,
 * and @@Symbol@@ tokens are rewritten to /ai/api links.
 */
const DEFAULT_DOC_SECTIONS: LlmContentSection[] = [];
let buildTask: Promise<void> | undefined;

export async function buildLlmContents({
  docsRoot = DEFAULT_DOCS_ROOT,
  sections = DEFAULT_DOC_SECTIONS,
  sidebar
}: BuildLlmContentsOptions = {}) {
  intro("Building LLM references");

  try {
    for (const section of sections) {
      const completed = await copyFiles({
        cwd: docsRoot,
        src: section.source,
        dest: section.destination,
        label: section.label
      });

      if (!completed) {
        log.warn(`${section.label} copy skipped`);
      }
    }

    const sidebarStep = spinner();
    sidebarStep.start("Generating API sidebar");
    await buildReferenceSidebar(docsRoot, sidebar);
    sidebarStep.stop("Sidebar generated");

    outro("LLM references ready");
  } catch (error) {
    log.error(error instanceof Error ? error.message : String(error));
    outro("LLM references build failed");
    throw error;
  }
}

// Orchestration only; implementation lives in ./llm/*

export function buildLlmContentsPlugin(options: BuildLlmContentsOptions = {}) {
  return {
    enforce: "pre" as const,
    name: "tsed-build-llm-contents",
    async configResolved() {
      buildTask ??= buildLlmContents(options);
      await buildTask;
    }
  };
}
