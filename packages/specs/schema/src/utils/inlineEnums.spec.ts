import {inlineEnums} from "./inlineEnums";

describe("inlineEnums()", () => {
  it("should inline enums", () => {
    const result = inlineEnums(
      {
        enum: {
          isJsonSchema: true,
          toJSON() {
            return {enum: ["type"]};
          }
        }
      },
      {} as any,
      {inlineEnums: true}
    );

    expect(result).toEqual({
      enum: ["type"]
    });
  });
});
