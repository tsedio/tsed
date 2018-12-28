import {AjvService} from "@tsed/ajv";
import {inject} from "@tsed/testing";
import {JsonFoo, JsonFoo2, Nested, Stuff, Thingy} from "../../../helper/classes";
import {expect} from "chai";

describe("AjvService", () => {
  before(
    inject([AjvService], (_ajvService_: AjvService) => {
      this.ajvService = _ajvService_;
    })
  );

  describe("when there an error", () => {
    it("should throws errors (1)", () => {
      const foo2 = new JsonFoo2();
      foo2.test = "te";
      try {
        this.ajvService.validate(foo2, JsonFoo2);
      } catch (er) {
        expect(er.message).to.eq("At JsonFoo2.test should NOT be shorter than 3 characters");
      }
    });

    it("should throws errors (2)", () => {
      const foo2 = new JsonFoo2();
      foo2.test = "te";
      this.ajvService.options.verbose = true;
      try {
        this.ajvService.validate(foo2, JsonFoo2);
      } catch (er) {
        expect(er.message).to.eq('At JsonFoo2.test, value "te" should NOT be shorter than 3 characters');
      }
    });

    it("should throws errors (3)", () => {
      const obj = new Thingy();
      obj.stuff = new Stuff();
      obj.stuff.nested = new Nested();
      obj.stuff.nested!.count = "100" as any;

      this.ajvService.options.verbose = true;
      try {
        this.ajvService.validate(obj, Thingy);
      } catch (er) {
        expect(er.message).to.eq('At Thingy.stuff.nested.count, value "100" should be number');
      }
    });
  });

  describe("when there is a success", () => {
    it("should not throws errors", () => {
      const foo2 = new JsonFoo2();
      foo2.test = "test";
      foo2.foo = new JsonFoo();

      return this.ajvService.validate(foo2, JsonFoo2);
    });

    it("should not throws errors (null)", () => {
      return this.ajvService.validate(null, JsonFoo2);
    });

    it("should not throws errors (undefined)", () => {
      return this.ajvService.validate(undefined, JsonFoo2);
    });
  });
});
