import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {PlatformTest} from "@tsed/platform-http/testing";
import {definePrompt} from "./definePrompt.js";
import {context, inject, runInContext} from "@tsed/di";

describe("definePrompt", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should wrap handler errors with structured MCP payloads", async () => {
    const token = definePrompt({
      name: "failing-prompt",
      handler() {
        throw new Error("boom");
      }
    });

    const definition = inject<any>(token);
    const result = await definition.handler({} as any);

    expect(result).toEqual({
      description: "boom",
      messages: [],
      _meta: {
        status_code: undefined,
        code: "E_MCP_PROMPT_ERROR",
        message: "boom",
        request_id: expect.any(String),
        prompt: "failing-prompt"
      }
    });
  });

  it("should derive error code from error name and status when available", async () => {
    const token = definePrompt({
      name: "http-prompt",
      handler() {
        const er = new Error("Bad request") as Error & {status?: number; name: string};
        er.name = "BadRequest";
        er.status = 400;
        throw er;
      }
    });

    const definition = inject<any>(token);
    const result = await definition.handler({} as any);

    expect(result).toEqual({
      description: "Bad request",
      messages: [],
      _meta: {
        status_code: 400,
        code: "E_MCP_PROMPT_BAD_REQUEST",
        message: "Bad request",
        request_id: expect.any(String),
        prompt: "http-prompt"
      }
    });
  });

  it("should expose its definition and invocation arguments in the execution context", async () => {
    const args = {city: "Paris"};
    const serverContext = {} as any;
    const token = definePrompt({
      name: "contextual-prompt",
      handler() {
        expect(context().get("mcp")).toMatchObject({name: "contextual-prompt"});
        expect(context().get("mcp_args")).toEqual([args, serverContext]);

        return {messages: []};
      }
    });

    const definition = inject<any>(token);

    await runInContext(PlatformTest.createRequestContext(), () => definition.handler(args, serverContext));
  });
});
