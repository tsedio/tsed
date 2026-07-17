import {serialize} from "@tsed/json-mapper";
import {isObject} from "@tsed/core";

export interface UnstructuredResponse {
  contents: {url: string; mimeType: string; text: string}[];
}

export function asResponse(
  url: string,
  payload: Record<string, unknown> | UnstructuredResponse,
  opts?: {isError?: boolean}
): UnstructuredResponse {
  if (payload.contents) {
    return payload as UnstructuredResponse;
  }

  const contents: UnstructuredResponse["contents"] = [];

  if (opts?.isError) {
    contents.push({
      url,
      mimeType: "plain/text" as const,
      text: (payload as any).message || ""
    });
  }

  if (isObject(payload)) {
    payload = serialize(payload, {useAlias: true, groups: ["resources"]});
    contents.push({
      url,
      mimeType: "application/json" as const,
      text: JSON.stringify(payload, null, 2)
    });
  }

  return {
    contents
  };
}
