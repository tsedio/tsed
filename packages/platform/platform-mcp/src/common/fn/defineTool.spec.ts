import {Default, from, JsonSchema, Name, Property, s, string} from "@tsed/schema";
import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {PlatformTest} from "@tsed/platform-http/testing";
import {defineTool} from "./defineTool.js";
import {context, inject, runInContext} from "@tsed/di";

class KnowledgeSearchRequest {
  @Property()
  query!: string;

  @Default(10)
  @Name("top_k")
  @Property()
  topK: number = 10;

  @Name("request_id")
  @Property()
  requestId?: string;

  constructor(props: Partial<KnowledgeSearchRequest> = {}) {
    Object.assign(this, props);
  }
}

describe("defineTool", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should wrap handler errors with structured MCP payloads", async () => {
    const token = defineTool<any>({
      name: "failing-tool",
      description: "Always throws",
      handler() {
        throw new Error("boom");
      }
    });

    const definition = inject<any>(token);

    const result = await definition.handler({}, {} as any);

    expect(result.isError).toBe(true);
    expect(result.structuredContent).toEqual({
      code: "E_MCP_TOOL_ERROR",
      message: "boom",
      tool: "failing-tool"
    });
  });

  it("should derive error code from error name and status when available", async () => {
    const token = defineTool<any>({
      name: "http-tool",
      handler() {
        const er = new Error("Not found") as Error & {status?: number; name: string};
        er.name = "NotFound";
        er.status = 404;
        throw er;
      }
    });

    const definition = inject<any>(token);
    const result = await definition.handler({}, {} as any);

    expect(result.isError).toBe(true);
    expect(result.structuredContent).toEqual({
      status_code: 404,
      code: "E_MCP_TOOL_NOT_FOUND",
      message: "Not found",
      tool: "http-tool"
    });
  });

  it("should expose aliased input schema properties", () => {
    const token = defineTool<any>({
      name: "aliased-tool",
      inputSchema: new JsonSchema({
        type: "object",
        properties: {
          prop: {
            type: "string"
          }
        },
        required: ["prop"]
      }).addAlias("prop", "aliasProp"),
      handler() {
        return {content: []};
      }
    });

    const definition = inject<any>(token);

    expect(definition.inputSchema["~standard"].jsonSchema.input({target: "draft-2020-12"})).toEqual({
      type: "object",
      properties: {
        aliasProp: {
          type: "string"
        }
      },
      required: ["aliasProp"]
    });
  });

  it("should expose aliases declared by functional output schemas", () => {
    const token = defineTool({
      name: "aliased-tool-output",
      outputSchema: s.object({prop: string().required()}).addAlias("prop", "aliasProp"),
      handler() {
        return {prop: "value"};
      }
    });

    const definition = inject<any>(token);

    expect(definition.outputSchema["~standard"].jsonSchema.input({target: "draft-2020-12"})).toMatchObject({
      type: "object",
      properties: {
        aliasProp: {
          type: "string"
        }
      },
      required: ["aliasProp"]
    });
  });

  it("should deserialize functional tool input from a Ts.ED model schema", async () => {
    const token = defineTool<KnowledgeSearchRequest>({
      name: "knowledge-search",
      inputSchema: from(KnowledgeSearchRequest).omit("query"),
      handler(input) {
        expect(input).toBeInstanceOf(KnowledgeSearchRequest);
        expect(input.topK).toBe(12);
        expect(input.requestId).toBe("req-123");

        return {
          content: []
        };
      }
    });

    const definition = inject<any>(token);

    await definition.handler(
      {
        top_k: 12,
        request_id: "req-123"
      },
      {} as any
    );
  });

  it("should normalize successful tool payloads as structured content", async () => {
    const token = defineTool({
      name: "successful-tool",
      outputSchema: s.object({id: string()}),
      handler() {
        return {id: "tool-id"};
      }
    });

    const definition = inject<any>(token);

    await expect(definition.handler({}, {} as any)).resolves.toEqual({
      content: [
        {
          type: "text",
          text: '{\n  "id": "tool-id"\n}'
        }
      ],
      structuredContent: {id: "tool-id"}
    });
  });

  it("should expose its definition and input in the execution context", async () => {
    const args = {query: "Ts.ED"};
    const token = defineTool({
      name: "contextual-tool",
      handler() {
        expect(context().get("mcp")).toMatchObject({name: "contextual-tool"});
        expect(context().get("mcp_args")).toEqual(args);

        return {content: []};
      }
    });

    const definition = inject<any>(token);

    await runInContext(PlatformTest.createRequestContext(), () => definition.handler(args, {} as any));
  });
});
