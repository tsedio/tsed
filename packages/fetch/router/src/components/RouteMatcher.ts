import type {FetchMethod} from "../interfaces/FetchEndpointOptions.js";
import {collapseSlashes} from "../utils/collapseSlashes.js";
import {createParams} from "../utils/createParams.js";
import {decodePathSegment} from "../utils/decodePathSegment.js";
import {expandOptionalSegments} from "../utils/expandOptionalSegments.js";
import {parseSegment} from "../utils/parseSegment.js";
import {segmentsToTokens} from "../utils/segmentsToTokens.js";
import {splitPattern} from "../utils/splitPattern.js";
import {trimTrailingSlashes} from "../utils/trimTrailingSlashes.js";
import {ROUTE_NODE_KIND, type RouteHandler, RouteNode} from "./RouteNode.js";

export interface RouteMatch<T> {
  value: T;
  /** The declared pattern that matched, e.g. `/users/:id`. */
  route: string;
  params: Record<string, string>;
}

const SLASH = 47;

/**
 * Radix tree route matcher independent from any HTTP framework.
 *
 * There is one tree per method. Like Express, the first declared matching route
 * wins whatever its kind (static, `:param` or wildcard): the tree is walked with
 * backtracking, and each subtree carries the lowest declaration index it holds so
 * branches that cannot beat the current best match are skipped. Lookup cost depends
 * on the path length, not on the number of registered routes. Trailing and
 * duplicated slashes are ignored.
 *
 * The lookup loop follows find-my-way: compressed static prefixes, a flat
 * backtracking stack that is only allocated when a branch is skipped, and the first
 * four captured values kept in locals.
 */
export class RouteMatcher<T> {
  #get: RouteNode<T> | null = null;
  #trees = new Map<string, RouteNode<T>>();
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

    const tree = this.#tree(method);
    const order = this.#order++;

    // Variants of one declaration share its index; the fraction keeps the "parameter present" variants ahead.
    expandOptionalSegments(segments).forEach((variant, i, variants) => {
      this.#insert(tree, segmentsToTokens(variant), pattern, value, order + i / variants.length);
    });

