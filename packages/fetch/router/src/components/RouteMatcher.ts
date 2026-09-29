import type {FetchMethod} from "../interfaces/FetchEndpointOptions.js";
import {decodePathSegment} from "../utils/decodePathSegment.js";
import {expandOptionalSegments} from "../utils/expandOptionalSegments.js";
import {type ParsedSegment, parseSegment} from "../utils/parseSegment.js";
import {skipSlashes} from "../utils/skipSlashes.js";
import {splitPattern} from "../utils/splitPattern.js";
import {toParams} from "../utils/toParams.js";
import {trimTrailingSlashes} from "../utils/trimTrailingSlashes.js";

export interface RouteMatch<T> {
  value: T;
  /** The declared pattern that matched, e.g. `/users/:id`. */
  route: string;
  params: Record<string, string>;
}

interface Handler<T> {
  route: string;
  value: T;
  names: string[];
  /** Declaration index: the lowest matching index wins. */
  order: number;
}

class Node<T> {
  statics?: Map<string, Node<T>>;
  param?: Node<T>;
  wildcard?: Map<string, Handler<T>>;
  handlers?: Map<string, Handler<T>>;
  /** Lowest declaration index found in this subtree, used to prune the search. */
  min = Infinity;
}

interface MatchState<T> {
  order: number;
  handler?: Handler<T>;
  params?: Record<string, string>;
}

/**
 * Segment trie route matcher independent from any HTTP framework.
 *
 * Like Express, the first declared matching route wins, whatever its kind
 * (static, `:param` or wildcard). The trie is walked with backtracking and each
 * subtree carries the lowest declaration index it contains, so branches that
 * cannot beat the current best match are skipped. Lookup cost depends on the
 * path length, not on the number of registered routes. Trailing slashes are ignored.
 */
export class RouteMatcher<T> {
  #root = new Node<T>();
  #order = 0;

  /**
   * Registers a route. Supported patterns: `/static`, `/:param`, `/:param?`, `/{:param}`,
   * and a trailing `/*`, `/(.*)` or `/:param*`.
   * Registering the same method and pattern twice keeps the first registration.
   */
  add(method: FetchMethod | string, pattern: string, value: T): this {
    const segments = splitPattern(pattern).map(parseSegment);

    segments.forEach((segment, i) => {
      if (segment.type === "wildcard" && i !== segments.length - 1) {
        throw new Error(`Wildcard must be the last segment: ${pattern}`);
      }
    });

    const order = this.#order++;

    // Variants of one declaration share its index; the fraction keeps the "parameter present" variants ahead.
    expandOptionalSegments(segments).forEach((variant, i, variants) => {
      this.#insert(method, pattern, variant, value, order + i / variants.length);
    });

    return this;
  }

  /**
   * Returns the match for the method and pathname, or `undefined` when no route matches.
   * `HEAD` falls back to `GET` when no explicit `HEAD` route exists.
   */
  match(method: FetchMethod | string, pathname: string): RouteMatch<T> | undefined {
    const state: MatchState<T> = {order: Infinity, handler: undefined, params: undefined};

    this.#walk(this.#root, pathname, skipSlashes(pathname, 0), trimTrailingSlashes(pathname), method, [], state);

    if (state.handler) {
      return {value: state.handler.value, route: state.handler.route, params: state.params!};
    }

    return method === "HEAD" ? this.match("GET", pathname) : undefined;
  }

  /**
   * Methods declared for a pathname. Lets the caller distinguish "no route"
   * (empty) from "route exists but not for this method" (405).
   */
  allowedMethods(pathname: string): string[] {
    const methods = new Set<string>();
    this.#collect(this.#root, pathname, skipSlashes(pathname, 0), methods);
    return [...methods];
  }

  #insert(method: string, route: string, segments: ParsedSegment[], value: T, order: number) {
    let node = this.#root;
    const names: string[] = [];

    node.min = Math.min(node.min, order);

    for (const segment of segments) {
      if (segment.type === "wildcard") {
        names.push(segment.name);
        const wildcard = (node.wildcard ??= new Map());
        if (!wildcard.has(method)) wildcard.set(method, {route, value, names, order});
        return;
      }

      if (segment.type === "param") {
        names.push(segment.name);
        node = node.param ??= new Node<T>();
      } else {
        const statics = (node.statics ??= new Map());
        let next = statics.get(segment.value);
        if (!next) statics.set(segment.value, (next = new Node<T>()));
        node = next;
      }

      node.min = Math.min(node.min, order);
    }

    const handlers = (node.handlers ??= new Map());

    if (!handlers.has(method)) {
      handlers.set(method, {route, value, names, order});
    }
  }

  #walk(node: Node<T>, path: string, start: number, end: number, method: string, values: string[], state: MatchState<T>): void {
    if (start >= end) {
      const handler = node.handlers?.get(method);

      if (handler && handler.order < state.order) {
        state.order = handler.order;
        state.handler = handler;
        state.params = toParams(handler.names, values);
      }

      return;
    }

    let stop = path.indexOf("/", start);

    if (stop === -1 || stop > end) {
      stop = end;
    }

    const segment = path.slice(start, stop);
    const next = skipSlashes(path, stop);

    const child = node.statics?.get(segment);
    const param = node.param;

    if (param && (!child || param.min < child.min)) {
      if (param.min < state.order) {
        this.#walkParam(param, path, segment, next, end, method, values, state);
      }

      if (child && child.min < state.order) {
        this.#walk(child, path, next, end, method, values, state);
      }
    } else {
      if (child && child.min < state.order) {
        this.#walk(child, path, next, end, method, values, state);
      }

      if (param && param.min < state.order) {
        this.#walkParam(param, path, segment, next, end, method, values, state);
      }
    }

    const wildcard = node.wildcard?.get(method);

    if (wildcard && wildcard.order < state.order) {
      values.push(decodePathSegment(path.slice(start, end)));
      state.order = wildcard.order;
      state.handler = wildcard;
      state.params = toParams(wildcard.names, values);
      values.pop();
    }
  }

  #walkParam(
    node: Node<T>,
    path: string,
    segment: string,
    next: number,
    end: number,
    method: string,
    values: string[],
    state: MatchState<T>
  ) {
    values.push(decodePathSegment(segment));
    this.#walk(node, path, next, end, method, values, state);
    values.pop();
  }

  #collect(node: Node<T>, path: string, start: number, out: Set<string>) {
    const end = trimTrailingSlashes(path);

    if (start >= end) {
      node.handlers?.forEach((_, method) => out.add(method));
      return;
    }

    let stop = path.indexOf("/", start);

    if (stop === -1 || stop > end) {
      stop = end;
    }

    const segment = path.slice(start, stop);
    const next = skipSlashes(path, stop);

    const child = node.statics?.get(segment);

    if (child) {
      this.#collect(child, path, next, out);
    }

    if (node.param) {
      this.#collect(node.param, path, next, out);
    }

    node.wildcard?.forEach((_, method) => out.add(method));
  }
}
