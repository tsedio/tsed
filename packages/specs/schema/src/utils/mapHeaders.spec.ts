import {mapHeaders} from "@tsed/schema";
import {expect} from "chai";

describe("mapHeaders", () => {
  it("should map headers", () => {
    expect(
      mapHeaders({
        key: "value"
      })
    ).to.deep.equal({
      key: {
        example: "value",
        type: "string"
      }
    });

    expect(
      mapHeaders({
        key: 1
      })
    ).to.deep.equal({
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
    ).to.deep.equal({
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
    ).to.deep.equal({
      key: {
        description: "test",
        example: 1,
        type: "number"
      }
    });
  });
});
