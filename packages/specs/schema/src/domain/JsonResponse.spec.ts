import {JsonResponse} from "./JsonResponse.js";

describe("JsonResponse", () => {
  describe("isBinary()", () => {
    it("should return true when the response as application/octet-stream", () => {
      const result = new JsonResponse({
        content: {
          "application/octet-stream": {
            schema: {
              format: "binary",
              type: "string"
            }
          }
        }
      } as never);

      expect(result.isBinary()).toEqual(true);
    });
    it("should return false when the response as application/json", () => {
      const result = new JsonResponse({
        content: {
          "application/json": {
            schema: {
              type: "string"
            }
          }
        }
      } as never);

      expect(result.isBinary()).toEqual(false);
    });
  });
});
