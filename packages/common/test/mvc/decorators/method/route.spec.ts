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
      All("/", () => {
      });

      // THEN
      useStub.should.have.been.calledWithExactly("all", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      All();

      // THEN
      useStub.should.have.been.calledWithExactly("all", "/");
    });
  });

  describe("Get", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Get("/", () => {
      });

      // THEN
      useStub.should.have.been.calledWithExactly("get", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Get();

      // THEN
      useStub.should.have.been.calledWithExactly("get", "/");
    });
  });

  describe("Post", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Post("/", () => {
      });

      // THEN
      useStub.should.have.been.calledWithExactly("post", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Post();

      // THEN
      useStub.should.have.been.calledWithExactly("post", "/");
    });
  });

  describe("Put", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Put("/", () => {
      });

      // THEN
      useStub.should.have.been.calledWithExactly("put", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Put();

      // THEN
      useStub.should.have.been.calledWithExactly("put", "/");
    });
  });

  describe("Delete", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Delete("/", () => {
      });

      // THEN
      useStub.should.have.been.calledWithExactly("delete", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Delete();

      // THEN
      useStub.should.have.been.calledWithExactly("delete", "/");
    });
  });

  describe("Head", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Head("/", () => {
      });

      // THEN
      useStub.should.have.been.calledWithExactly("head", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Head();

      // THEN
      useStub.should.have.been.calledWithExactly("head", "/");
    });
  });

  describe("Patch", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Patch("/", () => {
      });

      // THEN
      useStub.should.have.been.calledWithExactly("patch", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Patch();

      // THEN
      useStub.should.have.been.calledWithExactly("patch", "/");
    });
  });

  describe("Options", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      Options("/", () => {
      });

      // THEN
      useStub.should.have.been.calledWithExactly("options", "/", Sinon.match.func);
    });

    it("should register route and middleware (2)", () => {
      // WHEN
      Options();

      // THEN
      useStub.should.have.been.calledWithExactly("options", "/");
    });
  });
});
