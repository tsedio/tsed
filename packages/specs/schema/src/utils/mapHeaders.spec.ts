import {mapHeaders} from "./mapHeaders";

describe("mapHeaders", () => {
  it("should map headers", () => {
    expect(
      mapHeaders({
        key: "value"
      })
    ).toEqual({
      key: {
        example: "value",
        type: "string"
      }
    });

    expect(
      mapHeaders({
        key: 1
      })
    ).toEqual({
      key: {
        example: 1,
        type: "number"
      }
    });

    expect(
      mapHeaders({
        key: {
          description: "test",
          value: 1
        }
      })
    ).toEqual({
      key: {
        description: "test",
        example: 1,
        type: "number"
      }
    });

    expect(
      mapHeaders({
        key: {
          description: "test",
          example: 1
        }
      } as any)
    ).toEqual({
      key: {
        description: "test",
        example: 1,
        type: "number"
      }
    });
  });
});
