import {DIContext} from "@tsed/di";
import {FetchContext} from "./FecthContext.js";

describe("FetchContext", () => {
  it("should expose the native request, decoded input and DI scope", () => {
    const request = new Request("https://example.com/users/1?search=tsed", {
      method: "POST",
      headers: {authorization: "Bearer token"}
    });
    const context = new FetchContext({
      id: "request-1",
      request,
      route: "/users/:id",
      params: {id: "1"},
      query: {search: "tsed"},
      headers: {authorization: "Bearer token"},
      body: {name: "Ada"}
    });

    expect(context).toBeInstanceOf(DIContext);
    expect(context.PLATFORM).toBe("FETCH");
    expect(context.request).toBe(request);
    expect(context.url).toBe("https://example.com/users/1?search=tsed");
    expect(context.method).toBe("POST");
    expect(context.path).toBe("/users/1");
    expect(context.route).toBe("/users/:id");
    expect(context.origin).toBe("https://example.com");
    expect(context.protocol).toBe("https:");
    expect(context.host).toBe("example.com");
    expect(context.hostname).toBe("example.com");
    expect(context.port).toBe("");
    expect(context.search).toBe("?search=tsed");
    expect(context.searchParams.get("search")).toBe("tsed");
    expect(context.hash).toBe("");
    expect(context.params.id).toBe("1");
    expect(context.query.search).toBe("tsed");
    expect(context.headers.authorization).toBe("Bearer token");
    expect(context.body.name).toBe("Ada");

    context.set("userId", "1");
    expect(context.get("userId")).toBe("1");
  });

  it("should collect response metadata for automatic serialization", () => {
    const context = new FetchContext({
      id: "request-1",
      request: new Request("https://example.com")
    });

    expect(
      context.response
        .status(201)
        .header("x-request-id", context.id)
        .contentType("application/json")
        .appendHeader("set-cookie", "session=abc; HttpOnly")
        .toResponseInit()
    ).toMatchObject({
      status: 201,
      headers: expect.any(Headers)
    });

    const response = Response.json({created: true}, context.response.toResponseInit());

    expect(response.status).toBe(201);
    expect(response.headers.get("x-request-id")).toBe("request-1");
    expect(response.headers.get("content-type")).toBe("application/json");
    expect(response.headers.get("set-cookie")).toBe("session=abc; HttpOnly");
  });

  it("should create native Fetch responses for explicit handler responses", async () => {
    const context = new FetchContext({
      id: "request-1",
      request: new Request("https://example.com")
    });

    const json = context.response.status(202).json({accepted: true});

    expect(json.status).toBe(202);
    await expect(json.json()).resolves.toEqual({accepted: true});

    const html = context.response.status(200).html("<h1>Ts.ED</h1>");

    expect(html.headers.get("content-type")).toBe("text/html;charset=UTF-8");
    await expect(html.text()).resolves.toBe("<h1>Ts.ED</h1>");

    const redirect = context.response.redirect("/login", 303);

    expect(redirect.status).toBe(303);
    expect(redirect.headers.get("location")).toBe("/login");
  });
});
