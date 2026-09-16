import {DIContext} from "@tsed/di";
import {FetchContext} from "./FecthContext.js";

describe("FetchContext", () => {
  it("should expose the native request, decoded input and DI scope", () => {
    const request = new Request("https://example.com/users/1?search=tsed", {
      headers: {authorization: "Bearer token"}
    });
    const context = new FetchContext({
      id: "request-1",
      request,
      params: {id: "1"},
      query: {search: "tsed"},
      headers: {authorization: "Bearer token"},
      body: {name: "Ada"}
    });

    expect(context).toBeInstanceOf(DIContext);
    expect(context.PLATFORM).toBe("FETCH");
    expect(context.request).toBe(request);
    expect(context.params.id).toBe("1");
    expect(context.query.search).toBe("tsed");
    expect(context.headers.authorization).toBe("Bearer token");
    expect(context.body.name).toBe("Ada");

    context.set("userId", "1");
    expect(context.get("userId")).toBe("1");
  });
});
