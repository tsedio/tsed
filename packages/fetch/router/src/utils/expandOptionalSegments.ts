import type {ParsedSegment} from "./parseSegment.js";

/**
 * Expands optional parameters into every concrete segment list: each optional
 * parameter is either kept as a required parameter or omitted.
 */
export function expandOptionalSegments(segments: ParsedSegment[]): ParsedSegment[][] {
  let variants: ParsedSegment[][] = [[]];

  for (const segment of segments) {
    if (segment.type === "param" && segment.optional) {
      const required: ParsedSegment = {...segment, optional: false};
      variants = variants.flatMap((variant) => [[...variant, required], variant]);
    } else {
      variants = variants.map((variant) => [...variant, segment]);
    }
  }

  return variants;
}
