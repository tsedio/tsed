import {inject, TestContext} from "@tsed/testing";
import * as Ajv from "ajv";
import {expect} from "chai";
import {JsonFoo, JsonFoo2, Nested, Stuff, Thingy} from "../../../../test/helper/classes";
import {AjvService} from "../../src";

describe("AjvService", () => {
  let ajvService: AjvService;
  before(
    inject([AjvService], (_ajvService_: AjvService) => {
      ajvService = _ajvService_;
    })
  );
  after(TestContext.reset);

  describe("when there an error", () => {
    it("should throws errors (1)", () => {
      const foo2 = new JsonFoo2();
      foo2.test = "te";
      try {
        ajvService.validate(foo2, JsonFoo2);
      } catch (er) {
        expect(er.message).to.eq("At JsonFoo2.test should NOT be shorter than 3 characters");
      }
    });

    it("should throws errors (2)", () => {
      const foo2 = new JsonFoo2();
      foo2.test = "te";

      // @ts-ignore
      ajvService.options.verbose = true;
      // @ts-ignore
      ajvService.ajv = new Ajv({verbose: true});
      try {
        ajvService.validate(foo2, JsonFoo2);
      } catch (er) {
        expect(er.message).to.eq("At JsonFoo2.test, value \"te\" should NOT be shorter than 3 characters");
      }
    });

    it("should throws errors (3)", () => {
      const obj = new Thingy();
      obj.stuff = new Stuff();
      obj.stuff.nested = new Nested();
      obj.stuff.nested!.count = "100" as any;

      // @ts-ignore
      ajvService.options.verbose = true;

      // @ts-ignore
      ajvService.ajv = new Ajv({verbose: true});
      try {
        ajvService.validate(obj, Thingy);
      } catch (er) {
        expect(er.message).to.eq("At Thingy.stuff.nested.count, value \"100\" should be number");
      }
    });
  });

  describe("when there is a success", () => {
    it("should not throws errors", () => {
      const foo2 = new JsonFoo2();
      foo2.test = "test";
      foo2.foo = new JsonFoo();

      return ajvService.validate(foo2, JsonFoo2);
    });

    it("should not throws errors (null)", () => {
      return ajvService.validate(null, JsonFoo2);
    });

    it("should not throws errors (undefined)", () => {
      return ajvService.validate(undefined, JsonFoo2);
    });
  });
});
