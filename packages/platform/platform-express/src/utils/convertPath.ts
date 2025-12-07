import {isString} from "@tsed/core";

type Framework = "v4" | "v5";

interface ConvertPathResult {
  path: string | RegExp;
  wildcard?: string;
}

/**
 * Converts a path to v4 format
 */
function convertPathToV4(path: string): ConvertPathResult {
  // Preserve unsupported/complex patterns
  // Keep paths with bracket choices or middle wildcards intact
  if (path.includes("[") || (path.includes("(.*)") && !path.endsWith("/(.*)") && path !== "/(.*)")) {
    return {path};
  }

  let wildcard: string | undefined;
  let result = path;

  // v5 optional segment syntax -> v4 optional param
  // e.g. "/test{/:foo}{/:param}" -> "/test/:foo?/:param?"
  result = result.replace(/\{\/:([A-Za-z0-9_]+)\}/g, "/:$1?");
  // e.g. "/test/:foo/{:param}" -> "/test/:foo/:param"
  result = result.replace(/\{:([A-Za-z0-9_]+)\}/g, ":$1");

  // Trailing v5 wildcard segment -> v4
  result = result.replace(/\/{\*([A-Za-z0-9_]+)\}$/g, (_m, name) => {
    wildcard = name;
    return "/*";
  });

  const segments = result.split("/");
  const last = segments[segments.length - 1];

  if (last === "*" || last === "(.*)") {
    wildcard = "*";
    if (last === "(.*)") {
      segments[segments.length - 1] = "*";
      result = segments.join("/");
    }
    return {path: result, wildcard};
  }

  // Trailing *name -> wildcard name for v4
  if (last && last.startsWith("*") && last.length > 1) {
    wildcard = last.substring(1);
    segments[segments.length - 1] = "*";
    result = segments.join("/");
    return {path: result, wildcard};
  }

  // Ts.ED syntax :param* -> v4 "*"
  if (last && last.startsWith(":") && last.endsWith("*")) {
    wildcard = last.substring(1, last.length - 1);
    segments[segments.length - 1] = "*";
    result = segments.join("/");
    return {path: result, wildcard};
  }

  return {path: result, wildcard};
}

/**
 * Converts a path to v5 format
 */
function convertPathToV5(path: string): ConvertPathResult {
  // Preserve unsupported/complex patterns
  if (path.includes("[") || (path.includes("(.*)") && !path.endsWith("/(.*)") && path !== "/(.*)")) {
    return {path};
  }

  // Already v5-style specific constructs should be preserved
  if (/\/{\*[^}]+\}/.test(path) || /\{:[^}]+\}/.test(path) || /\{\/:[^}]+\}/.test(path)) {
    const m = path.match(/\/{\*([^}]+)\}$/);
    return {path, wildcard: m ? m[1] : undefined};
  }

  const segments = path.split("/");
  const base: string[] = [];
  const optionals: string[] = [];
  let wildcard: string | undefined;

  segments.forEach((seg, idx) => {
    if (idx === 0) return; // first split is empty because path starts with '/'
    const isLast = idx === segments.length - 1;

    // Trailing raw wildcard
    if (isLast && (seg === "*" || seg === "(.*)")) {
      wildcard = "wildcard";
      optionals.push("/{*wildcard}");
      return;
    }

    // Trailing named wildcard forms
    if (isLast && seg.startsWith(":") && seg.endsWith("*")) {
      wildcard = seg.substring(1, seg.length - 1);
      optionals.push(`/{*${wildcard}}`);
      return;
    }

    if (isLast && seg.startsWith("*") && seg.length > 1) {
      wildcard = seg.substring(1);
      base.push(seg); // keep as-is according to spec for v5
      return;
    }

    // Optional parameter -> v5 optional segment
    if (seg.startsWith(":") && seg.endsWith("?")) {
      const name = seg.substring(1, seg.length - 1);
      optionals.push(`{/:${name}}`);
      return;
    }

    // Keep everything else (including non-optional params)
    base.push(seg);
  });

  let result = "/" + base.join("/");
  // Collapse double slash when base is empty
  if (result === "/") {
    result = "";
  }
  result += optionals.join("");

  // If named wildcard kept as segment like '/*splat', leave as-is (handled above)
  if (!result) {
    // Edge case when path was only optional param like "/:param?"
    // base is empty -> result becomes optionals only
    result = optionals.join("");
  }

  return {path: result || "/", wildcard};
}

/**
 * Converts a path between v4 and v5 formats
 */
export function convertPath(path: string | RegExp, framework: Framework): ConvertPathResult {
  if (isString(path)) {
    if (framework === "v4") {
      return convertPathToV4(path);
    } else {
      return convertPathToV5(path);
    }
  }
  return {path};
}