    return this;
  }

  /**
   * Returns the match for the method and pathname, or `undefined` when no route matches.
   * `HEAD` falls back to `GET` when no explicit `HEAD` route exists.
   */
  match(method: FetchMethod | string, pathname: string): RouteMatch<T> | undefined {
    const tree = method === "GET" ? this.#get : this.#trees.get(method);
    const found = tree ? this.#find(tree, pathname) : undefined;

    if (found || method !== "HEAD") {
      return found;
    }

    return this.#get ? this.#find(this.#get, pathname) : undefined;
  }

  /**
   * Methods declared for a pathname. Lets the caller distinguish "no route"
   * (empty) from "route exists but not for this method" (405).
   */
  allowedMethods(pathname: string): string[] {
    const methods: string[] = [];

    this.#trees.forEach((tree, method) => {
      if (this.#find(tree, pathname)) methods.push(method);
    });

    return methods;
  }

  #tree(method: string): RouteNode<T> {
    let tree = this.#trees.get(method);

    if (!tree) {
      // Every pattern starts with "/": the root consumes it.
      tree = new RouteNode<T>(ROUTE_NODE_KIND.STATIC, "/");
      this.#trees.set(method, tree);

      if (method === "GET") this.#get = tree;
    }

    return tree;
  }

  #insert(root: RouteNode<T>, tokens: ReturnType<typeof segmentsToTokens>, route: string, value: T, order: number) {
    const names: string[] = [];
    let node = root;

    node.min = Math.min(node.min, order);

    for (const token of tokens) {
      if (typeof token === "string") {
        node = node.createStatic(token, order);
        continue;
      }

      names.push(token.name);

      if (token.type === "param") {
        node = node.param ??= new RouteNode<T>(ROUTE_NODE_KIND.PARAM);
      } else {
        node = node.wildcard ??= new RouteNode<T>(ROUTE_NODE_KIND.WILDCARD);
      }

      node.min = Math.min(node.min, order);
    }

    node.handler ??= {route, value, names, order};
  }

  #find(root: RouteNode<T>, pathname: string): RouteMatch<T> | undefined {
    if (pathname.charCodeAt(0) !== SLASH) {
      return undefined;
    }

    const path = collapseSlashes(pathname);
    const end = Math.max(1, trimTrailingSlashes(path));

    let bestOrder = Infinity;
    let best: RouteHandler<T> | null = null;
    let bestParams: Record<string, string> | null = null;

    // Backtracking stack of candidates still to try, as flat triples (node, index, count).
    let stack: unknown[] | null = null;

    // Captured values by position: the first four in locals, the others in `extra`.
    let p0: string | undefined;
    let p1: string | undefined;
    let p2: string | undefined;
    let p3: string | undefined;
    let extra: string[] | null = null;

    let node: RouteNode<T> | null = root;
    let cur: RouteNode<T> | null = null;
    let i = 1;
    let count = 0;

    for (;;) {
      if (node !== null) {
        if (i === end) {
          const handler = node.handler;

          if (handler !== null && handler.order < bestOrder) {
            bestOrder = handler.order;
            best = handler;
            bestParams = createParams(handler.names, p0, p1, p2, p3, extra);
          }
        } else if (i < end) {
          // Candidates: static child, param, wildcard, tried in ascending declaration order.
          let n1: RouteNode<T> | null = node.findStatic(path, i);
          let n2: RouteNode<T> | null = path.charCodeAt(i) === SLASH ? null : node.param;
          let n3: RouteNode<T> | null = node.wildcard;

          let m1: number = n1 !== null && n1.min < bestOrder ? n1.min : Infinity;
          let m2: number = n2 !== null && n2.min < bestOrder ? n2.min : Infinity;
          let m3: number = n3 !== null && n3.min < bestOrder ? n3.min : Infinity;

          if (m2 < m1) {
            const n = n1;
            n1 = n2;
            n2 = n;
            const m = m1;
            m1 = m2;
            m2 = m;
          }
          if (m3 < m2) {
            const n = n2;
            n2 = n3;
            n3 = n;
            const m = m2;
            m2 = m3;
            m3 = m;

            if (m2 < m1) {
              const n = n1;
              n1 = n2;
              n2 = n;
              const m = m1;
              m1 = m2;
              m2 = m;
            }
          }

          if (m1 !== Infinity) {
            cur = n1;

            if (m3 !== Infinity) {
              (stack ??= []).push(n3, i, count);
            }
            if (m2 !== Infinity) {
              (stack ??= []).push(n2, i, count);
            }
          }
        }
      }

      if (cur === null) {
        // Nothing left to try in this branch: resume the next viable candidate.
        for (;;) {
          if (stack === null || stack.length === 0) {
            return best === null ? undefined : {value: best.value, route: best.route, params: bestParams!};
          }

          count = stack.pop() as number;
          i = stack.pop() as number;
          cur = stack.pop() as RouteNode<T>;

          if (cur.min < bestOrder) {
            break;
          }
          cur = null;
        }
      }

      // Enter the candidate.
      if (cur.kind === ROUTE_NODE_KIND.STATIC) {
        i += cur.prefix.length;
        node = cur;
      } else {
        const wildcard = cur.kind === ROUTE_NODE_KIND.WILDCARD;
        let stop = end;

        if (!wildcard) {
          stop = path.indexOf("/", i);
          if (stop === -1 || stop > end) stop = end;
        }

        const value = decodePathSegment(path.slice(i, stop));

        if (count === 0) p0 = value;
        else if (count === 1) p1 = value;
        else if (count === 2) p2 = value;
        else if (count === 3) p3 = value;
        else (extra ??= [])[count - 4] = value;

        if (wildcard) {
          const handler = cur.handler!;

          if (handler.order < bestOrder) {
            bestOrder = handler.order;
            best = handler;
            bestParams = createParams(handler.names, p0, p1, p2, p3, extra);
          }
          node = null;
        } else {
          count++;
          i = stop;
          node = cur;
        }
      }

      cur = null;
    }
  }
}
