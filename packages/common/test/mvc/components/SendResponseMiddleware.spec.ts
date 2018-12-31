import {inject} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../test/helper";
import {SendResponseMiddleware} from "../../../src/mvc";

describe("SendResponseMiddleware", () => {
  before(
    inject([SendResponseMiddleware], (middleware: SendResponseMiddleware) => {
      this.middleware = middleware;
      this.serializeStub = Sinon.stub(this.middleware.converterService as any, "serialize");
    })
  );

  describe("with boolean value", () => {
    before(() => {
      this.fakeResponse = new FakeResponse();

      this.middleware.use(true, this.fakeResponse as any, {});
    });

    after(() => {
      this.serializeStub.reset();
    });

    it("should not call serialize method", () => {
      return this.serializeStub.should.not.have.been.called;
    });

    it("should return a string of the value", () => {
      expect(this.fakeResponse._body).to.be.a("string");
      expect(this.fakeResponse._body).to.equal("true");
    });
  });

  describe("with number value", () => {
    before(() => {
      this.fakeResponse = new FakeResponse();
      this.middleware.use(1, this.fakeResponse as any, {});
    });

    after(() => {
      this.serializeStub.reset();
    });

    it("should not call serialize method", () => {
      return this.serializeStub.should.not.have.been.called;
    });

    it("should return a string of the value", () => {
      expect(this.fakeResponse._body).to.be.a("string");
      expect(this.fakeResponse._body).to.equal("1");
    });
  });

  describe("with null value", () => {
    before(() => {
      this.fakeResponse = new FakeResponse();
      this.middleware.use(null, this.fakeResponse as any, {});
    });

    after(() => {
      this.serializeStub.reset();
    });

    it("should not call serialize method", () => {
      return this.serializeStub.should.not.have.been.called;
    });

    it("should return a string of the value", () => {
      expect(this.fakeResponse._body).to.be.a("string");
      expect(this.fakeResponse._body).to.equal("null");
    });
  });

  describe("with undefined value", () => {
    before(() => {
      this.fakeResponse = new FakeResponse();
      this.middleware.use(undefined, this.fakeResponse as any, {});
    });

    after(() => {
      this.serializeStub.reset();
    });

    it("should not call serialize method", () => {
      return this.serializeStub.should.not.have.been.called;
    });

    it("should send nothing", () => {
      expect(this.fakeResponse._body).to.be.a("string");
      expect(this.fakeResponse._body).to.equal("");
    });
  });

  describe("with undefined value and 204 statusCode", () => {
    before(() => {
      this.fakeResponse = new FakeResponse();
      Sinon.stub(this.fakeResponse, "send");
      this.middleware.use(undefined, this.fakeResponse as any, {statusCode: 204});
    });

    after(() => {
      this.serializeStub.reset();
    });

    it("should not call serialize method", () => {
      return this.serializeStub.should.not.have.been.called;
    });

    it("should return a string of the value", () => {
      return this.fakeResponse.send.should.have.been.called;
    });
  });

  describe("with date value", () => {
    before(() => {
      this.date = new Date();
      this.serializeStub.returns("dataSerialized");
      this.fakeResponse = new FakeResponse();
      this.middleware.use(this.date, this.fakeResponse as any, {});
    });

    after(() => {
      this.serializeStub.reset();
    });

    it("should not call serialize method", () => {
      return this.serializeStub.should.have.been.calledWithExactly(this.date);
    });

    it("should return a string of the value", () => {
      expect(this.fakeResponse._body).to.be.a("string");
      expect(this.fakeResponse._body).to.equal(JSON.stringify("dataSerialized"));
    });
  });

  describe("with object value", () => {
    before(() => {
      this.data = {data: "data"};
      this.serializeStub.returns("dataSerialized");
      this.fakeResponse = new FakeResponse();
      this.middleware.use(this.data, this.fakeResponse as any, {});
    });

    after(() => {
      this.serializeStub.reset();
    });

    it("should not call serialize method", () => {
      return this.serializeStub.should.have.been.calledWithExactly(this.data);
    });

    it("should send nothing", () => {
      expect(this.fakeResponse._body).to.be.a("string");
      expect(this.fakeResponse._body).to.equal(JSON.stringify("dataSerialized"));
    });
  });

  describe("with model value", () => {
    before(() => {
      this.data = {data: "data"};
      this.serializeStub.returns("dataSerialized");
      this.fakeResponse = new FakeResponse();
      this.middleware.use(this.data, this.fakeResponse as any, {});
    });

    after(() => {
      this.serializeStub.reset();
    });

    it("should not call serialize method", () => {
      return this.serializeStub.should.have.been.calledWithExactly(this.data);
    });

    it("should send nothing", () => {
      expect(this.fakeResponse._body).to.be.a("string");
      expect(this.fakeResponse._body).to.equal(JSON.stringify("dataSerialized"));
    });
  });
});
