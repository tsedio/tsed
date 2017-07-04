import {CLASS_STORE, METHOD_STORE, PARAM_STORE, PROPERTY_STORE, Store} from "../../../../src/core/class/Store";
import {Metadata} from "../../../../src/core/class/Metadata";
import {expect, Sinon} from "../../../tools";

class FakeMetadata {
    attr1;
    attr2;

    constructor(public target) {

    }

    test() {
        return this.target;
    }
}

describe("Store", () => {
    describe("constructor", () => {


        describe("when metadata should be store on class", () => {

            before(() => {
                this.spyGet = Sinon.spy(Metadata, "get");
                this.store = new Store([FakeMetadata]);
                this.store2 = new Store([FakeMetadata]);
                this.store3 = new Store([class {
                }]);

                this.store.set("keyTest", {test: "2"});
            });
            after(() => {
                this.spyGet.restore();
                this.store.clear();
            });

            it("should have been called the Metadata.get()", () => {
                this.spyGet.should.have.been.calledWithExactly(CLASS_STORE, FakeMetadata);
            });

            it("should share the same StoreMap when the signature is equals", () => {
                expect(this.store.get("keyTest")).to.eq(this.store2.get("keyTest"));
            });

            it("should not share the same StoreMap when the signature is not equals", () => {
                expect(this.store.get("keyTest")).not.to.eq(this.store3.get("keyTest"));
            });
        });

        describe("when metadata should be store on method", () => {
            before(() => {
                this.spyGet = Sinon.spy(Metadata, "get");
                this.store = new Store([FakeMetadata, "get", {test: "test"}]);
            });
            after(() => {
                this.spyGet.restore();
            });

            it("should have been called the Metadata.get()", () => {
                this.spyGet.should.have.been.calledWithExactly(METHOD_STORE, FakeMetadata, "get");
            });
        });
        describe("when metadata should be store on property", () => {

            before(() => {
                this.spyGet = Sinon.spy(Metadata, "get");
                this.store = new Store([FakeMetadata, "get"]);
            });
            after(() => {
                this.spyGet.restore();
            });

            it("should have been called the Metadata.get()", () => {
                this.spyGet.should.have.been.calledWithExactly(PROPERTY_STORE, FakeMetadata, "get");
            });
        });

        describe("when metadata should be store on parameters", () => {
            before(() => {
                this.spyGet = Sinon.spy(Metadata, "get");
                this.store = new Store([FakeMetadata, "get", 0]);
            });
            after(() => {
                this.spyGet.restore();
            });

            it("should have been called the Metadata.get()", () => {
                this.spyGet.should.have.been.calledWithExactly(PARAM_STORE, FakeMetadata, "get");
            });
        });

    });

    describe("set()", () => {
        before(() => {
            this.store = new Store([FakeMetadata]);
            this.store.set("key", {});
        });
        it("should add a metadata", () => {
            expect(this.store.size).to.equal(1);
        });
    });

    describe("has()", () => {
        before(() => {
            this.store = new Store([FakeMetadata]);
        });
        it("should add a metadata", () => {
            this.store.set("key", {});
            expect(this.store.size).to.equal(1);
        });
        it("should return true if class is known", () =>
            expect(this.store.has("key")).to.be.true
        );
        it("should return false if class is unknown", () =>
            expect(this.store.has("key2")).to.be.false
        );
    });

    describe("get()", () => {
        before(() => {
            this.store = new Store([FakeMetadata]);
        });
        it("should add a metadata", () => {
            this.store.set("key", {test: true});
            expect(this.store.size).to.equal(1);
        });
        it("should get metadata", () => {
            expect(this.store.get("key").test).to.be.true;
        });
    });

    describe("entries()", () => {
        before(() => {
            this.store = new Store([FakeMetadata]);
        });
        it("should add a metadata", () => {
            this.store.set("key", {test: true});
            expect(this.store.size).to.equal(1);
        });

        it("should return entries", () => {
            expect(typeof this.store.entries()).to.equal("object");
        });
    });

    describe("keys()", () => {
        before(() => {
            this.store = new Store([FakeMetadata]);
            this.store.set("test", {test: true});
        });

        it("should return the keys", () => {
            expect(typeof this.store.keys()).to.equal("object");
        });
    });

    describe("clear()", () => {
        before(() => {
            this.store.set("key", {test: true});
            this.store.clear();
        });

        it("should remove all keys", () => {
            expect(this.store.size).to.equal(0);
        });
    });

    describe("delete()", () => {
        before(() => {
            this.store = new Store([FakeMetadata]);
        });
        it("should add a metadata", () => {
            this.store.set("key", {test: true});
            expect(this.store.size).to.equal(1);
        });

        it("should remove all keys", () => {
            this.store.delete("key");
            expect(this.store.size).to.equal(0);
        });
    });

    describe("forEach()", () => {
        before(() => {
            this.store = new Store([FakeMetadata]);
        });
        it("should add a metadata", () => {
            this.store.set("key", {test: true});
            expect(this.store.size).to.equal(1);
        });

        it("should loop for each item stored in registry", () => {
            const o = [];
            this.store.forEach((e) => o.push(e));
            expect(o.length).to.equal(1);
        });
    });

    describe("values()", () => {
        before(() => {
            this.store = new Store([FakeMetadata]);
        });
        it("should add a metadata", () => {
            this.store.set("key", {test: true});
            expect(this.store.size).to.equal(1);
        });

        it("should return the values", () => {
            expect(typeof this.store.values()).to.equal("object");
        });
    });

    describe("merge()", () => {
        before(() => {
            this.store = new Store([FakeMetadata]);
            this.store.merge("key3", {attr1: 1});
            this.store.merge("key3", {attr2: 2});
        });

        it("should merge metadata", () => {
            expect(this.store.get("key3")).to.deep.equal({attr1: 1, attr2: 2});
        });
    });

    describe("storeValues()", () => {
        before(() => {
            this.store = new Store([FakeMetadata]);
            this.store.storeValues({"content": "json", "content2": "json2"});
        });

        it("should store data", () => {
            expect(this.store.get("content")).to.eq("json");
        });
        it("should store data", () => {
            expect(this.store.get("content2")).to.eq("json2");
        });
    });
});
