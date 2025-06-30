import {convertPath} from "./convertPath.js";

describe("Path conversion", () => {
  describe("v4", () => {
    it("should convert path with parameters correctly", () => {
      // v4
      expect(convertPath("/*", "v4")).toEqual({path: "/*", wildcard: "*"});
      expect(convertPath("/foo/*", "v4")).toEqual({path: "/foo/*", wildcard: "*"});
      expect(convertPath("/test/foo/*", "v4")).toEqual({path: "/test/foo/*", wildcard: "*"});
      expect(convertPath("/test/:foo/*", "v4")).toEqual({path: "/test/:foo/*", wildcard: "*"});
      expect(convertPath("/:param?", "v4")).toEqual({path: "/:param?"});
      expect(convertPath("/foo/:param?", "v4")).toEqual({path: "/foo/:param?"});
      expect(convertPath("/test/:foo/:param?", "v4")).toEqual({path: "/test/:foo/:param?"});
      expect(convertPath("/test/:foo?/:param?", "v4")).toEqual({path: "/test/:foo?/:param?"});

      // Ts.ED syntax
      expect(convertPath("/:param*", "v4")).toEqual({path: "/*", wildcard: "param"});
      expect(convertPath("/foo/:param*", "v4")).toEqual({path: "/foo/*", wildcard: "param"});
      expect(convertPath("/:foo/:param*", "v4")).toEqual({path: "/:foo/*", wildcard: "param"});

      // v5 compatibility to v4
      expect(convertPath("/*splat", "v4")).toEqual({path: "/*", wildcard: "splat"});
      expect(convertPath("/foo/*splat", "v4")).toEqual({path: "/foo/*", wildcard: "splat"});
      expect(convertPath("/{:param}", "v4")).toEqual({path: "/:param?"});
      expect(convertPath("/foo/{:param}", "v4")).toEqual({path: "/foo/:param?"});
      expect(convertPath("/test/{:foo}/{:param}", "v4")).toEqual({path: "/test/:foo?/:param?"});
      expect(convertPath("/test/:foo/{:param}", "v4")).toEqual({path: "/test/:foo/:param?"});

      // v4 pattern to v4 wildcard
      expect(convertPath("/(.*)", "v4")).toEqual({path: "/*", wildcard: "*"});
      expect(convertPath("/foo/(.*)", "v4")).toEqual({path: "/foo/*", wildcard: "*"});

      // preserve the original path for v4, not supported in v5
      expect(convertPath("/[discussion|page]/:slug", "v4")).toEqual({path: "/[discussion|page]/:slug"});
      expect(convertPath("/test/(.*)/end", "v4")).toEqual({path: "/test/(.*)/end"});
    });
  });

  describe("v5", () => {
    it("should convert path with parameters correctly", () => {
      // v4 to v5 conversion
      expect(convertPath("/*", "v5")).toEqual({path: "/{*wildcard}", wildcard: "*"});
      expect(convertPath("/foo/*", "v5")).toEqual({path: "/foo/{*wildcard}", wildcard: "*"});
      expect(convertPath("/test/foo/*", "v5")).toEqual({path: "/test/foo/{*wildcard}", wildcard: "*"});
      expect(convertPath("/:param?", "v5")).toEqual({path: "/{:param}"});
      expect(convertPath("/foo/:param?", "v5")).toEqual({path: "/foo/{:param}"});
      expect(convertPath("/test/foo/:param?", "v5")).toEqual({path: "/test/foo/{:param}"});
      expect(convertPath("/test/:foo/:param?", "v5")).toEqual({path: "/test/:foo/{:param}"});
      expect(convertPath("/test/:foo?/:param?", "v5")).toEqual({path: "/test/{:foo}/{:param}"});
      expect(convertPath("/(.*)", "v5")).toEqual({path: "/{*wildcard}", wildcard: "*"});
      expect(convertPath("/foo/(.*)", "v5")).toEqual({path: "/foo/{*wildcard}", wildcard: "*"});
      expect(convertPath("/test/foo/(.*)", "v5")).toEqual({path: "/test/foo/{*wildcard}", wildcard: "*"});
      expect(convertPath("/test/:foo/(.*)", "v5")).toEqual({path: "/test/:foo/{*wildcard}", wildcard: "*"});

      // Ts.ED syntax
      expect(convertPath("/:param*", "v5")).toEqual({path: "/{*param}", wildcard: "param"});
      expect(convertPath("/foo/:param*", "v5")).toEqual({path: "/foo/{*param}", wildcard: "param"});
      expect(convertPath("/test/:foo/:param*", "v5")).toEqual({path: "/test/:foo/{*param}", wildcard: "param"});

      // v5
      expect(convertPath("/*splat", "v5")).toEqual({path: "/*splat", wildcard: "splat"});
      expect(convertPath("/foo/*splat", "v5")).toEqual({path: "/foo/*splat", wildcard: "splat"});
      expect(convertPath("/{*splat}", "v5")).toEqual({path: "/{*splat}", wildcard: "splat"});
      expect(convertPath("/foo/{*splat}", "v5")).toEqual({path: "/foo/{*splat}", wildcard: "splat"});
      expect(convertPath("/{:param}", "v5")).toEqual({path: "/{:param}"});
      expect(convertPath("/foo/{:param}", "v5")).toEqual({path: "/foo/{:param}"});

      // fail in v5, let developers handle it
      expect(convertPath("/[discussion|page]/:slug", "v5")).toEqual({path: "/[discussion|page]/:slug"});
      expect(convertPath("/test/(.*)/end", "v5")).toEqual({path: "/test/(.*)/end"});
    });
  });
});
