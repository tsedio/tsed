import {FetchRouter} from "./FetchRouter.js";
import {s} from "@tsed/schema";

class UserParams {
  id!: string;
}

class UserQuery {
  search?: string;
}

class CreateUser {
  name!: string;
}

describe("FetchRouter", () => {
  describe("get", () => {
    it("should support the concise path and handler form", () => {
      const router = new FetchRouter();

      expect(router.get("/users/:id", ({request}) => Response.json({url: request.url}))).toBe(router);
    });

    it("should support the endpoint declaration form", () => {
      const router = new FetchRouter();

      expect(
        router.get({
          path: "/users/:id",
          input: {
            params: s.object()
          },
          output: {
            200: {
              description: "A user",
              contentType: "application/json",
              schema: s.object()
            }
          },
          handler: ({params}) => Response.json({id: params.id})
        })
      ).toBe(router);
    });

    it("should accept an explicit decoded input type", () => {
      type Input = {params: {id: string}};
      const router = new FetchRouter();

      expect(
        router.get<Input>({
          path: "/users/:id",
          handler: ({params}) => Response.json({id: params.id})
        })
      ).toBe(router);
    });

    it("should infer handler input from Ts.ED classes used directly as schemas", () => {
      const router = new FetchRouter();

      expect(
        router.get({
          path: "/users/:id",
          input: {
            params: UserParams,
            query: UserQuery,
            body: CreateUser
          },
          handler: ({params, query, body}) => {
            params.id.toUpperCase();
            query.search?.toUpperCase();
            body.name.toUpperCase();

            return Response.json({id: params.id});
          }
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
