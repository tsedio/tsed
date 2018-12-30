import {assert} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";

const middleware: any = Sinon.stub();
const useStub: any = Sinon.stub().returns(middleware);

const {All, Get, Post, Put, Delete, Head, Patch} = Proxyquire.load("../../../../src/mvc/decorators/method/route", {
  "./use": {Use: useStub}
});

describe("Route decorators", () => {
  describe("All", () => {
    before(() => {
      this.options = ["/", () => {
      }];
      All(...this.options);
    });

    after(() => {
      delete this.descriptor;
      delete this.options;
    });

    it("should create middleware", () => {
      assert(useStub.calledWith("all", ...this.options[0]));
    });
  });

  describe("Get", () => {
    before(() => {
      this.options = ["/", () => {
      }];
      Get(...this.options);
    });

    after(() => {
      delete this.options;
    });

    it("should create middleware", () => {
      assert(useStub.calledWith("get", ...this.options[0]));
    });
  });

  describe("Post", () => {
    before(() => {
      this.options = ["/", () => {
      }];
      Post(...this.options);
    });

    after(() => {
      delete this.options;
    });

    it("should create middleware", () => {
      assert(useStub.calledWith("post", ...this.options[0]));
    });
  });

  describe("Put", () => {
    before(() => {
      this.options = ["/", () => {
      }];
      Put(...this.options);
    });

    after(() => {
      delete this.options;
    });

    it("should create middleware", () => {
      assert(useStub.calledWith("put", ...this.options[0]));
    });
  });

  describe("Delete", () => {
    before(() => {
      this.options = ["/", () => {
      }];
      Delete(...this.options);
    });

    after(() => {
      delete this.options;
    });

    it("should create middleware", () => {
      assert(useStub.calledWith("delete", ...this.options[0]));
    });
  });

  describe("Head", () => {
    before(() => {
      this.options = ["/", () => {
      }];
      Head(...this.options);
    });

    after(() => {
      delete this.options;
    });

    it("should create middleware", () => {
      assert(useStub.calledWith("head", ...this.options[0]));
    });
  });

  describe("Patch", () => {
    before(() => {
      this.options = ["/", () => {
      }];
      Patch(...this.options);
    });

    after(() => {
      delete this.options;
    });

    it("should create middleware", () => {
      assert(useStub.calledWith("patch", ...this.options[0]));
    });
  });
});
