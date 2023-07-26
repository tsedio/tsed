import {SocketSessionData} from "./SocketSessionData";

describe("SocketSessionData", () => {
  let socketSessionData!: SocketSessionData;
  let data!: Record<string, unknown>;

  beforeEach(() => {
    data = {
      key1: "value1",
      key2: "value2"
    };
    socketSessionData = new SocketSessionData(data);
  });

  describe("Symbol.species", () => {
    it("should return Map constructor", () => {
      // act
      const result = SocketSessionData[Symbol.species];

      // assert
      expect(result).toBe(Map);
    });
  });

  describe("instanceof", () => {
    it("should return true when right side is an reference ot Map type", () => {
      // act
      const result = socketSessionData instanceof Map;

      // assert
      expect(result).toBe(true);
    });
  });

  describe("size", () => {
    it("should return the size of session data", () => {
      // act
      const size = socketSessionData.size;

      // assert
      expect(size).toBe(2);
    });
  });

  describe("clear", () => {
    it("should remove all entries from session data", () => {
      // act
      socketSessionData.clear();

      // assert
      expect(socketSessionData.size).toBe(0);
      expect(data).toEqual({});
    });
  });

  describe("delete", () => {
    it("should remove an entry from session data if it exists", () => {
      // arrange
      const keyToDelete = "key1";

      // act
      const deleted = socketSessionData.delete(keyToDelete);

      // assert
      expect(deleted).toBe(true);
      expect(socketSessionData.size).toBe(1);
      expect(socketSessionData.has(keyToDelete)).toBe(false);
      expect(data).not.toHaveProperty(keyToDelete);
    });

    it("should return false if the entry does not exist in session data", () => {
      // arrange
      const keyToDelete = "nonExistentKey";
      const expected = {...data};

      // act
      const deleted = socketSessionData.delete(keyToDelete);

      // assert
      expect(deleted).toBe(false);
      expect(socketSessionData.size).toBe(2);
      expect(data).toEqual(expected);
    });
  });

  describe("get", () => {
    it("should return the value associated with the given key", () => {
      // arrange
      const key = "key2";

      // act
      const value = socketSessionData.get(key);

      // assert
      expect(value).toBe("value2");
    });

    it("should return undefined if the key does not exist", () => {
      // arrange
      const key = "nonExistentKey";

      // act
      const value = socketSessionData.get(key);

      // assert
      expect(value).toBeUndefined();
    });
  });

  describe("set", () => {
    it("should return this", () => {
      // act
      const result = socketSessionData.set("key3", "value3");

      // assert
      expect(result).toBe(socketSessionData);
    });

    it("should set the value by the key", () => {
      // arrange
      const key = "key3";
      const value = "value3";

      // act
      socketSessionData.set(key, value);

      // assert
      expect([...socketSessionData]).toMatchObject(expect.arrayContaining([[key, value]]));
    });
  });

  describe("forEach", () => {
    it("should call the callback function for each key-value pair", () => {
      // arrange
      const callbackFn = jest.fn();

      // act
      socketSessionData.forEach(callbackFn);

      // assert
      expect(callbackFn).toHaveBeenCalledTimes(2);
      expect(callbackFn).toHaveBeenCalledWith("value1", "key1", socketSessionData);
      expect(callbackFn).toHaveBeenCalledWith("value2", "key2", socketSessionData);
    });

    it("should call the callback function with the specified thisArg", () => {
      // arrange
      const thisArg = {customProp: "customValue"};
      const callbackFn = jest.fn(function () {
        expect(this).toBe(thisArg);
      });

      // act
      socketSessionData.forEach(callbackFn, thisArg);
    });
  });

  describe("values", () => {
    it("should return an iterator for the values", () => {
      // act
      const values = socketSessionData.values();

      // assert
      expect([...values]).toEqual(["value1", "value2"]);
    });
  });

  describe("keys", () => {
    it("should return an iterator for the keys", () => {
      // act
      const keys = socketSessionData.keys();

      // assert
      expect([...keys]).toEqual(["key1", "key2"]);
    });
  });

  describe("entries", () => {
    it("should return an iterator for the key-value pairs", () => {
      // act
      const entries = [...socketSessionData.entries()];

      // assert
      expect(entries).toEqual([
        ["key1", "value1"],
        ["key2", "value2"]
      ]);
    });
  });
});
