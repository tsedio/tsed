import {expect} from "chai";
import {Registry} from "../../../../src/core/class/Registry";

class FakeMetadata {
    attr1;
    attr2;

    constructor(public target) {
        console.log(target);
    }

    test() {
        return this.target;
    }
}

describe("Registry", () => {
    describe("constructor", () => {
        before(() => {
            this.registry = new Registry(FakeMetadata);
            this.clazz = class {
            };
        });
        it("should create new registry from class", () => {
            expect(!!this.registry).to.be.true;
        });
    });

    describe("set", () => {
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

    describe("has", () => {
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

    describe("get", () => {
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

    describe("entries", () => {
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

    describe("keys", () => {
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

    describe("clear", () => {
        it("should add a metadata", () => {
            this.registry.set(this.clazz, {test: true});
            expect(this.registry.size).to.equal(1);
        });

        it("should remove all keys", () => {
            this.registry.clear();
            expect(this.registry.size).to.equal(0);
        });
    });

    describe("clear", () => {
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

    describe("forEach", () => {
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
            const o = [];
            this.registry.forEach((e) => o.push(e));
            expect(o.length).to.equal(1);
        });
    });

    describe("values", () => {
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

    describe("merge", () => {
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
});
