import {Request} from "express";
import bytes from "bytes";

const limit = bytes.parse("100kb");

function isLimitReached(length: number | null) {
  return limit !== null && length !== null && length > limit;
}

function getContentLength(request: Request & {rawBody: string}) {
  const contentLength: any = request.get("content-length");
  return contentLength != null && !isNaN(contentLength) ? parseInt(contentLength, 10) : null;
}

export function rawBodyMiddleware(request: Request & {rawBody: string}, response: any, next: any) {
  if (request.method !== "GET") {
    const length = getContentLength(request);

    if (!isLimitReached(length) && request.is(["application/x-www-form-urlencoded", "application/json"])) {
      request.rawBody = "";
      request.on("data", (chunk: string) => {
        request.rawBody += chunk;
      });
    }
  }

  next();
}
