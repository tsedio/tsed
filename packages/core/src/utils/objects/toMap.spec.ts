import {expect} from "chai";
import {toMap} from "./toMap";

describe("toMap", () => {
  describe("from Array", () => {
    it("should create map", () => {
      const result = toMap({
        test: {top: "test"},
        test1: {top: "test1"}
      });

      expect(result).to.be.instanceof(Map);
      expect(result.size).to.equal(2);
      expect([...result.keys()]).to.deep.equal(["test", "test1"]);
      expect([...result.values()]).to.deep.equal([{top: "test"}, {top: "test1"}]);
    });
    it("should create map by id", () => {
      const result = toMap(
        {
          test: {id: "1", top: "test"},
          test1: {id: "2", top: "test1"},
          test3: {id: "1", top: "test"}
        },
        "id"
      );

      expect(result).to.be.instanceof(Map);
      expect(result.size).to.equal(2);
      expect([...result.keys()]).to.deep.equal(["1", "2"]);
      expect([...result.values()]).to.deep.equal([
        {
          id: "1",
          top: "test"
        },
        {
          id: "2",
          top: "test1"
        }
      ]);
    });
    it("should create map by fn id", () => {
      const result = toMap(
        {
          test: {id: "1", top: "test"},
          test1: {id: "2", top: "test1"},
          test3: {id: "1", top: "test"}
        },
        (item) => item.id
      );

      expect(result).to.be.instanceof(Map);
      expect(result.size).to.equal(2);
      expect([...result.keys()]).to.deep.equal(["1", "2"]);
      expect([...result.values()]).to.deep.equal([
        {
          id: "1",
          top: "test"
        },
        {
          id: "2",
          top: "test1"
        }
      ]);
    });
  });
  describe("from Object", () => {
    it("should create map", () => {
      const result = toMap([
        {
          id: "1",
          top: "test"
        },
        {
          id: "2",
          top: "test1"
        },
        {
          id: "1",
          top: "test"
        }
      ]);

      expect(result).to.be.instanceof(Map);
      expect(result.size).to.equal(2);
      expect([...result.keys()]).to.deep.equal(["1", "2"]);
      expect([...result.values()]).to.deep.equal([
        {
          id: "1",
          top: "test"
        },
        {
          id: "2",
          top: "test1"
        }
      ]);
    });
    it("should create map by id", () => {
      const result = toMap(
        [
          {
            id: "1",
            top: "test"
          },
          {
            id: "2",
            top: "test1"
          },
          {
            id: "1",
            top: "test"
          }
        ],
        "id"
      );

      expect(result).to.be.instanceof(Map);
      expect(result.size).to.equal(2);
      expect([...result.keys()]).to.deep.equal(["1", "2"]);
      expect([...result.values()]).to.deep.equal([
        {
          id: "1",
          top: "test"
        },
        {
          id: "2",
          top: "test1"
        }
      ]);
    });
    it("should create map by fn id", () => {
      const result = toMap(
        [
          {
            id: "1",
            top: "test"
          },
          {
            id: "2",
            top: "test1"
          },
          {
            id: "1",
            top: "test"
          }
        ],
        (item) => item.id
      );

      expect(result).to.be.instanceof(Map);
      expect(result.size).to.equal(2);
      expect([...result.keys()]).to.deep.equal(["1", "2"]);
      expect([...result.values()]).to.deep.equal([
        {
          id: "1",
          top: "test"
        },
        {
          id: "2",
          top: "test1"
        }
      ]);
    });
  });
});
