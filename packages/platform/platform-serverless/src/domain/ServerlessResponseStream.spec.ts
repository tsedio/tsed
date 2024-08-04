import {ServerlessResponseStream} from "./ServerlessResponseStream";

describe("ServerlessResponseStream", () => {
  describe("streamifyResponse", () => {
    describe("when isInAWS", () => {
      beforeEach(() => {
        // @ts-ignore
        globalThis.awslambda = {
          streamifyResponse: jest.fn().mockImplementation((handler) => handler)
        };
      });
      afterEach(() => {
        // @ts-ignore
        delete globalThis.awslambda;
      });

      it("should wrap then handler without fallback responseStream", async () => {
        const handler = jest.fn();
        const event = {};
        const context = {};
        const responseStream = new ServerlessResponseStream();

        jest.spyOn(ServerlessResponseStream as any, "buildResponse").mockReturnValue({});

        const wrapped = ServerlessResponseStream.streamifyResponse(handler);

        const result = await wrapped(event as any, responseStream, context as any);

        expect(result).toEqual(undefined);
        expect(handler).toHaveBeenCalledWith(event, responseStream, context);
        // @ts-expect-error
        expect(ServerlessResponseStream.buildResponse).not.toHaveBeenCalled();
      });
      it("should wrap then handler with fallback responseStream", async () => {
        const handler = jest.fn();
        const event = {};
        const context = {};

        jest.spyOn(ServerlessResponseStream as any, "buildResponse").mockReturnValue({
          statusCode: 200
        });
        jest.spyOn(console, "warn").mockReturnValue(undefined);

        const wrapped = ServerlessResponseStream.streamifyResponse(handler);

        const result = await wrapped(event as any, context as any);

        expect(handler).toHaveBeenCalledWith(event, expect.any(ServerlessResponseStream), context);

        expect(result).toEqual({
          statusCode: 200
        });
        // @ts-expect-error
        expect(ServerlessResponseStream.buildResponse).toHaveBeenCalledWith(expect.any(ServerlessResponseStream));
        expect(console.warn).toHaveBeenCalledWith({
          event: "WRONG_AWS_STREAM_CONFIGURATION",
          message:
            "The lambda didn't receive a ResponseStream from AWS. Ts.ED therefore generated a ServerlessResponseStream as a fallback. This mode is not optimized for use in PRODUCTION. Please check the AWS configuration of your lambda."
        });
      });
    });
  });
});
