import {Get, Ignore, Property, Returns, View, s} from "@tsed/schema";
import {Context} from "@tsed/platform-params";
import {PlatformResponseFilter} from "./PlatformResponseFilter.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {ResponseFilter} from "../decorators/responseFilter.js";
import {ResponseFilterMethods} from "../interfaces/ResponseFilterMethods.js";
import {catchAsyncError} from "@tsed/core";

@ResponseFilter("custom/json")
class CustomJsonFilter implements ResponseFilterMethods {
  transform(data: unknown, ctx: Context) {
    return {data};
  }
}

@ResponseFilter("application/json")
class ApplicationJsonFilter implements ResponseFilterMethods {
  transform(data: unknown, ctx: Context) {
    return {data, "content-type": "application/json"};
  }
}

@ResponseFilter("async/json")
class AsyncJsonFilter implements ResponseFilterMethods {
  async transform(data: unknown, ctx: Context) {
    return {async: data};
  }
}

@ResponseFilter("*/*")
class AllFilter implements ResponseFilterMethods {
  transform(data: unknown, ctx: Context) {
    return {data, "content-type": "*/*"};
  }
}

describe("PlatformResponseFilter", () => {
  describe("transform() with registered filters", () => {
    describe("when filter list is given", () => {
      beforeEach(() =>
        PlatformTest.create({
          responseFilters: [CustomJsonFilter, AllFilter, ApplicationJsonFilter]
        })
      );
      afterEach(() => PlatformTest.reset());

      it("should transform data for custom/json", async () => {
        class Test {
          @Get("/")
          test() {}
        }

        const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

        const ctx = PlatformTest.createRequestContext();
        ctx.endpoint = s.store.method(Test, "test");
        const data = {text: "test"};

        vi.spyOn(ctx.response, "contentType").mockReturnThis();
        vi.spyOn(ctx.response, "get").mockReturnValue(undefined);
        vi.spyOn(ctx.request, "get").mockReturnValue("custom/json");
        vi.spyOn(ctx.request, "accepts").mockReturnValue(["custom/json"]);

        const result = await platformResponseFilter.transform(data, ctx);

        expect(result).toEqual({
          data: {
            text: "test"
          }
        });
      });
      it("should transform data for application/json", async () => {
        class Test {
          @Get("/")
          test() {}
        }

        const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

        const ctx = PlatformTest.createRequestContext();
        ctx.endpoint = s.store.method(Test, "test");
        const data = {text: "test"};

        vi.spyOn(ctx.response, "contentType").mockReturnThis();
        vi.spyOn(ctx.response, "get").mockReturnValue(undefined);
        vi.spyOn(ctx.request, "get").mockReturnValue("application/json");
        vi.spyOn(ctx.request, "accepts").mockReturnValue(["application/json"]);

        const result = await platformResponseFilter.transform(data, ctx);

        expect(result).toEqual({
          "content-type": "application/json",
          data: {
            text: "test"
          }
        });
      });
      it("should return data without transformation", async () => {
        class Test {
          @Get("/")
          test() {}
        }

        const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

        const ctx = PlatformTest.createRequestContext();
        const data = {text: "test"};

        vi.spyOn(ctx.response, "contentType").mockReturnThis();
        vi.spyOn(ctx.response, "get").mockReturnValue(undefined);
        vi.spyOn(ctx.request, "get").mockReturnValue("application/json");
        vi.spyOn(ctx.request, "accepts").mockReturnValue(["application/json"]);

        const result = await platformResponseFilter.transform(data, ctx);

        expect(result).toEqual({
          text: "test"
        });
      });
      it("should get content-type set from response", async () => {
        class Test {
          @Get("/")
          test() {}
        }

        const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

        const ctx = PlatformTest.createRequestContext();
        ctx.endpoint = s.store.method(Test, "test");
        const data = {text: "test"};

        vi.spyOn(ctx.response, "contentType").mockReturnThis();
        vi.spyOn(ctx.response, "get").mockReturnValue("text/json; charset: utf-8");
        vi.spyOn(ctx.request, "get").mockReturnValue("application/json");
        vi.spyOn(ctx.request, "accepts").mockReturnValue(["application/json"]);

        const result = await platformResponseFilter.transform(data, ctx);

        expect(result).toEqual({
          "content-type": "application/json",
          data: {
            text: "test"
          }
        });
      });
      it("should transform data for any content type", async () => {
        class Test {
          @Get("/")
          test() {}
        }

        const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

        const ctx = PlatformTest.createRequestContext();
        const data = {text: "test"};
        ctx.endpoint = s.store.method(Test, "test");

        vi.spyOn(ctx.response, "contentType").mockReturnThis();
        vi.spyOn(ctx.response, "get").mockReturnValue(undefined);
        vi.spyOn(ctx.request, "get").mockReturnValue("*/*");
        vi.spyOn(ctx.request, "accepts").mockReturnValue(["application/json"]);

        const result = await platformResponseFilter.transform(data, ctx);

        expect(result).toEqual({
          "content-type": "application/json",
          data: {
            text: "test"
          }
        });
      });
    });
    describe("when filter list is not given", () => {
      beforeEach(() =>
        PlatformTest.create({
          responseFilters: [AllFilter]
        })
      );
      afterEach(() => PlatformTest.reset());
      it("should transform data for default content-type from metadata", async () => {
        class Test {
          @Get("/")
          @(Returns(200).ContentType("application/json"))
          test() {}
        }

        const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

        const ctx = PlatformTest.createRequestContext();
        const data = {text: "test"};
        ctx.endpoint = s.store.method(Test, "test");

        vi.spyOn(ctx.response, "contentType").mockReturnThis();
        vi.spyOn(ctx.response, "get").mockReturnValue(undefined);
        vi.spyOn(ctx.request, "get").mockReturnValue(undefined);
        vi.spyOn(ctx.request, "accepts").mockReturnValue(false);

        const result = await platformResponseFilter.transform(data, ctx);

        expect(result).toEqual({
          "content-type": "*/*",
          data: {
            text: "test"
          }
        });
      });
      it("should transform data for default content-type from metadata with any response filter", async () => {
        class Test {
          @Get("/")
          @(Returns(200).ContentType("application/json"))
          test() {}
        }

        const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

        const ctx = PlatformTest.createRequestContext();
        const data = {text: "test"};
        ctx.endpoint = s.store.method(Test, "test");

        vi.spyOn(ctx.response, "contentType").mockReturnThis();
        vi.spyOn(ctx.response, "get").mockReturnValue(undefined);
        vi.spyOn(ctx.request, "get").mockReturnValue(undefined);
        vi.spyOn(ctx.request, "accepts").mockReturnValue(false);

        const result = await platformResponseFilter.transform(data, ctx);

        expect(result).toEqual({
          "content-type": "*/*",
          data: {
            text: "test"
          }
        });
      });
    });
  });
  describe("transform() without registered filters", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should transform value", async () => {
      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = PlatformTest.createRequestContext();

      const result = await platformResponseFilter.transform({test: "test"}, ctx);

      expect(result).toEqual({test: "test"});
    });
    it("should transform value (endpoint)", async () => {
      class Test {
        @Get("/")
        test() {}
      }

      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = PlatformTest.createRequestContext();
      ctx.endpoint = s.store.method(Test, "test");

      vi.spyOn(ctx.endpoint, "getResponseOptions");

      const result = await platformResponseFilter.transform({test: "test"}, ctx);

      expect(result).toEqual({test: "test"});
      expect(ctx.endpoint.getResponseOptions).toHaveBeenCalledWith(200, {includes: undefined});
    });
    it("should transform value (endpoint + includes)", async () => {
      class Test {
        @Get("/")
        test() {}
      }

      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = PlatformTest.createRequestContext();
      ctx.endpoint = s.store.method(Test, "test");

      vi.spyOn(ctx.endpoint, "getResponseOptions");

      ctx.request.query.includes = [];

      const result = await platformResponseFilter.transform({test: "test"}, ctx);

      expect(result).toEqual({test: "test"});
      expect(ctx.endpoint.getResponseOptions).toHaveBeenCalledWith(200, {includes: []});
    });
    it("should transform value (endpoint + includes with ,)", async () => {
      class Test {
        @Get("/")
        test() {}
      }

      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = PlatformTest.createRequestContext();
      ctx.endpoint = s.store.method(Test, "test");

      vi.spyOn(ctx.endpoint, "getResponseOptions");

      ctx.request.query.includes = ["test,test2"];

      const result = await platformResponseFilter.transform({test: "test"}, ctx);

      expect(result).toEqual({test: "test"});
      expect(ctx.endpoint.getResponseOptions).toHaveBeenCalledWith(200, {
        includes: ["test", "test2"]
      });
    });
    it("should transform value (endpoint - view)", async () => {
      class Test {
        @Get("/")
        @View("test.pug")
        test() {}
      }

      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = PlatformTest.createRequestContext();
      ctx.endpoint = s.store.method(Test, "test");
      vi.spyOn(ctx.response, "render").mockResolvedValue("template");

      const result = await platformResponseFilter.transform({test: "test"}, ctx);

      expect(result).toEqual("template");
    });
    it("should transform value (endpoint - view - error)", async () => {
      class Test {
        @Get("/")
        @View("test.pug")
        test() {}
      }

      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = PlatformTest.createRequestContext();
      ctx.endpoint = s.store.method(Test, "test");
      vi.spyOn(ctx.response, "render").mockRejectedValue(new Error("parsing error"));

      const result = await catchAsyncError(() => platformResponseFilter.transform({test: "test"}, ctx));

      expect(result?.message).toEqual("Template rendering error: Test.test()\nError: parsing error");
    });

    it("should render content", async () => {
      class Model {
        @Property()
        data: string;

        @Ignore()
        test: string;
      }

      class Test {
        @Get("/")
        @View("view", {options: "options"})
        @Returns(200, Model)
        test() {}
      }

      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = PlatformTest.createRequestContext();

      ctx.endpoint = s.store.method(Test, "test");

      vi.spyOn(ctx.response, "render").mockResolvedValue("HTML");

      ctx.data = {data: "data"};

      await platformResponseFilter.transform(ctx.data, ctx);

      expect(ctx.response.render).toHaveBeenCalledWith("view", {
        $ctx: ctx,
        data: "data",
        options: "options"
      });
    });
    it("should render content and throw an error", async () => {
      class Test {
        @Get("/")
        @View("view", {options: "options"})
        test() {}
      }

      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = PlatformTest.createRequestContext();
      ctx.endpoint = s.store.method(Test, "test");

      vi.spyOn(ctx.response, "render").mockRejectedValue(new Error("parser error"));

      ctx.data = {data: "data"};

      let actualError: any = await catchAsyncError(() => platformResponseFilter.transform(ctx.data, ctx));

      expect(actualError.message).toEqual("Template rendering error: Test.test()\nError: parser error");
    });
  });

  describe("resolveBody()", () => {
    afterEach(() => PlatformTest.reset());

    class ResolveBodyCtrl {
      @Get("/json")
      json() {}

      @Get("/text")
      @(Returns(200, String).ContentType("text/plain"))
      text() {}

      @Get("/view")
      @View("test.pug")
      view() {}

      @Get("/async")
      @(Returns(200).ContentType("async/json"))
      async() {}
    }

    function createContext(propertyKey: string) {
      const ctx = PlatformTest.createRequestContext();
      ctx.endpoint = s.store.method(ResolveBodyCtrl, propertyKey);

      return ctx;
    }

    it("should return the serialized data of a JSON endpoint without a promise", async () => {
      await PlatformTest.create();
      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

      const result = platformResponseFilter.resolveBody({test: "test"}, createContext("json"));

      expect(result).not.toBeInstanceOf(Promise);
      expect(result).toEqual({test: "test"});
    });

    it("should return a text body without a promise", async () => {
      await PlatformTest.create();
      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = createContext("text");
      vi.spyOn(ctx.response, "contentType").mockReturnThis();

      const result = platformResponseFilter.resolveBody("hello", ctx);

      expect(result).toEqual("hello");
      expect(ctx.response.contentType).toHaveBeenCalledWith("text/plain");
    });

    it("should return a promise when the endpoint renders a view", async () => {
      await PlatformTest.create();
      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = createContext("view");
      vi.spyOn(ctx.response, "render").mockResolvedValue("template");

      const result = platformResponseFilter.resolveBody({test: "test"}, ctx);

      expect(result).toBeInstanceOf(Promise);
      expect(await result).toEqual("template");
    });

    it("should return a promise when the content-type filter is async", async () => {
      await PlatformTest.create({responseFilters: [AsyncJsonFilter]});
      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = createContext("async");
      vi.spyOn(ctx.response, "contentType").mockReturnThis();

      const result = platformResponseFilter.resolveBody({test: "test"}, ctx);

      expect(result).toBeInstanceOf(Promise);
      expect(await result).toEqual({async: {test: "test"}});
    });

    it("should call the serialize() override of a subclass", async () => {
      class CustomResponseFilter extends PlatformResponseFilter {
        protected async serialize(data: unknown) {
          return {custom: data};
        }
      }

      await PlatformTest.create();
      const platformResponseFilter = await PlatformTest.invoke<CustomResponseFilter>(CustomResponseFilter);

      const result = platformResponseFilter.resolveBody({test: "test"}, createContext("json"));

      expect(result).toBeInstanceOf(Promise);
      expect(await result).toEqual({custom: {test: "test"}});
    });

    it("should keep transform() returning a promise", async () => {
      await PlatformTest.create();
      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

      const result = platformResponseFilter.transform({test: "test"}, createContext("json"));

      expect(result).toBeInstanceOf(Promise);
      expect(await result).toEqual({test: "test"});
    });
  });
});
