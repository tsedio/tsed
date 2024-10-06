import {catchError} from "@tsed/core";

import {PrimitiveMapper} from "./PrimitiveMapper.js";

describe("PrimitiveMapper", () => {
  describe("deserialize()", () => {
    it("should return value (number => string)", () => {
      const mapper = new PrimitiveMapper();
      const data = 1;
      const ctx = {
        type: String,
        collectionType: undefined,
        next: vi.fn()
      };

      const value = mapper.deserialize(data, ctx as never);

      expect(value).toEqual("1");
    });
    it("should return value (string => string)", () => {
      const mapper = new PrimitiveMapper();
      const data = "1";
      const ctx = {
        type: String,
        collectionType: undefined,
        next: vi.fn()
      };

      const value = mapper.deserialize(data, ctx as never);

      expect(value).toEqual("1");
    });
    it("should return value (null => number)", () => {
      const mapper = new PrimitiveMapper();
      const data = null;
      const ctx = {
        type: Number,
        collectionType: undefined,
        next: vi.fn()
      };

      const value = mapper.deserialize(data, ctx as never);

      expect(value).toEqual(null);
    });
    it("should return value ('null' => number)", () => {
      const mapper = new PrimitiveMapper();
      const data = "null";
      const ctx = {
        type: Number,
        collectionType: undefined,
        next: vi.fn()
      };

      const value = mapper.deserialize(data, ctx as never);

      expect(value).toEqual(null);
    });
    it("should return value (string => number)", () => {
      const mapper = new PrimitiveMapper();
      const data = "1";
      const ctx = {
        type: Number,
        collectionType: undefined,
        next: vi.fn()
      };

      const value = mapper.deserialize(data, ctx as never);

      expect(value).toEqual(1);
    });
    it("should return value (number => number)", () => {
      const mapper = new PrimitiveMapper();
      const data = 1;
      const ctx = {
        type: Number,
        collectionType: undefined,
        next: vi.fn()
      };

      const value = mapper.deserialize(data, ctx as never);

      expect(value).toEqual(1);
    });
    it("should return value (wrong number => number)", () => {
      const mapper = new PrimitiveMapper();
      const data = "t1";
      const ctx = {
        type: Number,
        collectionType: undefined,
        next: vi.fn()
      };

      let actualError: any = catchError(() => mapper.deserialize(data, ctx as never));

      expect(actualError.message).toEqual("Cast error. Expression value is not a number.");
    });
    it("should return value (truthy => boolean)", () => {
      const mapper = new PrimitiveMapper();
      const ctx: any = {
        type: Boolean,
        collectionType: undefined,
        next: vi.fn()
      };

      expect(mapper.deserialize(1, ctx)).toEqual(true);
      expect(mapper.deserialize("1", ctx)).toEqual(true);
      expect(mapper.deserialize("true", ctx)).toEqual(true);
      expect(mapper.deserialize(true, ctx)).toEqual(true);
    });
    it("should return value (falsy => boolean)", () => {
      const mapper = new PrimitiveMapper();
      const ctx: any = {
        type: Boolean,
        collectionType: undefined,
        next: vi.fn()
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
      const ctx: any = {
        type: Boolean,
        collectionType: undefined,
        next: vi.fn()
      };

      expect(mapper.deserialize(null, ctx)).toEqual(null);
      expect(mapper.deserialize("null", ctx)).toEqual(null);
    });
  });
  describe("serialize()", () => {
    it("should return value (string to string)", () => {
      const mapper = new PrimitiveMapper();

      const value = mapper.serialize("1", {type: String} as any);

      expect(value).toEqual("1");
    });

    it("should return value (string to number)", () => {
      const mapper = new PrimitiveMapper();

      const value = mapper.serialize("1", {type: Number} as any);

      expect(value).toEqual(1);
    });

    it("should return value (object)", () => {
      const mapper = new PrimitiveMapper();

      // in this case it's probably intended to be an object (or an error but we can decide for the developer and we can broke the code)
      // TODO: for the major version, we can return undefined or throw an error?
      const value = mapper.serialize({"1": "1"} as any, {type: Number} as any);

      expect(value).toEqual({"1": "1"});
    });

    it("should return value (null)", () => {
      const mapper = new PrimitiveMapper();
      const value = mapper.serialize(null as any, {type: Number} as any);

      expect(value).toEqual(null);
    });

    it("should return value (undefined)", () => {
      const mapper = new PrimitiveMapper();
      const value = mapper.serialize(undefined as any, {type: Number} as any);

      expect(value).toEqual(undefined);
    });
  });
});
