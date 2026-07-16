import "../src/index.js";
import {type ConfigSource, withOptions} from "../src/index.js";
import {DITest, configuration, constant} from "@tsed/di";
import {boolean, number, object, string} from "@tsed/schema";
import {$asyncEmit} from "@tsed/hooks";
import type {Exception} from "@tsed/exceptions";
import {catchAsyncError} from "@tsed/core";

describe("@tsed/config: validation", () => {
  beforeEach(() =>
    DITest.create({
      extends: []
    })
  );
  afterEach(() => DITest.reset());
  it("should validate the loaded configuration", async () => {
    class TestConfigSource implements ConfigSource {
      options: {};

      getAll() {
        return Promise.resolve({
          test: "string",
          test2: "3",
          bool: "true",
          extraValue: "true",
          ...this.options
        });
      }
    }

    configuration().set("extends", [
      withOptions(TestConfigSource, {
        validationSchema: object({
          test: string().required(),
          test2: number().required(),
          bool: boolean().required()
        })
      })
    ]);

    const error = await catchAsyncError<Exception>(() => {
      return $asyncEmit("$afterResolveConfiguration");
    });

    expect(error).toBeUndefined();
    expect(constant("test")).toEqual("string");
    expect(constant("test2")).toEqual(3);
    expect(constant("bool")).toEqual(true);
    expect(constant("extraValue")).toEqual("true");
  });
  it("should not validate the loaded configuration", async () => {
    class TestConfigSource implements ConfigSource {
      options: {};

      getAll() {
        return Promise.resolve({
          test: "string",
          test2: "string-3",
          ...this.options
        });
      }
    }

    configuration().set("extends", [
      withOptions(TestConfigSource, {
        validationSchema: object({
          test: string().required(),
          test2: number().required()
        })
      })
    ]);

    const error = await catchAsyncError<Exception>(() => {
      return $asyncEmit("$afterResolveConfiguration");
    });

    expect(error?.message).toEqual("extends[test].test2 must be number.");
    expect(error?.errors).toEqual([
      {
        instancePath: "/test2",
        keyword: "type",
        message: "must be number",
        params: {
          type: "number"
        },
        schemaPath: "#/properties/test2/type"
      }
    ]);
  });
});
