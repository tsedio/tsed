import "../src/index.js";

import {catchAsyncError} from "@tsed/core";
import {configuration, constant, DITest} from "@tsed/di";
import type {Exception} from "@tsed/exceptions";
import {$asyncEmit} from "@tsed/hooks";
import {boolean, number, object, string} from "@tsed/schema";

import {type ConfigSource, withOptions} from "../src/index.js";

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

    expect(error?.message).toEqual('extends[test].test2 must be number. Given value: "string-3"');
    expect(error?.errors).toEqual([
      {
        data: "string-3",
        dataPath: ".test2",
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
