import {Controller} from "@tsed/di";
import {MultipartFile, PlatformMulterFile} from "@tsed/platform-http";
import {BodyParams} from "@tsed/platform-params";

import {Any, CollectionOf, getSpec, Integer, Post, Property} from "../../src/index.js";

class MyModel {
  @Property()
  test: string;
}

describe("Integration: BodyParams any", () => {
  it("should generate the right spec (any[])", () => {
    @Controller("/array")
    class TestArrayBodyCtrl {
      @Post("/1")
      scenario(@BodyParams() list: any[]) {
        return list;
      }

      @Post("/2")
      scenario2(@BodyParams() list: any) {
        return list;
      }

      @Post("/3")
      scenario3(@BodyParams() @Any() list: any) {
        return list;
      }
    }

    expect(getSpec(TestArrayBodyCtrl)).toMatchSnapshot();
  });
  it("should generate the right spec (number[])", () => {
    @Controller("/array")
    class TestArrayBodyCtrl {
      @Post("/1")
      scenario(@BodyParams() list: number) {
        return list;
      }

      @Post("/2")
      scenario2(@BodyParams(Number) list: number[]) {
        return list;
      }

      @Post("/3")
      scenario3(@BodyParams() @Integer() list: number) {
        return list;
      }

      @Post("/4")
      scenario4(@BodyParams() @Integer() list: number[]) {
        return list;
      }
    }

    expect(getSpec(TestArrayBodyCtrl)).toMatchSnapshot();
  });
  it("should generate the right spec (MyModel[])", () => {
    @Controller("/array")
    class TestArrayBodyCtrl {
      @Post("/1")
      scenario1(@BodyParams() @CollectionOf(MyModel) list: MyModel[]) {
        return list;
      }
    }

    expect(getSpec(TestArrayBodyCtrl)).toMatchSnapshot();
  });
  it("should generate the right spec (File)", () => {
    @Controller("/array")
    class TestArrayBodyCtrl {
      @Post("/")
      scenario(@MultipartFile("file") name: PlatformMulterFile) {
        return undefined;
      }

      @Post("/")
      test(@MultipartFile("file1", 4) file: PlatformMulterFile[]) {}
    }

    expect(getSpec(TestArrayBodyCtrl)).toMatchSnapshot();
  });
});
