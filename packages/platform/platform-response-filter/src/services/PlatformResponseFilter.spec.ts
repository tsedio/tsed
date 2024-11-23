import {catchAsyncError} from "@tsed/core";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Context} from "@tsed/platform-params";
import {EndpointMetadata, Get, Returns, View} from "@tsed/schema";

import {ResponseFilter} from "../decorators/responseFilter.js";
import {ResponseFilterMethods} from "../interfaces/ResponseFilterMethods.js";
import {PlatformResponseFilter} from "./PlatformResponseFilter.js";

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

@ResponseFilter("*/*")
class AllFilter implements ResponseFilterMethods {
  transform(data: unknown, ctx: Context) {
    return {data, "content-type": "*/*"};
  }
}

describe("PlatformResponseFilter", () => {
  describe("transform()", () => {
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
        ctx.endpoint = EndpointMetadata.get(Test, "test");
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
        ctx.endpoint = EndpointMetadata.get(Test, "test");
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
        ctx.endpoint = EndpointMetadata.get(Test, "test");
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
        ctx.endpoint = EndpointMetadata.get(Test, "test");

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
        ctx.endpoint = EndpointMetadata.get(Test, "test");

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
        ctx.endpoint = EndpointMetadata.get(Test, "test");

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
  describe("serialize()", () => {
    beforeEach(() =>
      PlatformTest.create({
        responseFilters: [CustomJsonFilter, AllFilter, ApplicationJsonFilter]
      })
    );
    afterEach(() => PlatformTest.reset());
    it("should transform value", async () => {
      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = PlatformTest.createRequestContext();

      const result = await platformResponseFilter.serialize({test: "test"}, ctx);

      expect(result).toEqual({test: "test"});
    });
    it("should transform value (endpoint)", async () => {
      class Test {
        @Get("/")
        test() {}
      }

      const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
      const ctx = PlatformTest.createRequestContext();
      ctx.endpoint = EndpointMetadata.get(Test, "test");

      vi.spyOn(ctx.endpoint, "getResponseOptions");

      const result = await platformResponseFilter.serialize({test: "test"}, ctx);

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
      ctx.endpoint = EndpointMetadata.get(Test, "test");

      vi.spyOn(ctx.endpoint, "getResponseOptions");

      ctx.request.query.includes = [];

      const result = await platformResponseFilter.serialize({test: "test"}, ctx);

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
      ctx.endpoint = EndpointMetadata.get(Test, "test");

      vi.spyOn(ctx.endpoint, "getResponseOptions");

      ctx.request.query.includes = ["test,test2"];

      const result = await platformResponseFilter.serialize({test: "test"}, ctx);

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
      ctx.endpoint = EndpointMetadata.get(Test, "test");
      vi.spyOn(ctx.response, "render").mockResolvedValue("template");

      const result = await platformResponseFilter.serialize({test: "test"}, ctx);

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
      ctx.endpoint = EndpointMetadata.get(Test, "test");
      vi.spyOn(ctx.response, "render").mockRejectedValue(new Error("parsing error"));

      const result = await catchAsyncError(() => platformResponseFilter.serialize({test: "test"}, ctx));

      expect(result?.message).toEqual("Template rendering error: Test.test()\nError: parsing error");
    });
  });
});
