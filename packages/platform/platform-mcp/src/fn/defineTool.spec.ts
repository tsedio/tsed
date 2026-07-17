import {Default, from, JsonSchema, Name, Property, s, string} from "@tsed/schema";
import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {PlatformTest} from "@tsed/platform-http/testing";
import {defineTool} from "./defineTool.js";
import {inject} from "@tsed/di";

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

    expect(definition.inputSchema.toJSONSchema()).toEqual({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "object",
      properties: {
        aliasProp: {
          type: "string"
        }
      },
      required: ["aliasProp"],
      additionalProperties: false
    });
  });

  it("should expose aliased output schema properties", () => {
    const token = defineTool({
      name: "aliased-tool-output",
      outputSchema: s.object({prop: string().required().name("aliasProps")}),
      handler() {
        return {prop: "value"};
      }
    });

    const definition = inject<any>(token);

    expect(definition.outputSchema.toJSONSchema()).toMatchObject({
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
});
