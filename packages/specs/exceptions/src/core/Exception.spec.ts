import {Exception, HTTPException} from "./Exception.js";
import {StatusFamily} from "./StatusFamily.js";

describe("Exception", () => {
  it("should use origin", () => {
    const exception = new Exception(undefined, "test", new Error("test"));

    exception.setHeader("key", "value");

    expect(exception.headers).toEqual({
      key: "value"
    });
    expect(exception.status).toEqual(500);
    expect(exception.toString()).toEqual("INTERNAL_SERVER_ERROR(500): test, innerException: test");
  });

  it("should use origin (inner)", () => {
    const exception = new Exception(203, "test", new Error("test"));
    exception.setHeaders({key: "value"});

    expect(exception.headers).toEqual({
      key: "value"
    });
    expect(exception.status).toEqual(203);
    expect(exception.toString()).toEqual("NON_AUTHORITATIVE_INFORMATION(203): test, innerException: test");
  });

  it("should use origin as string (inner)", () => {
    const exception = new Exception(203, "test", "test");

    expect(exception.status).toEqual(203);
    expect(exception.toString()).toEqual("NON_AUTHORITATIVE_INFORMATION(203): test, innerException: test");
  });

  it("should use origin as string", () => {
    const exception = new Exception(203, "test", {});

    expect(exception.status).toEqual(203);
    expect(exception.toString()).toEqual("NON_AUTHORITATIVE_INFORMATION(203): test");
    expect(exception.body).toEqual({});
  });

  it("should return empty message when message parameters is undefined", () => {
    const exception = new Exception(203, undefined);

    expect(exception.status).toEqual(203);
    expect(exception.toString()).toEqual("NON_AUTHORITATIVE_INFORMATION(203):");
  });

  it("should allow declaring custom status", () => {
    class GatewayUserNotFoundError extends HTTPException {
      public static readonly STATUS = 524;

      constructor(message: string, origin?: Error | string | any) {
        super(GatewayUserNotFoundError.STATUS, message, origin);
      }
    }

    const error = new GatewayUserNotFoundError("test");

    expect(error.name).toEqual("GATEWAY_USER_NOT_FOUND_ERROR");
  });

  it("should throw exception if status code is less than 100", () => {
    try {
      Exception.validate(90, StatusFamily["4xx"]);
    } catch (e) {
      expect(e.message).toContain("between 100 and 599");
    }
  });

  it("should throw exception if status code is more than 599", () => {
    try {
      Exception.validate(600, StatusFamily["4xx"]);
    } catch (e) {
      expect(e.message).toContain("between 100 and 599");
    }
  });

  it("should throw exception if status code does not belong to family", () => {
    try {
      Exception.validate(519, StatusFamily["4xx"]);
    } catch (e) {
      expect(e.message).toContain("does not belong to the family");
    }
  });

  it("should validate the status code", () => {
    const code = Exception.validate(419, StatusFamily["4xx"]);
    expect(code).toEqual(419);
  });
});
