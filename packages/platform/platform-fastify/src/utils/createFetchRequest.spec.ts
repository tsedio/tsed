import {createFetchRequest} from "./createFetchRequest.js";

describe("createFetchRequest", () => {
  it("converts Fastify URL, method and repeated headers without consuming a GET body", () => {
    const request = {
      protocol: "https",
      hostname: "api.tsed.dev",
      method: "GET",
      url: "/widgets?tag=one",
      headers: {host: "api.tsed.dev", "x-test": ["one", "two"]}
    };

    const result = createFetchRequest(request as any);

    expect(result.url).toBe("https://api.tsed.dev/widgets?tag=one");
    expect(result.method).toBe("GET");
    expect(result.headers.get("x-test")).toBe("one, two");
    expect(result.body).toBeNull();
  });
});
