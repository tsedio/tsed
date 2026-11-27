import {DIContext} from "@tsed/di";
import {FetchContext} from "./FecthContext.js";

describe("FetchContext", () => {
  it("should expose the native request, decoded input and DI scope", async () => {
    const request = new Request("https://example.com/users/1?search=tsed", {
      method: "POST",
      headers: {authorization: "Bearer token", "content-type": "application/json"},
      body: JSON.stringify({name: "Ada"})
    });
    const context = new FetchContext<{
      params: {id: string};
      query: {search?: string};
      headers: {authorization?: string};
      body: {name: string};
    }>({
      id: "request-1",
      request,
      route: "/users/:id",
      params: {id: "1"},
      query: {search: "tsed"},
      headers: {authorization: "Bearer token"}
    });

    expect(context).toBeInstanceOf(DIContext);
    expect(context.PLATFORM).toBe("FETCH");
    expect(context.request.raw).toBe(request);
    expect(context.request.url).toBe("https://example.com/users/1?search=tsed");
    expect(context.request.method).toBe("POST");
    expect(context.request.path).toBe("/users/1");
    expect(context.request.route).toBe("/users/:id");
    expect(context.request.origin).toBe("https://example.com");
    expect(context.request.protocol).toBe("https:");
    expect(context.request.host).toBe("example.com");
    expect(context.request.hostname).toBe("example.com");
    expect(context.request.port).toBe("");
    expect(context.request.search).toBe("?search=tsed");
    expect(context.request.searchParams.get("search")).toBe("tsed");
    expect(context.request.hash).toBe("");
    expect(context.request.params.id).toBe("1");
    expect(context.request.query.search).toBe("tsed");
    expect(context.request.headers.authorization).toBe("Bearer token");
    await expect(context.request.body()).resolves.toEqual({name: "Ada"});

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
