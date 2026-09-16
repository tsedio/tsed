import {FetchRouter} from "../components/FetchRouter.js";
import {s} from "@tsed/schema";
import {defineEndpoint} from "./defineEndpoint.js";

describe("defineEndpoint", () => {
  it("should create a router that can be mounted", () => {
    class CreatePath {
      name!: string;
    }

    const endpoint = defineEndpoint({
      path: "/path/:id",
      method: "GET",
      summary: "Gets a path",
      tags: ["paths"],
      input: {
        headers: s.object({
          authorization: s.string().required()
        }),
        query: s.object({
          query1: s.string()
        }),
        params: s.object({
          id: s.string().required()
        }),
        body: {
          schema: CreatePath,
          contentType: "application/json",
          required: true,
          description: "Path to create",
          examples: {
            default: {value: {name: "home"}}
          }
        }
      },
      output: {
        200: {
          // should match the handler return type, but it'll be complicated
          description: "",
          contentType: "application/json", // optional
          schema: s.object({})
        }
      },
      handler({params, body}) {
        /// implementation
        params.id.toUpperCase();
        body.name.toUpperCase();
      }
    });

    expect(endpoint).toBeInstanceOf(FetchRouter);
    expect(new FetchRouter().use("/api", endpoint)).toBeInstanceOf(FetchRouter);
  });
});
