import {SdkErrorCode, SdkHttpError} from "@modelcontextprotocol/client";
import {isUpstreamSessionLost} from "./isUpstreamSessionLost.js";

/**
 * Builds the error thrown by the MCP client for an HTTP status.
 */
function httpError(status: number) {
  return new SdkHttpError(SdkErrorCode.ClientHttpNotImplemented, "Error POSTing to endpoint", {status, statusText: ""});
}

describe("isUpstreamSessionLost()", () => {
  it.each([
    ["a 404 on a session", httpError(404), "session", true],
    ["a 404 without session", httpError(404), undefined, false],
    ["another status on a session", httpError(500), "session", false],
    ["an error without status", new Error("boom"), "session", false],
    ["no error", undefined, "session", false]
  ])("should return %s", (_, error, sessionId, expected) => {
    expect(isUpstreamSessionLost(error, {transport: {sessionId} as never})).toBe(expected);
  });

  it("should return false for a client without transport", () => {
    expect(isUpstreamSessionLost(httpError(404), {transport: undefined})).toBe(false);
  });
});
