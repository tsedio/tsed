import {getRequestId} from "./getRequestId.js";

describe("getRequestId", () => {
  it("should return request id (uuid)", () => {
    const event: any = {};
    const context: any = {};

    expect(typeof getRequestId(event, context)).toEqual("string");
  });

  it("should return request id (requestId)", () => {
    const event: any = {
      requestContext: {
        requestId: "requestId"
      }
    };
    const context: any = {};

    expect(getRequestId(event, context)).toEqual("requestId");
  });

  it("should return request id (awsRequestId)", () => {
    const event: any = {};
    const context: any = {
      awsRequestId: "awsRequestId"
    };

    expect(getRequestId(event, context)).toEqual("awsRequestId");
  });

  it("should return request id (headers)", () => {
    const event: any = {
      headers: {
        "x-request-id": "x-request-id"
      }
    };
    const context: any = {
      awsRequestId: "awsRequestId"
    };

    expect(getRequestId(event, context)).toEqual("x-request-id");
  });
});
