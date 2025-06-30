import {convertPath} from "./convertPath.js";

describe("Path conversion", () => {
  it("should convert path with parameters correctly", () => {
    // v4
    expect(convertPath("/*")).toEqual({path: "/(.*)", wildcard: "*"});
    expect(convertPath("/foo/*")).toEqual({path: "/foo/(.*)", wildcard: "*"});
    expect(convertPath("/test/foo/*")).toEqual({path: "/test/foo/(.*)", wildcard: "*"});
    expect(convertPath("/test/:foo/*")).toEqual({path: "/test/:foo/(.*)", wildcard: "*"});
    expect(convertPath("/:param?")).toEqual({path: "/:param?"});
    expect(convertPath("/foo/:param?")).toEqual({path: "/foo/:param?"});
    expect(convertPath("/test/:foo/:param?")).toEqual({path: "/test/:foo/:param?"});
    expect(convertPath("/test/:foo?/:param?")).toEqual({path: "/test/:foo?/:param?"});

    // Ts.ED syntax
    expect(convertPath("/:param*")).toEqual({path: "/:param*", wildcard: "param"});
    expect(convertPath("/foo/:param*")).toEqual({path: "/foo/:param*", wildcard: "param"});
    expect(convertPath("/:foo/:param*")).toEqual({path: "/:foo/:param*", wildcard: "param"});

    // Express v5 compatibility to @koa/router
    expect(convertPath("/*splat")).toEqual({path: "/:splat*", wildcard: "splat"});
    expect(convertPath("/foo/*splat")).toEqual({path: "/foo/:splat*", wildcard: "splat"});
    expect(convertPath("/{:param}")).toEqual({path: "/:param?"});
    expect(convertPath("/foo/{:param}")).toEqual({path: "/foo/:param?"});
    expect(convertPath("/test/{:foo}/{:param}")).toEqual({path: "/test/:foo?/:param?"});
    expect(convertPath("/test/:foo/{:param}")).toEqual({path: "/test/:foo/:param?"});

    // v4 pattern to v4 wildcard
    expect(convertPath("/(.*)")).toEqual({path: "/(.*)", wildcard: "*"});
    expect(convertPath("/foo/(.*)")).toEqual({path: "/foo/(.*)", wildcard: "*"});

    // preserve the original path for v4, not supported in v5
    expect(convertPath("/[discussion|page]/:slug")).toEqual({path: "/[discussion|page]/:slug"});
    expect(convertPath("/test/(.*)/end")).toEqual({path: "/test/(.*)/end"});
  });
});
