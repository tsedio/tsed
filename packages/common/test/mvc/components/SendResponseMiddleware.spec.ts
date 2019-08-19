import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../test/helper";
import {inject} from "../../../../testing/src";
import {ConverterService} from "../../../src/converters";
import {EndpointMetadata, SendResponseMiddleware} from "../../../src/mvc";

describe("SendResponseMiddleware", () => {
  class TestCtrl {
    get() {
    }
  }

  describe("when value is undefined", () => {
    it("should send empty response", inject([ConverterService], (converter: ConverterService) => {
      // GIVEN
      const middleware = new SendResponseMiddleware(converter);
      const data = undefined;
      const response = new FakeResponse(Sinon);

      // WHEN
      const result = middleware.use(data, response as any);

      // THEN
      result.should.eq(response);
      response.send.should.have.been.calledWithExactly();
    }));
  });

  describe("when value is null", () => {
    it("should send empty response", inject([ConverterService], (converter: ConverterService) => {
      // GIVEN
      const middleware = new SendResponseMiddleware(converter);
      const data = null;
      const response = new FakeResponse(Sinon);

      // WHEN
      const result = middleware.use(data, response as any);

      // THEN
      result.should.eq(response);
      response.send.should.have.been.calledWithExactly(null);
    }));
  });

  describe("when value is false", () => {
    it("should send response", inject([ConverterService], (converter: ConverterService) => {
      // GIVEN
      const middleware = new SendResponseMiddleware(converter);
      const data = false;
      const response = new FakeResponse(Sinon);

      // WHEN
      const result = middleware.use(data, response as any);

      // THEN
      result.should.eq(response);
      response.send.should.have.been.calledWithExactly(false);
    }));
  });

  describe("when value is true", () => {
    it("should send response", inject([ConverterService], (converter: ConverterService) => {
      // GIVEN
      const middleware = new SendResponseMiddleware(converter);
      const data = true;
      const response = new FakeResponse(Sinon);

      // WHEN
      const result = middleware.use(data, response as any);

      // THEN
      result.should.eq(response);
      response.send.should.have.been.calledWithExactly(true);
    }));
  });

  describe("when value is an empty string", () => {
    it("should send response", inject([ConverterService], (converter: ConverterService) => {
      // GIVEN
      const middleware = new SendResponseMiddleware(converter);
      const data = "";
      const response = new FakeResponse(Sinon);

      // WHEN
      const result = middleware.use(data, response as any);

      // THEN
      result.should.eq(response);
      response.send.should.have.been.calledWithExactly("");
    }));
  });

  describe("when value is string", () => {
    it("should send response", inject([ConverterService], (converter: ConverterService) => {
      // GIVEN
      const middleware = new SendResponseMiddleware(converter);
      const data = "test";
      const response = new FakeResponse(Sinon);

      // WHEN
      const result = middleware.use(data, response as any);

      // THEN
      result.should.eq(response);
      response.send.should.have.been.calledWithExactly("test");
    }));
  });

  describe("when value is a number", () => {
    it("should send response", inject([ConverterService], (converter: ConverterService) => {
      // GIVEN
      const middleware = new SendResponseMiddleware(converter);
      const data = 1;
      const response = new FakeResponse(Sinon);

      // WHEN
      const result = middleware.use(data, response as any);

      // THEN
      result.should.eq(response);
      response.send.should.have.been.calledWithExactly(1);
    }));
  });

  describe("when value is an object", () => {
    it("should send response", inject([ConverterService], (converter: ConverterService) => {
      // GIVEN
      const middleware = new SendResponseMiddleware(converter);
      const data = {data: "data"};
      const response = new FakeResponse(Sinon);

      // WHEN
      const result = middleware.use(data, response as any);

      // THEN
      result.should.eq(response);
      response.json.should.have.been.calledWithExactly(data);
    }));
  });

  describe("when value is an array", () => {
    it("should send response", inject([ConverterService], (converter: ConverterService) => {
      // GIVEN
      const middleware = new SendResponseMiddleware(converter);
      const data = [{data: "data"}];
      const response = new FakeResponse(Sinon);

      // WHEN
      const result = middleware.use(data, response as any);

      // THEN
      result.should.eq(response);
      response.json.should.have.been.calledWithExactly(data);
    }));
  });

  describe("when value is a date", () => {
    it("should send response", inject([ConverterService], (converter: ConverterService) => {
      // GIVEN
      const middleware = new SendResponseMiddleware(converter);
      const data = new Date("2019-01-01");
      const response = new FakeResponse(Sinon);

      // WHEN
      const result = middleware.use(data, response as any);

      // THEN
      result.should.eq(response);
      response.json.should.have.been.calledWithExactly("2019-01-01T00:00:00.000Z");
    }));
  });
});
