import {parseDocumentationAttributes} from "./parseDocumentationAttributes.js";

describe("parseDocumentationAttributes", () => {
  it("should ignore undefined comment", () => {
    expect(parseDocumentationAttributes(undefined)).toEqual([]);
  });
  it("should parse @TsED.Email()", () => {
    expect(parseDocumentationAttributes("/// @TsED.Email()")).toEqual([
      {
        arguments: [],
        content: "@TsED.Email()",
        name: "Email"
      }
    ]);
  });
  it("should parse @TsED.Ignore(endpoint = true)", () => {
    expect(parseDocumentationAttributes("/// @TsED.Ignore(ctx.endpoint === true)")).toEqual([
      {
        arguments: ["(value: any, ctx: any) => ctx.endpoint === true"],
        content: "@TsED.Ignore(ctx.endpoint === true)",
        name: "Ignore"
      }
    ]);
  });
  it("should parse @TsED.Ignore()", () => {
    expect(parseDocumentationAttributes("/// @TsED.Ignore()")).toEqual([
      {
        arguments: [],
        content: "@TsED.Ignore()",
        name: "Ignore"
      }
    ]);
  });
  it('should parse @TsED.Groups("!creation")', () => {
    expect(parseDocumentationAttributes('/// @TsED.Groups("!creation")')).toEqual([
      {
        arguments: ['"!creation"'],
        content: '@TsED.Groups("!creation")',
        name: "Groups"
      }
    ]);
  });
  it('should parse @TsED.Groups(type: "test")', () => {
    expect(parseDocumentationAttributes('/// @TsED.Groups(type: "test")')).toEqual([
      {
        arguments: [
          {
            type: "test"
          }
        ],
        content: '@TsED.Groups(type: "test")',
        name: "Groups"
      }
    ]);
  });
  it("should ignore other comments", () => {
    expect(parseDocumentationAttributes("/// comments")).toEqual([]);
  });
});
