import {isNodeStream, isStream, isWebStream} from "./isStream.js";
import {PassThrough} from "node:stream";

describe("isStream", () => {
  it("should identify Node.js streams", () => {
    const stream = new PassThrough();

    expect(isStream(stream)).toBe(true);
    expect(isNodeStream(stream)).toBe(true);
    expect(isWebStream(stream)).toBe(false);
  });

  it("should identify standard Web ReadableStreams", () => {
    const stream = new ReadableStream();

    expect(isStream(stream)).toBe(true);
    expect(isNodeStream(stream)).toBe(false);
    expect(isWebStream(stream)).toBe(true);
  });

  it("should reject non-stream values", () => {
    expect(isStream({})).toBe(false);
  });
});
