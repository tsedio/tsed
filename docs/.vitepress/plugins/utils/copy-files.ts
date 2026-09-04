import {dirname, join} from "node:path";

import {log, progress} from "@clack/prompts";
import fsExtra from "fs-extra";
import {globby} from "globby";

import {transformMarkdown} from "./markdown.js";

const {copy, ensureDir, pathExists, readFile, remove, writeFile} = fsExtra;

export interface CopyFilesOptions {
  cwd: string;
  dest: string;
  label: string;
  src: string;
}

interface CopyFileOptions {
  cwd: string;
  destinationRoot: string;
  progressLogger: Pick<ReturnType<typeof progress>, "advance" | "stop">;
  relativePath: string;
  sourceRoot: string;
}

export async function copyFiles({cwd, src, dest, label}: CopyFilesOptions) {
  const sourceDir = join(cwd, src);
  const destinationDir = join(cwd, dest);

  if (!(await pathExists(sourceDir))) {
    log.warn(`[build-llm-contents] Skip ${label.toLowerCase()}: missing ${sourceDir}`);
    return false;
  }

  await remove(destinationDir).catch(() => undefined);
  await ensureDir(destinationDir);

  const files = await globby(["**/*"], {cwd: sourceDir, dot: true, onlyFiles: true});

  if (files.length === 0) {
    log.warn(`[build-llm-contents] No files found to sync for ${label.toLowerCase()}`);
    return false;
  }

  const copyProgress = progress({style: "heavy", max: files.length, size: 40});

  copyProgress.start(`Syncing ${label}`);

  try {
    for (const relativePath of files) {
      await copyFile({
        cwd,
        sourceRoot: sourceDir,
        destinationRoot: destinationDir,
        relativePath,
        progressLogger: copyProgress
      });
    }
  } catch (error) {
    copyProgress.stop(`${label} failed`);
    throw error;
  }

  copyProgress.stop(`${label} updated`);
  return true;
}

async function copyFile({cwd, sourceRoot, destinationRoot, relativePath, progressLogger}: CopyFileOptions) {
  const sourcePath = join(sourceRoot, relativePath);
  const destinationPath = join(destinationRoot, relativePath);

  await ensureDir(dirname(destinationPath));

  if (relativePath.endsWith(".md")) {
    const fileContent = await readFile(sourcePath, "utf8");
    const cleaned = await transformMarkdown(fileContent, {docsRoot: cwd});
    await writeFile(destinationPath, cleaned);
    progressLogger.advance(1, `Formatted ${relativePath}`);
    return;
  }

  await copy(sourcePath, destinationPath);
  progressLogger.advance(1, `Copied ${relativePath}`);
}
