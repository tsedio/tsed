import {FetchRouter} from "../components/FetchRouter.js";
import {s} from "@tsed/schema";
import {defineEndpoint} from "./defineEndpoint.js";

describe("defineEndpoint", () => {
  it("should create a router that can be mounted", () => {
    const endpoint = defineEndpoint({
      path: "/path/:id",
      method: "GET",
      input: {
        headers: s.object({
          authorization: s.string().required()
        }),
        query: s.object({
          query1: s.string()
        }),
        params: s.object({
          id: s.string()
        })
      },
      output: {
        200: {
          // should match the handler return type, but it'll be complicated
          description: "",
          contentType: "application/json", // optional
          schema: s.object({})
        }
      },
      handler(context) {
        /// implementation
        // context.params.id => should be inferred from input.params.id
        // if context isn't the solution, args => args.params.id => input.params.id
      }
    });

    expect(endpoint).toBeInstanceOf(FetchRouter);
    expect(new FetchRouter().use("/api", endpoint)).toBeInstanceOf(FetchRouter);
  });
});
