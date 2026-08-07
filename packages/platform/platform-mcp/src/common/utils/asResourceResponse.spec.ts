import {asResourceResponse} from "./asResourceResponse.js";

describe("asResponse", () => {
  it("should return a JSON content item for object payloads", () => {
    expect(asResourceResponse("tsed://resource", {id: "resource-id"})).toEqual({
      contents: [
        {
          uri: "tsed://resource",
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

    expect(asResourceResponse("tsed://ignored", response)).toBe(response);
  });

  it("should add a text error item before the JSON error payload", () => {
    expect(asResourceResponse("tsed://resource", {message: "boom"}, {isError: true})).toEqual({
      contents: [
        {uri: "tsed://resource", mimeType: "plain/text", text: "boom"},
        {uri: "tsed://resource", mimeType: "application/json", text: '{\n  "message": "boom"\n}'}
      ]
    });
  });
});
