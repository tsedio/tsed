import {commonPrefixLength} from "../utils/commonPrefixLength.js";

export const ROUTE_NODE_KIND = {
  STATIC: 0,
  PARAM: 1,
  WILDCARD: 2
} as const;

export interface RouteHandler<T> {
  route: string;
  value: T;
  /** Names of the captured values, in capture order. */
  names: string[];
  /** Declaration index: the lowest matching index wins. */
  order: number;
}

/**
 * Radix tree node. Every kind shares one class (one hidden class for the whole
 * lookup loop); fields that do not apply to a kind keep their neutral value.
 *
 * - `STATIC`: matches its `prefix`, which may span several path segments.
 * - `PARAM`: matches a non-empty run of characters up to the next `/`.
 * - `WILDCARD`: matches the non-empty remainder of the path.
 */
export class RouteNode<T> {
  prefix: string;
  handler: RouteHandler<T> | null = null;
  param: RouteNode<T> | null = null;
  wildcard: RouteNode<T> | null = null;
  /** Lowest declaration index in this subtree, used to prune the lookup. */
  min = Infinity;

  // Static children are kept in parallel arrays keyed by the first char code of
  // their prefix: a linear scan over integers beats a dictionary on the hot path.
  #codes: number[] = [];
  #nodes: RouteNode<T>[] = [];

  constructor(
    readonly kind: number,
    prefix = ""
  ) {
    this.prefix = prefix;
  }

  /**
   * Returns the static child whose prefix matches `path` at `index`, if any.
   */
  findStatic(path: string, index: number): RouteNode<T> | null {
    const code = path.charCodeAt(index);
    const codes = this.#codes;

    for (let i = 0; i < codes.length; i++) {
      if (codes[i] === code) {
        const child = this.#nodes[i];
        return child.prefix.length === 1 || path.startsWith(child.prefix, index) ? child : null;
      }
    }

    return null;
  }

  /**
   * Walks or creates the static chain for `text` and returns its last node,
   * splitting existing prefixes when they only partially match.
   */
  createStatic(text: string, order: number): RouteNode<T> {
    if (text.length === 0) {
      return this;
    }

    const code = text.charCodeAt(0);
    const index = this.#codes.indexOf(code);

    if (index === -1) {
      const child = new RouteNode<T>(ROUTE_NODE_KIND.STATIC, text);
      child.min = order;
      this.#codes.push(code);
      this.#nodes.push(child);

      return child;
    }

    let child = this.#nodes[index];
    const length = commonPrefixLength(child.prefix, text);

    if (length < child.prefix.length) {
      child = child.#split(this, index, length);
    }

    child.min = Math.min(child.min, order);

    return child.createStatic(text.slice(length), order);
  }

  #split(parent: RouteNode<T>, index: number, length: number): RouteNode<T> {
    const head = new RouteNode<T>(ROUTE_NODE_KIND.STATIC, this.prefix.slice(0, length));

    this.prefix = this.prefix.slice(length);
    head.min = this.min;
    head.#codes.push(this.prefix.charCodeAt(0));
    head.#nodes.push(this);
    parent.#nodes[index] = head;

    return head;
  }
}
