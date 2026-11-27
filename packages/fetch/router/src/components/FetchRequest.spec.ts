import {FetchRequest} from "./FetchRequest.js";

describe("FetchRequest", () => {
  it("should retain the native Fetch request", () => {
    const raw = new Request("https://api.example.com/users/1");
    const request = new FetchRequest({request: raw});

    expect(request.raw).toBe(raw);
  });

  it("should lazily parse and cache the body from its content type", async () => {
    const request = new FetchRequest({
      request: new Request("https://api.example.com/users", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({name: "Ada"})
      })
    });

    expect(await request.body<{name: string}>()).toEqual({name: "Ada"});
    expect(await request.body()).toEqual({name: "Ada"});
    expect(request.raw.bodyUsed).toBe(true);
  });

  it("should parse form and text bodies with their Fetch parsers", async () => {
    const formRequest = new FetchRequest({
      request: new Request("https://api.example.com/users", {
        method: "POST",
        headers: {"content-type": "application/x-www-form-urlencoded"},
        body: "name=Ada"
      })
    });
    const textRequest = new FetchRequest({
      request: new Request("https://api.example.com/messages", {
        method: "POST",
        headers: {"content-type": "text/plain"},
        body: "hello"
      })
    });

    expect((await formRequest.body<FormData>()).get("name")).toBe("Ada");
    await expect(textRequest.body<string>()).resolves.toBe("hello");
  });
});
