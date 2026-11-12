import {number, object, string} from "@tsed/schema";
import {AjvService} from "./AjvService.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {catchAsyncError} from "@tsed/core";

describe("AjvService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should use the function api as schema", async () => {
    const ajvService = PlatformTest.get<AjvService>(AjvService);

    const error: any = await catchAsyncError(() => ajvService.validate("test", {schema: string().minLength(5)}));
    expect(error.errors).toEqual([
      {
        data: "test",
        dataPath: "",
        instancePath: "",
        keyword: "minLength",
        message: "must NOT have fewer than 5 characters",
        params: {
          limit: 5
        },
        schemaPath: "#/minLength"
      }
    ]);
  });

  it("should use the function api as schema (required)", async () => {
    const ajvService = PlatformTest.get<AjvService>(AjvService);

    const error: any = await catchAsyncError(() => ajvService.validate({}, {schema: object({test: string().required()})}));
    expect(error.errors).toEqual([
      {
        dataPath: ".test",
        instancePath: "",
        keyword: "required",
        message: "must have required property 'test'",
        params: {
          missingProperty: "test"
        },
        schemaPath: "#/required"
      }
    ]);
  });
});

describe("AjvService.validateValue()", () => {
  afterEach(() => PlatformTest.reset());

  describe("with a synchronous schema", () => {
    beforeEach(() => PlatformTest.create());

    it("should return the value without a promise", () => {
      const ajvService = PlatformTest.get<AjvService>(AjvService);
      const value = {name: "test"};

      const result = ajvService.validateValue(value, {schema: object({name: string().minLength(3)})});

      expect(result).not.toBeInstanceOf(Promise);
      expect(result).toBe(value);
    });

    it("should throw the same error as validate() rejects with", async () => {
      const ajvService = PlatformTest.get<AjvService>(AjvService);
      const schema = string().minLength(5);

      let thrown: any;

      try {
        ajvService.validateValue("test", {schema});
      } catch (er) {
        thrown = er;
      }

      const rejected: any = await catchAsyncError(() => ajvService.validate("test", {schema}));

      expect(thrown).toBeDefined();
      expect(thrown.constructor).toBe(rejected.constructor);
      expect(thrown.message).toEqual(rejected.message);
      expect(thrown.errors).toEqual(rejected.errors);
    });

    it("should keep returning a promise from validate()", () => {
      const ajvService = PlatformTest.get<AjvService>(AjvService);

      expect(ajvService.validate("test", {schema: string()})).toBeInstanceOf(Promise);
    });

    it("should validate a copy of the value when the coerced values are not returned", () => {
      const ajvService = PlatformTest.get<AjvService>(AjvService);
      const value = {age: "12"};

      const result = ajvService.validateValue(value, {schema: object({age: number()})});

      expect(result).toBe(value);
      expect(value).toEqual({age: "12"});
    });

    it("should return the coerced value when returnsCoercedValues is enabled", () => {
      const ajvService = PlatformTest.get<AjvService>(AjvService);

      const result = ajvService.validateValue({age: "12"}, {schema: object({age: number()}), returnsCoercedValues: true});

      expect(result).toEqual({age: 12});
    });

    it("should return a promise for an $async schema", async () => {
      const ajvService = PlatformTest.get<AjvService>(AjvService);

      const result = ajvService.validateValue("test", {schema: {$async: true, type: "string"} as any});

      expect(result).toBeInstanceOf(Promise);
      expect(await result).toEqual("test");
    });
  });

  describe("with ajv.loadSchema", () => {
    beforeEach(() => PlatformTest.create({ajv: {loadSchema: async () => ({})}}));

    it("should return a promise that settles like validate()", async () => {
      const ajvService = PlatformTest.get<AjvService>(AjvService);
      const schema = string().minLength(5);

      const result = ajvService.validateValue("test", {schema});

      expect(result).toBeInstanceOf(Promise);

      const error: any = await catchAsyncError(() => result as Promise<unknown>);
      const rejected: any = await catchAsyncError(() => ajvService.validate("test", {schema}));

      expect(error.message).toEqual(rejected.message);
    });
  });
});
