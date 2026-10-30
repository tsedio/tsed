import {describe, expect, it} from "vitest";

import {checkResponse, ROUTES, selectRoutes} from "../src/routes.mjs";

const [hello, users] = ROUTES;

describe("routes", () => {
  it("should accept the expected response", () => {
    expect(checkResponse(hello, {status: 200, text: "hello world"})).toBeNull();
    expect(checkResponse(users, {status: 200, text: JSON.stringify({name: "user-42", page: 3, id: 42})})).toBeNull();
  });

  it("should reject an unexpected status", () => {
    expect(checkResponse(users, {status: 400, text: "Bad request"})).toMatch("expected status 200, got 400");
  });

  it("should reject an unexpected body", () => {
    expect(checkResponse(hello, {status: 200, text: "hello"})).toMatch("expected body");
    expect(checkResponse(users, {status: 200, text: JSON.stringify({id: "42", page: 3, name: "user-42"})})).toMatch("unexpected JSON body");
    expect(checkResponse(users, {status: 200, text: "<html>"})).toMatch("expected a JSON body");
  });

  it("should select routes by id", () => {
    expect(selectRoutes(["users"]).map((route) => route.id)).toEqual(["users"]);
    expect(selectRoutes([])).toBe(ROUTES);
    expect(() => selectRoutes(["nope"])).toThrow("Unknown routes: nope");
  });
});
