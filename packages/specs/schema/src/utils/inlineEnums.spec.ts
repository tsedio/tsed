import {inlineEnums} from "./inlineEnums";

describe("inlineEnums()", () => {
  it("should inline enums", () => {
    const result = inlineEnums(
      {
        enum: {
          $isJsonDocument: true,
          toJSON() {
            return {enum: ["type"]};
          }
        }
      },
      {} as any,
      {inlineEnums: true}
    );

    expect(result).toEqual({
      enum: ["type"],
      type: "string"
    });
  });

  it("should inline enums and set type (object to string)", () => {
    const result = inlineEnums(
      {
        type: "object",
        enum: {
          $isJsonDocument: true,
          toJSON() {
            return {enum: ["type"]};
          }
        }
      },
      {} as any,
      {inlineEnums: true}
    );

    expect(result).toEqual({
      type: "string",
      enum: ["type"]
    });
  });
  it("should inline enums and keep the type", () => {
    const result = inlineEnums(
      {
        type: "string",
        enum: {
          $isJsonDocument: true,
          toJSON() {
            return {enum: ["type"]};
          }
        }
      },
      {} as any,
      {inlineEnums: true}
    );

    expect(result).toEqual({
      type: "string",
      enum: ["type"]
    });
  });
});
