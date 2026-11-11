import {PlatformBuilder} from "@tsed/platform-http";
import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {PlatformFastify} from "./PlatformFastify.js";

class Server {}

describe("PlatformFastify", () => {
  describe("create()", () => {
    it("should create platform", () => {
      const platform = PlatformFastify.create(Server, {});

      expect(platform.adapter).toBeInstanceOf(PlatformFastify);
    });

    it("should create platform from settings", () => {
      const platform = PlatformFastify.create({httpPort: 8080});

      expect(platform.adapter).toBeInstanceOf(PlatformFastify);
    });
  });
  describe("bootstrap()", () => {
    it("should create platform", async () => {
      const platform = await PlatformFastify.bootstrap(Server, {});

      expect(platform.adapter).toBeInstanceOf(PlatformFastify);
    });

    it("should create platform from settings", async () => {
      const bootstrap = vi.spyOn(PlatformBuilder.prototype, "bootstrap").mockResolvedValue({} as never);

      await PlatformFastify.bootstrap({httpPort: false});

      expect(bootstrap).toHaveBeenCalledOnce();
      vi.resetAllMocks();
    });
  });
  describe("mapHandler() for a middleware", () => {
    function map(handler: () => unknown) {
      const {adapter} = PlatformFastify.create(Server, {});
      const metadata = new PlatformHandlerMetadata({handler, type: PlatformHandlerType.MIDDLEWARE});

      return adapter.mapHandler(handler, metadata) as (request: any, response: any, done: (err?: unknown) => void) => unknown;
    }

    function createRequest() {
      return {$ctx: {isDone: () => false}};
    }

    it("should call done() in the same tick when the handler is synchronous", () => {
      const done = vi.fn();

      map(() => "result")(createRequest(), {}, done);

      expect(done).toHaveBeenCalledWith();
    });

    it("should pass a synchronous error to done()", async () => {
      const error = new Error("sync failure");
      const done = vi.fn();

      map(() => {
        throw error;
      })(createRequest(), {}, done);

      await vi.waitFor(() => expect(done).toHaveBeenCalledWith(error));
    });

    it("should pass an asynchronous rejection to done()", async () => {
      const error = new Error("async failure");
      const done = vi.fn();

      map(() => Promise.reject(error))(createRequest(), {}, done);

      await vi.waitFor(() => expect(done).toHaveBeenCalledWith(error));
    });
  });
});
