import {promiseTimeout} from "../../src";

describe("promiseTimeout()", () => {
  describe("when there is a timeout", () => {
    before(() => {
      return (this.result = promiseTimeout(new Promise(() => {
      }), 500));
    });

    it("should return a response with a no ok", () => {
      return this.result.should.eventually.deep.eq({
        ok: false
      });
    });
  });

  describe("when success", () => {
    before(() => {
      return (this.result = promiseTimeout(new Promise(resolve => resolve("test")), 500));
    });

    it("should return a response with a ok", () => {
      return this.result.should.eventually.deep.eq({
        ok: true,
        response: "test"
      });
    });
  });

  describe("when success (2)", () => {
    before(() => {
      return (this.result = promiseTimeout(new Promise(resolve => resolve("test"))));
    });

    it("should return a response with a ok", () => {
      return this.result.should.eventually.deep.eq({
        ok: true,
        response: "test"
      });
    });
  });
});
