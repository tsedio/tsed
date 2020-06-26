import {expect} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";

const middleware: any = Sinon.stub();
const useStub: any = Sinon.stub().returns(middleware);

const {All, Get, Post, Put, Delete, Head, Patch, Options} = Proxyquire.load("../../../../src/mvc/decorators/method/route", {
  "./use": {Use: useStub}
});

describe("Route decorators", () => {
  afterEach(() => {
    useStub.resetHistory();
  });
  describe("All", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      All("/", () => {});

      // THEN
      expect(useStub).to.have.been.calledWithExactly("all", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      All();

      // THEN
      expect(useStub).to.have.been.calledWithExactly("all", "/");
    });
  });

  describe("Get", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Get("/", () => {});

      // THEN
      expect(useStub).to.have.been.calledWithExactly("get", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Get();

      // THEN
      expect(useStub).to.have.been.calledWithExactly("get", "/");
    });
  });

  describe("Post", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Post("/", () => {});

      // THEN
      expect(useStub).to.have.been.calledWithExactly("post", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Post();

      // THEN
      expect(useStub).to.have.been.calledWithExactly("post", "/");
    });
  });

  describe("Put", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Put("/", () => {});

      // THEN
      expect(useStub).to.have.been.calledWithExactly("put", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Put();

      // THEN
      expect(useStub).to.have.been.calledWithExactly("put", "/");
    });
  });

  describe("Delete", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Delete("/", () => {});

      // THEN
      expect(useStub).to.have.been.calledWithExactly("delete", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Delete();

      // THEN
      expect(useStub).to.have.been.calledWithExactly("delete", "/");
    });
  });

  describe("Head", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Head("/", () => {});

      // THEN
      expect(useStub).to.have.been.calledWithExactly("head", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Head();

      // THEN
      expect(useStub).to.have.been.calledWithExactly("head", "/");
    });
  });

  describe("Patch", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Patch("/", () => {});

      // THEN
      expect(useStub).to.have.been.calledWithExactly("patch", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Patch();

      // THEN
      expect(useStub).to.have.been.calledWithExactly("patch", "/");
    });
  });

  describe("Options", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Options("/", () => {});

      // THEN
      expect(useStub).to.have.been.calledWithExactly("options", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Options();

      // THEN
      expect(useStub).to.have.been.calledWithExactly("options", "/");
    });
  });
});
