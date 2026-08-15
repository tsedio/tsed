import {describe, expect, it} from "vitest";
import {convertPath} from "./convertPath.js";

describe("convertPath", () => {
  it("preserves named and optional parameters", () => {
    expect(convertPath("/users/:id?")).toEqual({path: "/users/:id?", wildcard: undefined});
  });

  it("converts named wildcard parameters", () => {
    expect(convertPath("/files/:path*")).toEqual({path: "/files/*", wildcard: "path"});
  });
});
