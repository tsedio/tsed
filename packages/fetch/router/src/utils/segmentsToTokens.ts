import type {ParsedSegment} from "./parseSegment.js";

export type RouteToken = string | Exclude<ParsedSegment, {type: "static"}>;

/**
 * Turns parsed segments into radix tokens: static text runs (separators
 * included) and dynamic tokens. The leading `/` is not part of any token, it is
 * the prefix of the tree root.
 *
 * `[users, :id, posts]` gives `["users/", :id, "/posts"]`.
 */
export function segmentsToTokens(segments: ParsedSegment[]): RouteToken[] {
  const tokens: RouteToken[] = [];
  let text = "";

  segments.forEach((segment, i) => {
    if (i > 0) text += "/";

    if (segment.type === "static") {
      text += segment.value;
      return;
    }

    if (text) tokens.push(text);
    text = "";
    tokens.push(segment);
  });

  if (text) tokens.push(text);

  return tokens;
}
