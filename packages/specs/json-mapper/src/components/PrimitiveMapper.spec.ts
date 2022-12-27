import {catchError} from "@tsed/core";
import Sinon from "sinon";
import {PrimitiveMapper} from "./PrimitiveMapper";

describe("PrimitiveMapper", () => {
  describe("deserialize()", () => {
    it("should return value (number => string)", () => {
      const mapper = new PrimitiveMapper();
      const data = 1;
      const ctx = {
        type: String,
        collectionType: undefined,
        next: Sinon.stub()
      };

      const value = mapper.deserialize(data, ctx);

      expect(value).toEqual("1");
    });
    it("should return value (string => string)", () => {
      const mapper = new PrimitiveMapper();
      const data = "1";
      const ctx = {
        type: String,
        collectionType: undefined,
        next: Sinon.stub()
      };

      const value = mapper.deserialize(data, ctx);

      expect(value).toEqual("1");
    });
    it("should return value (null => number)", () => {
      const mapper = new PrimitiveMapper();
      const data = null;
      const ctx = {
        type: Number,
        collectionType: undefined,
        next: Sinon.stub()
      };

      const value = mapper.deserialize(data, ctx);

      expect(value).toEqual(null);
    });
    it("should return value ('null' => number)", () => {
      const mapper = new PrimitiveMapper();
      const data = "null";
      const ctx = {
        type: Number,
        collectionType: undefined,
        next: Sinon.stub()
      };

      const value = mapper.deserialize(data, ctx);

      expect(value).toEqual(null);
    });
    it("should return value (string => number)", () => {
      const mapper = new PrimitiveMapper();
      const data = "1";
      const ctx = {
        type: Number,
        collectionType: undefined,
        next: Sinon.stub()
      };

      const value = mapper.deserialize(data, ctx);

      expect(value).toEqual(1);
    });
    it("should return value (number => number)", () => {
      const mapper = new PrimitiveMapper();
      const data = 1;
      const ctx = {
        type: Number,
        collectionType: undefined,
        next: Sinon.stub()
      };

      const value = mapper.deserialize(data, ctx);

      expect(value).toEqual(1);
    });
    it("should return value (wrong number => number)", () => {
      const mapper = new PrimitiveMapper();
      const data = "t1";
      const ctx = {
        type: Number,
        collectionType: undefined,
        next: Sinon.stub()
      };

      let actualError: any = catchError(() => mapper.deserialize(data, ctx));

      expect(actualError.message).toEqual("Cast error. Expression value is not a number.");
    });
    it("should return value (truthy => boolean)", () => {
      const mapper = new PrimitiveMapper();
      const ctx = {
        type: Boolean,
        collectionType: undefined,
        next: Sinon.stub()
      };

      expect(mapper.deserialize(1, ctx)).toEqual(true);
      expect(mapper.deserialize("1", ctx)).toEqual(true);
      expect(mapper.deserialize("true", ctx)).toEqual(true);
      expect(mapper.deserialize(true, ctx)).toEqual(true);
    });
    it("should return value (falsy => boolean)", () => {
      const mapper = new PrimitiveMapper();
      const ctx = {
        type: Boolean,
        collectionType: undefined,
        next: Sinon.stub()
      };

      expect(mapper.deserialize(0, ctx)).toEqual(false);
      expect(mapper.deserialize("0", ctx)).toEqual(false);
      expect(mapper.deserialize("", ctx)).toEqual(false);
      expect(mapper.deserialize("false", ctx)).toEqual(false);
      expect(mapper.deserialize(false, ctx)).toEqual(false);
      expect(mapper.deserialize(undefined, ctx)).toBeUndefined();
    });
    it("should return value (null => boolean)", () => {
      const mapper = new PrimitiveMapper();
      const ctx = {
        type: Boolean,
        collectionType: undefined,
        next: Sinon.stub()
      };

      expect(mapper.deserialize(null, ctx)).toEqual(null);
      expect(mapper.deserialize("null", ctx)).toEqual(null);
    });
  });
  describe("serialize()", () => {
    it("should return value", () => {
      const mapper = new PrimitiveMapper();

      const value = mapper.serialize("1");

      expect(value).toEqual("1");
    });
  });
});
