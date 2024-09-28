import {readFile} from "node:fs/promises";
import {dirname, extname, isAbsolute, join} from "node:path";

import fs from "fs";

const readCache: Map<string, string> = new Map();
const cacheStore: Map<string, any> = new Map();

export const requires: Map<string, any> = new Map();

export function getCachedEngine(name: string, toName: string = name) {
  const mdl = requires.get(toName) || {};

  return mdl.default || mdl;
}

export async function importEngine(name: string, toName: string = name) {
  if (!requires.has(toName)) {
    await setEngine(name, toName);
  }

  return getCachedEngine(toName);
}

export async function setEngine(name: string, toName: string = name) {
  const mdl = await import(name);

  requires.set(toName, mdl);
}

export function setToCache(key: string, value: any) {
  readCache.set(key, value);
}

export function getFromCache(key: string) {
  return readCache.get(key);
}

/**
 * Clear the cache.
 *
 * @api public
 */

export const clearCache = () => {
  readCache.clear();
  cacheStore.clear();
};

/**
 * Conditionally cache `compiled` template based
 * on the `options` filename and `.cache` boolean.
 *
 * @param {Object} options
 * @param {Function} compiled
 * @return {Function}
 */
export function cache(options: any, compiled?: any) {
  // cachable
  if (compiled && options.filename && options.cache) {
    readCache.delete(options.filename);
    cacheStore.set(options.filename, compiled);
    return compiled;
  }

  // check cache
  if (options.filename && options.cache) {
    return cacheStore.get(options.filename);
  }

  return compiled;
}

/**
 * Read `path` with `options` with
 * callback `(err, str)`. When `options.cache`
 * is true the template string will be cached.
 *
 * @param path
 * @param {String} options
 */
export async function read(path: string, options: any): Promise<string> {
  let str = readCache.get(path);

  // cached (only if cached is a string and not a compiled template function)
  if (options.cache && str && typeof str === "string") {
    return str;
  }

  // read
  str = await readFile(path, "utf8");

  // remove extraneous utf8 BOM marker
  str = str.replace(/^\uFEFF/, "");

  if (options.cache) {
    readCache.set(path, str);
  }

  return str;
}

/**
 * Read `path` with `options` with
 * callback `(err, str)`. When `options.cache`
 * is true the partial string will be cached.
 *
 * @param path
 * @param {String} options
 * @api private
 */
export function readPartials(path: string, options: any): Promise<Record<string, string> | void> {
  if (!options.partials) {
    return Promise.resolve();
  }

  const keys = Object.keys(options.partials);
  const partials: Record<string, string> = {};

  return new Promise((resolve, reject) => {
    async function next(index: number): Promise<any> {
      if (index === keys.length) {
        return resolve(partials);
      }

      const key = keys[index];
      const partialPath = options.partials[key];

      if (partialPath === undefined || partialPath === null || partialPath === false) {
        return next(++index);
      }

      let file;
      if (isAbsolute(partialPath)) {
        if (extname(partialPath) !== "") {
          file = partialPath;
        } else {
          file = join(partialPath + extname(path));
        }
      } else {
        file = join(dirname(path), partialPath + extname(path));
      }

      try {
        partials[key] = await read(file, options);
        next(++index);
      } catch (err) {
        reject(err);
      }
    }

    next(0);
  });
}
