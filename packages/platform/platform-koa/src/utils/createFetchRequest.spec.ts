import {createFetchRequest} from "./createFetchRequest.js";

describe("createFetchRequest", () => {
  it("converts Koa URL, method and repeated headers without consuming a GET body", () => {
    const context = {
      protocol: "https",
      host: "api.tsed.dev",
      method: "GET",
      originalUrl: "/widgets?tag=one",
      request: {headers: {host: "api.tsed.dev", "x-test": ["one", "two"]}}
    };

    const result = createFetchRequest(context as any);

    expect(result.url).toBe("https://api.tsed.dev/widgets?tag=one");
    expect(result.method).toBe("GET");
    expect(result.headers.get("x-test")).toBe("one, two");
    expect(result.body).toBeNull();
  });
});
