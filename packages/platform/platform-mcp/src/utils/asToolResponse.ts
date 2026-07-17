import {serialize} from "@tsed/json-mapper";
import {isObject} from "@tsed/core";
import type {CallToolResult} from "@modelcontextprotocol/server";

export interface StructuredResponse<
  T extends {
    [x: string]: unknown;
  } = {
    [x: string]: unknown;
  }
> extends CallToolResult {
  structuredContent?: T | undefined;
  isError?: true;
}

export function asToolResponse<
  T extends {
    [x: string]: unknown;
  }
>(payload: T | StructuredResponse, opts?: {isError?: true}): StructuredResponse<T> {
  if (isObject(payload)) {
    if ("content" in payload || "structuredContent" in payload) {
      return payload as StructuredResponse<T>;
    }

    payload = serialize(payload, {useAlias: true, groups: ["tools"]});

    return {
      ...opts,
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(payload, null, 2)
        }
      ],
      structuredContent: payload as T
    };
  }

  return {
    ...opts,
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(payload, null, 2)
      }
    ]
  };
}
