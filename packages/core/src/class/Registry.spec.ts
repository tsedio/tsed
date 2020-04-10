import {expect} from "chai";
import * as Sinon from "sinon";
import {Registry} from "./Registry";

class FakeMetadata {
  attr1: any;
  attr2: any;

  constructor(public target: any) {}

  test() {
    return this.target;
  }
}

describe("Registry", () => {
  describe("constructor()", () => {
    it("should create new registry from class", () => {
      const registry = new Registry(FakeMetadata);
      const clazz = class {};
      expect(!!registry).to.be.true;
    });
  });

  describe("set()", () => {
    it("should add a metadata", () => {
      const registry = new Registry(FakeMetadata);
      const clazz = class {};
      // @ts-ignore
      registry.set(clazz, {});
      expect(registry.size).to.equal(1);
    });
  });

  describe("has()", () => {
    let registry: any;
    let clazz: any;
    before(() => {
      registry = new Registry(FakeMetadata);
      clazz = class {};
    });
    it("should add a metadata", () => {
      registry.set(clazz, {});
      expect(registry.size).to.equal(1);
    });
    it("should return true if class is known", () => {
      expect(registry.has(clazz)).to.be.true;
    });
    it("should return false if class is unknown", () => {
      expect(registry.has(class {})).to.be.false;
    });
  });

  describe("get()", () => {
    let registry: any;
    let clazz: any;
    before(() => {
      registry = new Registry(FakeMetadata);
      clazz = class {};
    });
    it("should add a metadata", () => {
      registry.set(clazz, {test: true});
      expect(registry.size).to.equal(1);
    });
    it("should get metadata", () => {
      expect(registry.get(clazz).test).to.be.true;
    });
  });

  describe("entries()", () => {
    let registry: any;
    let clazz: any;
    before(() => {
      registry = new Registry(FakeMetadata);
      clazz = class {};
    });
    it("should add a metadata", () => {
      registry.set(clazz, {test: true});
      expect(registry.size).to.equal(1);
    });

    it("should return entries", () => {
      expect(typeof registry.entries()).to.equal("object");
    });
  });

  describe("keys()", () => {
    let registry: any;
    let clazz: any;
    before(() => {
      registry = new Registry(FakeMetadata);
      clazz = class {};
    });
    it("should add a metadata", () => {
      registry.set(clazz, {test: true});
      expect(registry.size).to.equal(1);
    });

    it("should return the keys", () => {
      expect(typeof registry.keys()).to.equal("object");
    });
  });

  describe("clear()", () => {
    let registry: any;
    const clazz = class {};
    it("should add a metadata", () => {
      registry = new Registry(FakeMetadata);
      registry.set(clazz, {test: true});
      expect(registry.size).to.equal(1);
    });

    it("should remove all keys", () => {
      registry.clear();
      expect(registry.size).to.equal(0);
    });
  });

  describe("delete()", () => {
    let registry: any;
    let clazz: any;
    before(() => {
      registry = new Registry(FakeMetadata);
      clazz = class {};
    });
    it("should add a metadata", () => {
      registry.set(clazz, {test: true});
      expect(registry.size).to.equal(1);
    });

    it("should remove all keys", () => {
      registry.delete(clazz);
      expect(registry.size).to.equal(0);
    });
  });

  describe("forEach()", () => {
    let registry: any;
    let clazz: any;
    before(() => {
      registry = new Registry(FakeMetadata);
      clazz = class {};
    });
    it("should add a metadata", () => {
      registry.set(clazz, {test: true});
      expect(registry.size).to.equal(1);
    });

    it("should loop for each item stored in registry", () => {
      const o: any = [];
      registry.forEach((e: any) => o.push(e));
      expect(o.length).to.equal(1);
    });
  });

  describe("values()", () => {
    let registry: any;
    let clazz: any;
    before(() => {
      registry = new Registry(FakeMetadata);
      clazz = class {};
    });
    it("should add a metadata", () => {
      registry.set(clazz, {test: true});
      expect(registry.size).to.equal(1);
    });

    it("should return the values", () => {
      expect(typeof registry.values()).to.equal("object");
    });
  });

  describe("merge()", () => {
    let registry: any;
    let clazz: any;
    before(() => {
      registry = new Registry(FakeMetadata);
      clazz = class {};
    });
    it("should create new metadata", () => {
      registry.merge(clazz, {attr1: 1});
      expect(registry.get(clazz).attr1).to.equal(1);
      expect(registry.get(clazz)).to.instanceof(FakeMetadata);
    });

    it("should merge metadata", () => {
      registry.merge(clazz, {attr2: 2});
      expect(registry.get(clazz).attr1).to.equal(1);
      expect(registry.get(clazz).attr2).to.equal(2);
      expect(registry.get(clazz).target).to.equal(clazz);
    });
  });

  describe("createIfNotExists()", () => {
    let registry: any;
    let clazz: any;
    let hasStub: any;
    let setStub: any;
    let getStub: any;
    let result: any;
    describe("when Registry is not configured with hook options", () => {
      before(() => {
        registry = new Registry(FakeMetadata);
        hasStub = Sinon.stub(registry, "has").returns(false);
        setStub = Sinon.stub(registry, "set");
        getStub = Sinon.stub(registry, "get").returns("instance");
        clazz = class {};

        result = registry.createIfNotExists("key");
      });

      after(() => {
        hasStub.restore();
        setStub.restore();
        getStub.restore();
      });

      it("should call Registry.has()", () => {
        hasStub.should.have.been.calledWithExactly("key");
      });

      it("should call Registry.set()", () => {
        setStub.should.have.been.calledWithExactly("key", Sinon.match.instanceOf(FakeMetadata));
      });

      it("should call Registry.get()", () => {
        getStub.should.have.been.calledWithExactly("key");
      });

      it("should return an instance of FakeMetadata", () => {
        expect(result).to.eq("instance");
      });
    });
    describe("when Registry is configured with hook options", () => {
      let hooks: any;
      before(() => {
        hooks = {
          onCreate: Sinon.stub()
        };
        registry = new Registry(FakeMetadata, hooks);
        hasStub = Sinon.stub(registry, "has").returns(false);
        setStub = Sinon.stub(registry, "set");
        getStub = Sinon.stub(registry, "get").returns("instance");
        clazz = class {};

        result = registry.createIfNotExists("key");
      });

      after(() => {
        hasStub.restore();
        setStub.restore();
        getStub.restore();
      });

      it("should call Registry.has()", () => {
        hasStub.should.have.been.calledWithExactly("key");
      });

      it("should call Registry.set()", () => {
        setStub.should.have.been.calledWithExactly("key", Sinon.match.instanceOf(FakeMetadata));
      });

      it("should call Registry.get()", () => {
        getStub.should.have.been.calledWithExactly("key");
      });

      it("should return an instance of FakeMetadata", () => {
        expect(result).to.eq("instance");
      });

      it("should call the onCreate hook", () => {
        hooks.onCreate.should.have.been.calledWithExactly("key", Sinon.match.instanceOf(FakeMetadata));
      });
    });
  });
});
