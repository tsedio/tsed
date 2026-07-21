import {serialize} from "@tsed/json-mapper";
import {isObject} from "@tsed/core";
import type {ReadResourceResult} from "@modelcontextprotocol/server";

export function asResourceResponse(
  uri: string,
  payload: Record<string, unknown> | ReadResourceResult,
  opts?: {isError?: boolean}
): ReadResourceResult {
  if (payload.contents) {
    return payload as ReadResourceResult;
  }

  const contents: ReadResourceResult["contents"] = [];

  if (opts?.isError) {
    contents.push({
      uri,
      mimeType: "plain/text" as const,
      text: (payload as any).message || ""
    });
  }

  if (isObject(payload)) {
    payload = serialize(payload, {useAlias: true, groups: ["resources"]});
    contents.push({
      uri,
      mimeType: "application/json" as const,
      text: JSON.stringify(payload, null, 2)
    });
  }

  return {
    contents
  };
}
