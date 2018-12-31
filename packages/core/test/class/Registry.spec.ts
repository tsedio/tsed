import {expect} from "chai";
import * as Sinon from "sinon";
import {Registry} from "../../src";

class FakeMetadata {
  attr1: any;
  attr2: any;

  constructor(public target: any) {
  }

  test() {
    return this.target;
  }
}

describe("Registry", () => {
  describe("constructor()", () => {
    before(() => {
      this.registry = new Registry(FakeMetadata);
      this.clazz = class {
      };
    });
    it("should create new registry from class", () => {
      expect(!!this.registry).to.be.true;
    });
  });

  describe("set()", () => {
    before(() => {
      this.registry = new Registry(FakeMetadata);
      this.clazz = class {
      };
    });
    it("should add a metadata", () => {
      this.registry.set(this.clazz, {});
      expect(this.registry.size).to.equal(1);
    });
  });

  describe("has()", () => {
    before(() => {
      this.registry = new Registry(FakeMetadata);
      this.clazz = class {
      };
    });
    it("should add a metadata", () => {
      this.registry.set(this.clazz, {});
      expect(this.registry.size).to.equal(1);
    });
    it("should return true if class is known", () => {
      expect(this.registry.has(this.clazz)).to.be.true;
    });
    it("should return false if class is unknown", () => {
      expect(this.registry.has(class {
      })).to.be.false;
    });
  });

  describe("get()", () => {
    before(() => {
      this.registry = new Registry(FakeMetadata);
      this.clazz = class {
      };
    });
    it("should add a metadata", () => {
      this.registry.set(this.clazz, {test: true});
      expect(this.registry.size).to.equal(1);
    });
    it("should get metadata", () => {
      expect(this.registry.get(this.clazz).test).to.be.true;
    });
  });

  describe("entries()", () => {
    before(() => {
      this.registry = new Registry(FakeMetadata);
      this.clazz = class {
      };
    });
    it("should add a metadata", () => {
      this.registry.set(this.clazz, {test: true});
      expect(this.registry.size).to.equal(1);
    });

    it("should return entries", () => {
      expect(typeof this.registry.entries()).to.equal("object");
    });
  });

  describe("keys()", () => {
    before(() => {
      this.registry = new Registry(FakeMetadata);
      this.clazz = class {
      };
    });
    it("should add a metadata", () => {
      this.registry.set(this.clazz, {test: true});
      expect(this.registry.size).to.equal(1);
    });

    it("should return the keys", () => {
      expect(typeof this.registry.keys()).to.equal("object");
    });
  });

  describe("clear()", () => {
    it("should add a metadata", () => {
      this.registry.set(this.clazz, {test: true});
      expect(this.registry.size).to.equal(1);
    });

    it("should remove all keys", () => {
      this.registry.clear();
      expect(this.registry.size).to.equal(0);
    });
  });

  describe("delete()", () => {
    before(() => {
      this.registry = new Registry(FakeMetadata);
      this.clazz = class {
      };
    });
    it("should add a metadata", () => {
      this.registry.set(this.clazz, {test: true});
      expect(this.registry.size).to.equal(1);
    });

    it("should remove all keys", () => {
      this.registry.delete(this.clazz);
      expect(this.registry.size).to.equal(0);
    });
  });

  describe("forEach()", () => {
    before(() => {
      this.registry = new Registry(FakeMetadata);
      this.clazz = class {
      };
    });
    it("should add a metadata", () => {
      this.registry.set(this.clazz, {test: true});
      expect(this.registry.size).to.equal(1);
    });

    it("should loop for each item stored in registry", () => {
      const o: any = [];
      this.registry.forEach((e: any) => o.push(e));
      expect(o.length).to.equal(1);
    });
  });

  describe("values()", () => {
    before(() => {
      this.registry = new Registry(FakeMetadata);
      this.clazz = class {
      };
    });
    it("should add a metadata", () => {
      this.registry.set(this.clazz, {test: true});
      expect(this.registry.size).to.equal(1);
    });

    it("should return the values", () => {
      expect(typeof this.registry.values()).to.equal("object");
    });
  });

  describe("merge()", () => {
    before(() => {
      this.registry = new Registry(FakeMetadata);
      this.clazz = class {
      };
    });
    it("should create new metadata", () => {
      this.registry.merge(this.clazz, {attr1: 1});
      expect(this.registry.get(this.clazz).attr1).to.equal(1);
      expect(this.registry.get(this.clazz)).to.instanceof(FakeMetadata);
    });

    it("should merge metadata", () => {
      this.registry.merge(this.clazz, {attr2: 2});
      expect(this.registry.get(this.clazz).attr1).to.equal(1);
      expect(this.registry.get(this.clazz).attr2).to.equal(2);
      expect(this.registry.get(this.clazz).target).to.equal(this.clazz);
    });
  });

  describe("createIfNotExists()", () => {
    describe("when Registry is not configured with hook options", () => {
      before(() => {
        this.registry = new Registry(FakeMetadata);
        this.hasStub = Sinon.stub(this.registry, "has").returns(false);
        this.setStub = Sinon.stub(this.registry, "set");
        this.getStub = Sinon.stub(this.registry, "get").returns("instance");
        this.clazz = class {
        };

        this.result = this.registry.createIfNotExists("key");
      });

      after(() => {
        this.hasStub.restore();
        this.setStub.restore();
        this.getStub.restore();
      });

      it("should call Registry.has()", () => {
        this.hasStub.should.have.been.calledWithExactly("key");
      });

      it("should call Registry.set()", () => {
        this.setStub.should.have.been.calledWithExactly("key", Sinon.match.instanceOf(FakeMetadata));
      });

      it("should call Registry.get()", () => {
        this.getStub.should.have.been.calledWithExactly("key");
      });

      it("should return an instance of FakeMetadata", () => {
        expect(this.result).to.eq("instance");
      });
    });
    describe("when Registry is configured with hook options", () => {
      before(() => {
        this.hooks = {
          onCreate: Sinon.stub()
        };
        this.registry = new Registry(FakeMetadata, this.hooks);
        this.hasStub = Sinon.stub(this.registry, "has").returns(false);
        this.setStub = Sinon.stub(this.registry, "set");
        this.getStub = Sinon.stub(this.registry, "get").returns("instance");
        this.clazz = class {
        };

        this.result = this.registry.createIfNotExists("key");
      });

      after(() => {
        this.hasStub.restore();
        this.setStub.restore();
        this.getStub.restore();
      });

      it("should call Registry.has()", () => {
        this.hasStub.should.have.been.calledWithExactly("key");
      });

      it("should call Registry.set()", () => {
        this.setStub.should.have.been.calledWithExactly("key", Sinon.match.instanceOf(FakeMetadata));
      });

      it("should call Registry.get()", () => {
        this.getStub.should.have.been.calledWithExactly("key");
      });

      it("should return an instance of FakeMetadata", () => {
        expect(this.result).to.eq("instance");
      });

      it("should call the onCreate hook", () => {
        this.hooks.onCreate.should.have.been.calledWithExactly("key", Sinon.match.instanceOf(FakeMetadata));
      });
    });
  });
});
