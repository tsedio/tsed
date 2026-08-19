import {createFetchRequest} from "./createFetchRequest.js";

describe("createFetchRequest", () => {
  it("converts Express URL, method and repeated headers without consuming a GET body", () => {
    const request = {
      protocol: "https",
      socket: {},
      method: "GET",
      originalUrl: "/widgets?tag=one",
      headers: {host: "api.tsed.dev", "x-test": ["one", "two"]},
      get: (name: string) => (name === "host" ? "api.tsed.dev" : undefined)
    };

    const result = createFetchRequest(request as any);

    expect(result.url).toBe("https://api.tsed.dev/widgets?tag=one");
    expect(result.method).toBe("GET");
    expect(result.headers.get("x-test")).toBe("one, two");
    expect(result.body).toBeNull();
  });
});
