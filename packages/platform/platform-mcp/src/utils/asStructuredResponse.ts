import {serialize} from "@tsed/json-mapper";
import {isObject} from "@tsed/core";

export interface StructuredResponse<T> {
  content: {type: string; text: string}[];
  structuredContent?: T;
  isError?: true;
}

export function asStructuredResponse<T extends object>(
  payload: T | StructuredResponse<unknown>,
  opts?: {isError?: true}
): StructuredResponse<T> {
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
