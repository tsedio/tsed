import {PlatformTest} from "@tsed/common";
import {PlatformFastifyResponse} from "./PlatformFastifyResponse";

function createResponse() {
  const response = PlatformTest.createResponse();
  response.code = response.status;
  response.type = response.contentType;
  response.header = response.set;

  const ctx = PlatformTest.createRequestContext({
    event: {
      response
    },
    ResponseKlass: PlatformFastifyResponse
  });

  return {res: response, response: ctx.response};
}

describe("PlatformFastifyResponse", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should create a PlatformResponse instance", () => {
    const {res, response} = createResponse();

    expect(response.raw).toEqual(res);
  });

  describe("getRes()", () => {
    it("return res", async () => {
      const {res, response} = createResponse();
      res.raw = {};

      const result = await response.getRes();

      expect(result).toEqual(res.raw);
    });
  });
  describe("statusCode", () => {
    it("return statusCode", () => {
      const {response} = createResponse();

      response.status(302);

      expect(response.statusCode).toEqual(302);
    });
  });
  describe("contentType()", () => {
    it("should set contentType", () => {
      const {res, response} = createResponse();

      response.contentType("text/html");

      expect(res.headers).toEqual({"content-type": "text/html", "x-request-id": "id"});
    });
  });
  describe("body()", () => {
    it("should set body", () => {
      const {res, response} = createResponse();

      response.body("body");

      expect(res.data).toEqual("body");
    });
  });

  describe("stream()", () => {
    it("should set body", () => {
      const {res, response} = createResponse();

      response.stream("body");

      expect(res.data).toEqual("body");
    });
  });
  describe("location", () => {
    it("should set header location", () => {
      const {res, response} = createResponse();

      response.location("https://location");

      expect(res.headers).toEqual({
        location: "https://location",
        "x-request-id": "id"
      });
    });

    it("should go back based on Referrer", async () => {
      const {res, response} = createResponse();

      response.request.raw.headers["referrer"] = "https://location/back";

      await response.location("back");

      expect(res.headers).toEqual({
        location: "https://location/back",
        "x-request-id": "id"
      });
    });

    it("should go back based on default path", async () => {
      const {res, response} = createResponse();

      await response.location("back");

      expect(res.headers).toEqual({
        location: "/",
        "x-request-id": "id"
      });
    });
  });
});
