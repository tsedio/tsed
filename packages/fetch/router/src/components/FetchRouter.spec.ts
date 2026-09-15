import {FetchRouter} from "./FetchRouter.js";

describe("FetchRouter", () => {
  describe("get", () => {
    it("should support the concise path and handler form", () => {
      const router = new FetchRouter();

      expect(router.get("/users/:id", ({request}) => Response.json({url: request.url}))).toBe(router);
    });

    it("should support the endpoint declaration form", () => {
      type Input = {params: {id: string}};
      const router = new FetchRouter();

      expect(
        router.get<Input>({
          path: "/users/:id",
          input: {params: {type: "object"}},
          output: {200: {description: "A user", contentType: "application/json", schema: {type: "object"}}},
          handler: ({params}) => Response.json({id: params.id})
        })
      ).toBe(router);
    });
  });

  it("should expose each standard HTTP verb as a fluent method", () => {
    const router = new FetchRouter();
    const handler = () => new Response();

    expect(router.post("/users", handler)).toBe(router);
    expect(router.put("/users/:id", handler)).toBe(router);
    expect(router.patch("/users/:id", handler)).toBe(router);
    expect(router.delete("/users/:id", handler)).toBe(router);
    expect(router.head("/health", handler)).toBe(router);
    expect(router.options("/users", handler)).toBe(router);
  });

  it("should compose routers with or without a mount path", () => {
    const router = new FetchRouter();
    const child = new FetchRouter();

    expect(router.use(child)).toBe(router);
    expect(router.use("/api", child)).toBe(router);
  });
});
