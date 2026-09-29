import {RouteMatcher} from "./RouteMatcher.js";

describe("RouteMatcher", () => {
  it("should match a static route", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/users", "list");

    expect(matcher.match("GET", "/users")).toEqual({value: "list", route: "/users", params: {}});
  });

  it("should match the root path", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/", "root");

    expect(matcher.match("GET", "/")?.value).toBe("root");
  });

  it("should resolve route parameters", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/users/:id/posts/:postId", "post");

    expect(matcher.match("GET", "/users/1/posts/2")).toEqual({
      value: "post",
      route: "/users/:id/posts/:postId",
      params: {id: "1", postId: "2"}
    });
  });

  it("should decode percent-encoded parameters and tolerate malformed ones", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/users/:id", "user");

    expect(matcher.match("GET", "/users/a%20b")?.params.id).toBe("a b");
    expect(matcher.match("GET", "/users/%E0%A4%A")?.params.id).toBe("%E0%A4%A");
  });

  it("should ignore trailing and duplicated slashes", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/users/:id", "user");

    expect(matcher.match("GET", "/users/1/")?.params).toEqual({id: "1"});
    expect(matcher.match("GET", "//users//1//")?.params).toEqual({id: "1"});
  });

  it("should resolve by declaration order whatever the kind of segment", () => {
    const matcher = new RouteMatcher<string>()
      .add("GET", "/files/*", "wildcard")
      .add("GET", "/files/:name", "param")
      .add("GET", "/files/latest", "static");

    expect(matcher.match("GET", "/files/latest")?.value).toBe("wildcard");
    expect(matcher.match("GET", "/files/other")?.value).toBe("wildcard");
    expect(matcher.match("GET", "/files/a/b")?.value).toBe("wildcard");
  });

  it("should let a static route declared first win over a later param and wildcard", () => {
    const matcher = new RouteMatcher<string>()
      .add("GET", "/files/latest", "static")
      .add("GET", "/files/:name", "param")
      .add("GET", "/files/*", "wildcard");

    expect(matcher.match("GET", "/files/latest")?.value).toBe("static");
    expect(matcher.match("GET", "/files/other")?.value).toBe("param");
    expect(matcher.match("GET", "/files/a/b")?.value).toBe("wildcard");
  });

  it("should backtrack from a static branch to a param branch", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/a/b/c", "static").add("GET", "/a/:x/d", "param");

    expect(matcher.match("GET", "/a/b/d")).toEqual({value: "param", route: "/a/:x/d", params: {x: "b"}});
  });

  it("should capture the wildcard remainder", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/static/:bucket/*", "asset");

    expect(matcher.match("GET", "/static/img/a/b.png")?.params).toEqual({bucket: "img", "*": "a/b.png"});
  });

  describe("wildcards", () => {
    it("should capture a named wildcard under its name", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/files/:path*", "files");

      expect(matcher.match("GET", "/files/docs/report.pdf")).toEqual({
        value: "files",
        route: "/files/:path*",
        params: {path: "docs/report.pdf"}
      });
    });

    it("should capture a regexp wildcard as *", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/files/(.*)", "files");

      expect(matcher.match("GET", "/files/docs/report.pdf")?.params).toEqual({"*": "docs/report.pdf"});
    });

    it("should require a non-empty remainder", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/files/:path*", "files").add("GET", "/other/(.*)", "other");

      expect(matcher.match("GET", "/files")).toBeUndefined();
      expect(matcher.match("GET", "/other")).toBeUndefined();
    });

    it("should decode the wildcard remainder", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/files/:path*", "files");

      expect(matcher.match("GET", "/files/a%20b/c")?.params).toEqual({path: "a b/c"});
    });

    it("should combine parameters and a named wildcard", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/:bucket/:path*", "asset");

      expect(matcher.match("GET", "/img/a/b.png")?.params).toEqual({bucket: "img", path: "a/b.png"});
    });
  });

  describe("optional parameters", () => {
    it.each(["/users/:id?", "/users/{:id}"])("should match with and without the parameter (%s)", (pattern) => {
      const matcher = new RouteMatcher<string>().add("GET", pattern, "users");

      expect(matcher.match("GET", "/users/123")).toEqual({value: "users", route: pattern, params: {id: "123"}});
      expect(matcher.match("GET", "/users")).toEqual({value: "users", route: pattern, params: {}});
      expect(matcher.match("GET", "/users/1/2")).toBeUndefined();
    });

    it("should handle several optional parameters", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/a/:x?/b/{:y}", "ab");

      expect(matcher.match("GET", "/a/1/b/2")?.params).toEqual({x: "1", y: "2"});
      expect(matcher.match("GET", "/a/b/2")?.params).toEqual({y: "2"});
      expect(matcher.match("GET", "/a/1/b")?.params).toEqual({x: "1"});
      expect(matcher.match("GET", "/a/b")?.params).toEqual({});
    });

    it("should match the root when the only segment is optional", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/:id?", "root");

      expect(matcher.match("GET", "/")?.params).toEqual({});
      expect(matcher.match("GET", "/1")?.params).toEqual({id: "1"});
    });

    it("should follow declaration order between an optional parameter and a static route", () => {
      const paramFirst = new RouteMatcher<string>().add("GET", "/users/:id?", "param").add("GET", "/users/me", "me");
      const staticFirst = new RouteMatcher<string>().add("GET", "/users/me", "me").add("GET", "/users/:id?", "param");

      expect(paramFirst.match("GET", "/users/me")?.value).toBe("param");
      expect(paramFirst.match("GET", "/users/me")?.params).toEqual({id: "me"});
      expect(staticFirst.match("GET", "/users/me")?.value).toBe("me");
      expect(staticFirst.match("GET", "/users/1")?.value).toBe("param");
      expect(staticFirst.match("GET", "/users")?.value).toBe("param");
    });

    it("should prefer the variant where the first optional parameter is present", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/:a?/:b?", "ab");

      expect(matcher.match("GET", "/1")?.params).toEqual({a: "1"});
      expect(matcher.match("GET", "/1/2")?.params).toEqual({a: "1", b: "2"});
    });

    it("should resolve an ambiguous optional parameter like a regexp would", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/:a?/x/:b?", "axb");

      expect(matcher.match("GET", "/x/x")?.params).toEqual({a: "x"});
    });

    it("should report allowed methods for an omitted optional parameter", () => {
      const matcher = new RouteMatcher<string>().add("DELETE", "/users/:id?", "users");

      expect(matcher.allowedMethods("/users")).toEqual(["DELETE"]);
    });
  });

  it("should not match a different method and expose HEAD fallback to GET", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/users", "list");

    expect(matcher.match("POST", "/users")).toBeUndefined();
    expect(matcher.match("HEAD", "/users")?.value).toBe("list");
  });

  it("should prefer an explicit HEAD route", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/users", "get").add("HEAD", "/users", "head");

    expect(matcher.match("HEAD", "/users")?.value).toBe("head");
  });

  it("should return undefined when no route matches", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/users/:id", "user");

    expect(matcher.match("GET", "/users")).toBeUndefined();
    expect(matcher.match("GET", "/users/1/extra")).toBeUndefined();
    expect(matcher.match("GET", "/nope")).toBeUndefined();
  });

  it("should not leak parameters from an abandoned branch", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/:a/x", "first").add("GET", "/:b/y", "second");

    expect(matcher.match("GET", "/1/y")?.params).toEqual({b: "1"});
  });

  it("should keep the first registration for a duplicated method and pattern", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/users", "first").add("GET", "/users", "second");

    expect(matcher.match("GET", "/users")?.value).toBe("first");
  });

  it("should allow different parameter names at the same position", () => {
    const matcher = new RouteMatcher<string>().add("GET", "/users/:id", "a").add("GET", "/users/:userId/posts", "b");

    expect(matcher.match("GET", "/users/1")?.params).toEqual({id: "1"});
    expect(matcher.match("GET", "/users/1/posts")?.params).toEqual({userId: "1"});
  });

  describe("allowedMethods", () => {
    it("should distinguish an unknown path from a wrong method", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/users/:id", "a").add("DELETE", "/users/:id", "b");

      expect(matcher.allowedMethods("/users/1").sort()).toEqual(["DELETE", "GET"]);
      expect(matcher.allowedMethods("/nope")).toEqual([]);
    });
  });

  describe("invalid patterns", () => {
    it("should reject a non-terminal wildcard", () => {
      expect(() => new RouteMatcher().add("GET", "/a/*/b", 1)).toThrow("Wildcard must be the last segment");
    });

    it("should reject an empty parameter name", () => {
      expect(() => new RouteMatcher().add("GET", "/a/:", 1)).toThrow("Empty parameter name");
    });
  });

  describe("matching order", () => {
    it("should depend on the registration order like Express does", () => {
      const patterns = ["/a/:id", "/a/static", "/a/*", "/a/static/:x"];
      const forward = new RouteMatcher<string>();
      const backward = new RouteMatcher<string>();
      patterns.forEach((p) => forward.add("GET", p, p));
      [...patterns].reverse().forEach((p) => backward.add("GET", p, p));

      expect(forward.match("GET", "/a/static")?.value).toBe("/a/:id");
      expect(forward.match("GET", "/a/other")?.value).toBe("/a/:id");
      expect(forward.match("GET", "/a/static/1")?.value).toBe("/a/*");
      expect(forward.match("GET", "/a/x/y/z")?.value).toBe("/a/*");

      expect(backward.match("GET", "/a/static")?.value).toBe("/a/*");
      expect(backward.match("GET", "/a/static/1")?.value).toBe("/a/static/:x");
      expect(backward.match("GET", "/a/other")?.value).toBe("/a/*");
    });

    it("should skip an earlier declaration that does not match the method", () => {
      const matcher = new RouteMatcher<string>().add("POST", "/a/:id", "post").add("GET", "/a/static", "get");

      expect(matcher.match("GET", "/a/static")?.value).toBe("get");
    });

    it("should pick the earliest declaration found deep in another branch", () => {
      const matcher = new RouteMatcher<string>()
        .add("GET", "/a/:x/c", "param")
        .add("GET", "/a/b/c", "static")
        .add("GET", "/a/*", "wildcard");

      expect(matcher.match("GET", "/a/b/c")?.value).toBe("param");
      expect(matcher.match("GET", "/a/b/d")?.value).toBe("wildcard");
    });

    it("should fall back to a wildcard registered on a parent after a deep static miss", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/a/b/c", "deep").add("GET", "/a/*", "wildcard");

      expect(matcher.match("GET", "/a/b/c")?.value).toBe("deep");
      expect(matcher.match("GET", "/a/b/d")?.value).toBe("wildcard");
    });

    it("should fall back to a wildcard after a param branch fails", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/a/:x/end", "param").add("GET", "/a/*", "wildcard");

      expect(matcher.match("GET", "/a/1/end")?.value).toBe("param");
      expect(matcher.match("GET", "/a/1/other")?.value).toBe("wildcard");
    });
  });

  describe("differential test against a linear declaration-order scan", () => {
    function reference(routes: {method: string; pattern: string}[], method: string, url: string) {
      for (const {method: m, pattern} of routes) {
        if (m !== method) continue;
        const names: string[] = [];
        const source = pattern
          .split("/")
          .filter(Boolean)
          .map((segment) => {
            if (segment === "*") return (names.push("*"), "/(.+)");
            if (segment.endsWith("?")) return (names.push(segment.slice(1, -1)), "(?:/([^/]+))?");
            if (segment.startsWith(":")) return (names.push(segment.slice(1)), "/([^/]+)");
            return `/${segment}`;
          })
          .join("");
        const result = new RegExp(`^${source}/?$`).exec(url);

        if (result) {
          const params: Record<string, string> = {};
          names.forEach((name, i) => result[i + 1] !== undefined && (params[name] = result[i + 1]));
          return {route: pattern, params};
        }
      }
      return undefined;
    }

    function rng(seed: number) {
      return () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
    }

    it.each([1, 2, 3, 4, 5, 6, 7, 8])("should agree with the reference for seed %i", (seed) => {
      const random = rng(seed);
      const pick = <V>(list: V[]) => list[Math.floor(random() * list.length)];
      const routes = Array.from({length: 40}, () => {
        const length = 1 + Math.floor(random() * 4);
        const segments = Array.from({length}, (_, i) => {
          const kind = random();
          if (kind < 0.5) return pick(["a", "b", "c"]);
          if (kind < 0.75) return `:p${i}`;
          if (kind < 0.9) return `:o${i}?`;
          return i === length - 1 ? "*" : "d";
        });
        return {method: pick(["GET", "POST"]), pattern: `/${segments.join("/")}`};
      });
      const matcher = new RouteMatcher<number>();
      routes.forEach(({method, pattern}, i) => matcher.add(method, pattern, i));

      for (let n = 0; n < 400; n++) {
        const length = Math.floor(random() * 5);
        const url = `/${Array.from({length}, () => pick(["a", "b", "c", "d", "z"])).join("/")}`;
        const method = pick(["GET", "POST"]);
        const expected = reference(routes, method, url);
        const actual = matcher.match(method, url);

        expect(actual && {route: actual.route, params: actual.params}, `${method} ${url}`).toEqual(expected);
      }
    });
  });

  describe("methods", () => {
    it("should keep independent routes per method on the same pattern", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/users/:id", "get").add("PUT", "/users/:id", "put");

      expect(matcher.match("GET", "/users/1")?.value).toBe("get");
      expect(matcher.match("PUT", "/users/1")?.value).toBe("put");
      expect(matcher.match("PATCH", "/users/1")).toBeUndefined();
    });

    it.each(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])("should match %s", (method) => {
      const matcher = new RouteMatcher<string>().add(method, "/x", method);

      expect(matcher.match(method, "/x")?.value).toBe(method);
    });

    it("should not fall back HEAD on a route that only exists for POST", () => {
      const matcher = new RouteMatcher<string>().add("POST", "/x", "post");

      expect(matcher.match("HEAD", "/x")).toBeUndefined();
    });

    it("should be case sensitive on the method", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/x", "get");

      expect(matcher.match("get", "/x")).toBeUndefined();
    });
  });

  describe("path handling", () => {
    it("should be case sensitive on static segments", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/Users", "users");

      expect(matcher.match("GET", "/users")).toBeUndefined();
      expect(matcher.match("GET", "/Users")?.value).toBe("users");
    });

    it("should keep dots, dashes and underscores inside a segment", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/files/:name", "file").add("GET", "/v1.0/a-b_c", "static");

      expect(matcher.match("GET", "/files/report.final-v2_x.pdf")?.params).toEqual({name: "report.final-v2_x.pdf"});
      expect(matcher.match("GET", "/v1.0/a-b_c")?.value).toBe("static");
    });

    it("should keep an encoded slash inside a single parameter", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/files/:name", "file");

      expect(matcher.match("GET", "/files/a%2Fb")?.params).toEqual({name: "a/b"});
    });

    it("should decode multi-byte sequences", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/tags/:tag", "tag");

      expect(matcher.match("GET", "/tags/caf%C3%A9")?.params).toEqual({tag: "café"});
      expect(matcher.match("GET", "/tags/%F0%9F%9A%80")?.params).toEqual({tag: "🚀"});
    });

    it("should match a static segment on its raw form only", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/a b", "space");

      expect(matcher.match("GET", "/a%20b")).toBeUndefined();
    });

    it("should handle a very long path", () => {
      const segments = Array.from({length: 500}, (_, i) => `s${i}`);
      const matcher = new RouteMatcher<string>().add("GET", `/${segments.map((s) => `:${s}`).join("/")}`, "deep");

      expect(Object.keys(matcher.match("GET", `/${segments.join("/")}`)!.params)).toHaveLength(500);
    });

    it("should handle many parameters", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/:a/:b/:c/:d/:e/:f/:g/:h", "many");

      expect(matcher.match("GET", "/1/2/3/4/5/6/7/8")?.params).toEqual({a: "1", b: "2", c: "3", d: "4", e: "5", f: "6", g: "7", h: "8"});
    });

    it("should not treat an empty segment as a parameter value", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/users/:id/posts", "posts");

      expect(matcher.match("GET", "/users//posts")).toBeUndefined();
    });
  });

  describe("prototype safety", () => {
    it("should match static segments named like Object.prototype members", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/constructor", "c").add("GET", "/__proto__", "p");

      expect(matcher.match("GET", "/constructor")?.value).toBe("c");
      expect(matcher.match("GET", "/__proto__")?.value).toBe("p");
      expect(matcher.match("GET", "/toString")).toBeUndefined();
      expect(matcher.match("GET", "/hasOwnProperty")).toBeUndefined();
    });

    it("should not pollute Object.prototype through parameter values or names", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/:__proto__/:constructor", "x");

      matcher.match("GET", "/polluted/polluted");

      expect(({} as any).polluted).toBeUndefined();
      expect(Object.getPrototypeOf({})).toBe(Object.prototype);
    });
  });

  describe("route table", () => {
    it("should keep every route reachable when a large table shares prefixes", () => {
      const matcher = new RouteMatcher<number>();
      for (let i = 0; i < 500; i++) {
        matcher.add("GET", `/api/r${i}`, i);
        matcher.add("GET", `/api/r${i}/:id`, i);
      }

      for (let i = 0; i < 500; i++) {
        expect(matcher.match("GET", `/api/r${i}`)?.value).toBe(i);
        expect(matcher.match("GET", `/api/r${i}/x`)).toMatchObject({value: i, params: {id: "x"}});
      }
    });

    it("should report the declared route, not the expanded variant", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/a/:x?/b", "ab");

      expect(matcher.match("GET", "/a/b")?.route).toBe("/a/:x?/b");
      expect(matcher.match("GET", "/a/1/b")?.route).toBe("/a/:x?/b");
    });

    it("should return a fresh params object on every match", () => {
      const matcher = new RouteMatcher<string>().add("GET", "/users/:id", "user");

      const first = matcher.match("GET", "/users/1")!;
      const second = matcher.match("GET", "/users/2")!;

      expect(first.params).toEqual({id: "1"});
      expect(second.params).toEqual({id: "2"});
    });
  });
});
