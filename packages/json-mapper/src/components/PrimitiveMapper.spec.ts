import {expect} from "chai";
import * as Sinon from "sinon";
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

      expect(value).to.deep.eq("1");
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

      expect(value).to.deep.eq("1");
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

      expect(value).to.deep.eq(null);
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

      expect(value).to.deep.eq(null);
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

      expect(value).to.deep.eq(1);
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

      expect(value).to.deep.eq(1);
    });
    it("should return value (wrong number => number)", () => {
      const mapper = new PrimitiveMapper();
      const data = "t1";
      const ctx = {
        type: Number,
        collectionType: undefined,
        next: Sinon.stub()
      };

      let actualError: any;
      try {
        mapper.deserialize(data, ctx);
      } catch (er) {
        actualError = er;
      }

      expect(actualError.message).to.deep.eq("Cast error. Expression value is not a number.");
    });
    it("should return value (truthy => boolean)", () => {
      const mapper = new PrimitiveMapper();
      const ctx = {
        type: Boolean,
        collectionType: undefined,
        next: Sinon.stub()
      };

      expect(mapper.deserialize(1, ctx)).to.deep.eq(true);
      expect(mapper.deserialize("1", ctx)).to.deep.eq(true);
      expect(mapper.deserialize("true", ctx)).to.deep.eq(true);
      expect(mapper.deserialize(true, ctx)).to.deep.eq(true);
    });
    it("should return value (falsy => boolean)", () => {
      const mapper = new PrimitiveMapper();
      const ctx = {
        type: Boolean,
        collectionType: undefined,
        next: Sinon.stub()
      };

      expect(mapper.deserialize(0, ctx)).to.deep.eq(false);
      expect(mapper.deserialize("0", ctx)).to.deep.eq(false);
      expect(mapper.deserialize("", ctx)).to.deep.eq(false);
      expect(mapper.deserialize("false", ctx)).to.deep.eq(false);
      expect(mapper.deserialize(false, ctx)).to.deep.eq(false);
    });
    it("should return value (null => boolean)", () => {
      const mapper = new PrimitiveMapper();
      const ctx = {
        type: Boolean,
        collectionType: undefined,
        next: Sinon.stub()
      };

      expect(mapper.deserialize(null, ctx)).to.deep.eq(null);
      expect(mapper.deserialize("null", ctx)).to.deep.eq(null);
    });
  });
  describe("serialize()", () => {
    it("should return value", () => {
      const mapper = new PrimitiveMapper();

      const value = mapper.serialize("1");

      expect(value).to.deep.eq("1");
    });
  });
});
