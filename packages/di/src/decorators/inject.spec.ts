import {catchError, descriptorOf, Metadata, Store} from "@tsed/core";
import {Required} from "@tsed/schema";
import {Inject, Injectable, InjectorService} from "../../src";
import {INJECTABLE_PROP} from "../constants/constants";

describe("@Inject()", () => {
  describe("used on unsupported decorator type", () => {
    it("should store metadata", () => {
      // GIVEN
      class Test {
        test() {}
      }

      // WHEN
      let actualError;
      try {
        Inject()(Test, "test", descriptorOf(Test, "test"));
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError.message).toEqual("Inject cannot be used as method.static decorator on Test.test");
    });
  });

  describe("used on method", () => {
    it("should store metadata", () => {
      // GIVEN
      class Test {
        test() {}
      }

      // WHEN
      Inject()(Test.prototype, "test", descriptorOf(Test, "test"));

      // THEN
      const store = Store.from(Test).get(INJECTABLE_PROP);
      expect(store).toEqual({
        test: {
          bindingType: "method",
          propertyKey: "test"
        }
      });
    });
  });

  describe("used on property", () => {
    it("should store metadata from inferred type", async () => {
      // GIVEN
      @Injectable()
      class Test {
        @Inject()
        test: InjectorService;
      }

      const injector = new InjectorService();
      const instance = await injector.invoke<Test>(Test);

      expect(instance).toBeInstanceOf(Test);
      expect(instance.test).toBeInstanceOf(InjectorService);
    });
    it("should store metadata from given type", async () => {
      // GIVEN
      @Injectable()
      class Test {
        @Inject(InjectorService, (bean: any) => bean.get(InjectorService))
        test: InjectorService;
      }

      const injector = new InjectorService();
      const instance = await injector.invoke<Test>(Test);

      expect(instance).toBeInstanceOf(Test);
      expect(instance.test).toBeInstanceOf(InjectorService);
    });
    it("should catch error when an object is given as token provider", async () => {
      // GIVEN
      @Injectable()
      class Test {
        @Required()
        test: Object;
      }

      const error = catchError(() => {
        Inject()(Test.prototype, "test");
      });

      expect(error?.message).toMatchSnapshot();
    });
  });

  describe("used on constructor/params", () => {
    beforeAll(() => {
      jest.spyOn(Metadata, "getParamTypes").mockReturnValue([]);
      jest.spyOn(Metadata, "setParamTypes").mockReturnValue(undefined);
    });
    afterAll(() => {
      jest.resetAllMocks();
    });

    it("should call Metadata.getParamTypes()", () => {
      // GIVEN
      class Test {
        test() {}
      }

      // WHEN
      Inject(String)(Test.prototype, undefined, 0);

      // THEN
      expect(Metadata.getParamTypes).toBeCalledWith(Test.prototype, undefined);
      expect(Metadata.setParamTypes).toBeCalledWith(Test.prototype, undefined, [String]);
    });
  });

  describe("used on method/params", () => {
    beforeAll(() => {
      jest.spyOn(Metadata, "getParamTypes").mockReturnValue([]);
      jest.spyOn(Metadata, "setParamTypes").mockReturnValue(undefined);
    });
    afterAll(() => {
      jest.resetAllMocks();
    });

    it("should call Metadata.getParamTypes()", () => {
      // GIVEN
      class Test {
        test() {}
      }

      // WHEN
      Inject(String)(Test.prototype, "propertyKey", 0);

      // THEN
      expect(Metadata.getParamTypes).toBeCalledWith(Test.prototype, "propertyKey");
      expect(Metadata.setParamTypes).toBeCalledWith(Test.prototype, "propertyKey", [String]);
    });
  });
});
