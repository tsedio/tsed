import {asToolResponse} from "./asToolResponse.js";

describe("asStructuredResponse", () => {
  it("should expose object payloads as text and structured content", () => {
    expect(asToolResponse({id: "tool-id"})).toEqual({
      content: [{type: "text", text: '{\n  "id": "tool-id"\n}'}],
      structuredContent: {id: "tool-id"}
    });
  });

  it("should preserve an existing structured response", () => {
    const response = {content: [{type: "text", text: "ready"}], structuredContent: {ready: true}};

    expect(asToolResponse(response)).toBe(response);
  });

  it("should mark structured error responses", () => {
    expect(asToolResponse({message: "boom"}, {isError: true})).toEqual({
      isError: true,
      content: [{type: "text", text: '{\n  "message": "boom"\n}'}],
      structuredContent: {message: "boom"}
    });
  });

  it("should expose primitive payloads as text-only content", () => {
    expect(asToolResponse("ready" as never)).toEqual({
      content: [{type: "text", text: '"ready"'}]
    });
  });
});
