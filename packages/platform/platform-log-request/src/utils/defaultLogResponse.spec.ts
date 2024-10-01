import {defaultLogResponse} from "./defaultLogResponse.js";

describe("defaultLogEnd", () => {
  it("should log the request end", () => {
    // GIVEN
    const $ctx = {
      response: {
        statusCode: 200
      },
      logger: {
        info: vi.fn()
      }
    };

    // WHEN
    defaultLogResponse($ctx as any);

    // THEN
    expect($ctx.logger.info).toHaveBeenCalledWith({
      event: "request.end",
      status: 200,
      status_code: "200",
      state: "OK"
    });
  });
  it("should log the request end with error", () => {
    // GIVEN
    const $ctx = {
      response: {
        statusCode: 500
      },
      error: {
        name: "name",
        message: "message",
        errors: "errors",
        stack: "stack",
        body: "body",
        headers: "headers"
      },
      logger: {
        error: vi.fn()
      }
    };

    // WHEN
    defaultLogResponse($ctx as any);

    // THEN
    expect($ctx.logger.error).toHaveBeenCalledWith({
      event: "request.end",
      status: 500,
      status_code: "500",
      state: "KO",
      error_name: "name",
      error_message: "message",
      error_errors: "errors",
      error_stack: "stack",
      error_body: "body",
      error_headers: "headers"
    });
  });
  it("should log the request end with error code", () => {
    // GIVEN
    const $ctx = {
      response: {
        statusCode: 500
      },
      error: {
        code: "code",
        message: "message",
        errors: "errors",
        stack: "stack",
        body: "body",
        headers: "headers"
      },
      logger: {
        error: vi.fn()
      }
    };

    // WHEN
    defaultLogResponse($ctx as any);

    // THEN
    expect($ctx.logger.error).toHaveBeenCalledWith({
      event: "request.end",
      status: 500,
      status_code: "500",
      state: "KO",
      error_name: "code",
      error_message: "message",
      error_errors: "errors",
      error_stack: "stack",
      error_body: "body",
      error_headers: "headers"
    });
  });
});
