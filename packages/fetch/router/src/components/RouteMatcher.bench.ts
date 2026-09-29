import {bench, describe} from "vitest";
import {RouteMatcher} from "./RouteMatcher.js";

/**
 * Run with `yarn bench` from packages/fetch/router.
 *
 * Scenarios mirror the isolated single-route cases of find-my-way's benchmark, then
 * scale the route table and finish with a realistic REST API and registration cost.
 */

function many(patterns: string[]) {
  const matcher = new RouteMatcher<number>();
  patterns.forEach((pattern, i) => matcher.add("GET", pattern, i));
  return matcher;
}

describe("single route lookup", () => {
  const scenarios: [name: string, patterns: string[], url: string][] = [
    ["root /", ["/"], "/"],
    ["short static", ["/static"], "/static"],
    ["long static", ["/static/static/static/static/static"], "/static/static/static/static/static"],
    [
      "long static (common prefix)",
      ["/static", "/static/static", "/static/static/static", "/static/static/static/static", "/static/static/static/static/static"],
      "/static/static/static/static/static"
    ],
    ["short parametric", ["/:param"], "/param1"],
    ["long parametric", ["/:param"], "/longParamParamParamParamParamParam"],
    ["parametric (encoded, unoptimized)", ["/:param"], "/param%2B"],
    ["parametric (encoded, optimized)", ["/:param"], "/param%20"],
    ["two short params", ["/:param1/:param2"], "/param1/param2"],
    ["static + parametric", ["/static/:param1/static/:param2/static"], "/static/param1/static/param2/static"],
    ["optional param (present)", ["/users/:id?"], "/users/123"],
    ["optional param (omitted)", ["/users/:id?"], "/users"],
    ["short wildcard", ["/*"], "/static"],
    ["long wildcard", ["/*"], "/static/static/static/static/static"],
    ["named wildcard", ["/files/:path*"], "/files/a/b/c/d/e.txt"],
    ["trailing slashes", ["/users/:id"], "/users/123///"]
  ];

  for (const [name, patterns, url] of scenarios) {
    const matcher = many(patterns);

    bench(name, () => {
      matcher.match("GET", url);
    });
  }
});

describe("miss", () => {
  const matcher = many(["/users", "/users/:id", "/users/:id/posts"]);

  bench("unknown first segment", () => {
    matcher.match("GET", "/unknown/path/here");
  });

  bench("known prefix, unknown suffix", () => {
    matcher.match("GET", "/users/1/unknown");
  });

  bench("wrong method (allowedMethods)", () => {
    matcher.match("DELETE", "/users/1");
    matcher.allowedMethods("/users/1");
  });
});

describe("route table size", () => {
  for (const count of [10, 100, 1000, 10000]) {
    const matcher = new RouteMatcher<number>();
    for (let i = 0; i < count; i++) {
      matcher.add("GET", `/api/v1/resource${i}`, i);
      matcher.add("GET", `/api/v1/resource${i}/:id`, i);
      matcher.add("POST", `/api/v1/resource${i}/:id/items/:itemId`, i);
    }
    const last = count - 1;

    bench(`static, ${count * 3} routes`, () => {
      matcher.match("GET", `/api/v1/resource${last}`);
    });

    bench(`one param, ${count * 3} routes`, () => {
      matcher.match("GET", `/api/v1/resource${last}/42`);
    });

    bench(`two params, ${count * 3} routes`, () => {
      matcher.match("POST", `/api/v1/resource${last}/42/items/7`);
    });
  }
});

describe("realistic REST API", () => {
  const matcher = many([
    "/",
    "/health",
    "/auth/login",
    "/auth/logout",
    "/auth/refresh",
    "/users",
    "/users/me",
    "/users/:id",
    "/users/:id/avatar",
    "/users/:id/posts",
    "/users/:id/posts/:postId",
    "/users/:id/posts/:postId/comments",
    "/users/:id/posts/:postId/comments/:commentId",
    "/orgs/:org/repos",
    "/orgs/:org/repos/:repo",
    "/orgs/:org/repos/:repo/issues",
    "/orgs/:org/repos/:repo/issues/:number",
    "/orgs/:org/repos/:repo/pulls/:number/files",
    "/search/:kind?",
    "/assets/*",
    "/docs/:path*"
  ]);

  const requests = [
    "/",
    "/health",
    "/users/me",
    "/users/42",
    "/users/42/posts/7/comments/3",
    "/orgs/tsedio/repos/tsed/issues/3438",
    "/orgs/tsedio/repos/tsed/pulls/12/files",
    "/search",
    "/search/users",
    "/assets/img/logo.png",
    "/docs/guide/routing.html",
    "/unknown"
  ];
  let i = 0;

  bench("mixed traffic", () => {
    matcher.match("GET", requests[i++ % requests.length]);
  });
});

describe("registration", () => {
  bench("add 100 static + parametric routes", () => {
    const matcher = new RouteMatcher<number>();
    for (let i = 0; i < 50; i++) {
      matcher.add("GET", `/resource${i}`, i);
      matcher.add("GET", `/resource${i}/:id`, i);
    }
  });

  bench("add an optional-parameter route (4 variants)", () => {
    new RouteMatcher<number>().add("GET", "/a/:x?/b/{:y}", 1);
  });
});
