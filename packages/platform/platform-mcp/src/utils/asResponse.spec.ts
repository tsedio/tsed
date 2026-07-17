import {asResponse} from "./asResponse.js";

describe("asResponse", () => {
  it("should return a JSON content item for object payloads", () => {
    expect(asResponse("tsed://resource", {id: "resource-id"})).toEqual({
      contents: [
        {
          url: "tsed://resource",
          mimeType: "application/json",
          text: '{\n  "id": "resource-id"\n}'
        }
      ]
    });
  });

  it("should preserve an existing resource response", () => {
    const response = {
      contents: [{url: "tsed://resource", mimeType: "text/plain", text: "ready"}]
    };

    expect(asResponse("tsed://ignored", response)).toBe(response);
  });

  it("should add a text error item before the JSON error payload", () => {
    expect(asResponse("tsed://resource", {message: "boom"}, {isError: true})).toEqual({
      contents: [
        {url: "tsed://resource", mimeType: "plain/text", text: "boom"},
        {url: "tsed://resource", mimeType: "application/json", text: '{\n  "message": "boom"\n}'}
      ]
    });
  });
});
