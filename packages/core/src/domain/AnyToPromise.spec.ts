import {catchAsyncError, isStream} from "@tsed/core";
import {expect} from "chai";
import {createReadStream} from "fs";
import {of} from "rxjs";
import {AnyToPromise, AnyToPromiseStatus} from "./AnyToPromise";

describe("AnyToPromise", () => {
  it("should handle sync value", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return "test";
    });

    expect(result).to.deep.equal({state: "RESOLVED", data: "test", type: "DATA"});
  });
  it("should handle async value", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(async () => {
      return "test";
    });

    expect(result).to.deep.equal({state: "RESOLVED", data: "test", type: "DATA"});
  });
  it("should handle canceled async value", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(async () => {
      return AnyToPromiseStatus.CANCELED;
    });

    expect(result).to.deep.equal({state: "CANCELED"});
  });
  it("should handle response with data", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(async () => {
      return {
        data: "data",
        headers: {
          "Content-Type": "type"
        },
        status: 200,
        statusText: "OK"
      };
    });

    expect(result).to.deep.equal({
      state: "RESOLVED",
      data: "data",
      headers: {
        "Content-Type": "type"
      },
      status: 200,
      type: "DATA"
    });
  });
  it("should handle async undefined value", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(async () => {
      return undefined;
    });

    expect(result).to.deep.equal({state: "RESOLVED", data: undefined, type: "DATA"});
  });
  it("should handle observable", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return of("test");
    });

    expect(result).to.deep.equal({state: "RESOLVED", data: "test", type: "DATA"});
  });
  it("should handle buffer", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return Buffer.from("test");
    });

    expect(Buffer.isBuffer(result.data)).to.equal(true);
    expect(result.type).to.equal("BUFFER");
  });
  it("should handle stream", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return createReadStream(__dirname + "/__mock__/response.txt");
    });

    expect(result.type).to.equal("STREAM");
    expect(isStream(result.data)).to.equal(true);
  });

  it("should catch error", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(async () => {
      return "test";
    });

    expect(result).to.deep.equal({state: "RESOLVED", data: "test", type: "DATA"});
  });

  it("should handle async error", async () => {
    const resolver = new AnyToPromise();

    const error = await catchAsyncError(() => {
      return resolver.call(async () => {
        throw new Error("test");
      });
    });

    expect(error?.message).to.deep.equal("test");
  });

  it("should handle sync error", async () => {
    const resolver = new AnyToPromise();

    const error = await catchAsyncError(() => {
      return resolver.call(() => {
        throw new Error("test");
      });
    });

    expect(error?.message).to.deep.equal("test");
  });

  it("should handle next callback with error", async () => {
    const resolver = new AnyToPromise();
    const {next} = resolver;

    const error = await catchAsyncError(() => {
      return resolver.call(async () => {
        next(new Error("test"));
      });
    });

    expect(error?.message).to.deep.equal("test");
  });
});
