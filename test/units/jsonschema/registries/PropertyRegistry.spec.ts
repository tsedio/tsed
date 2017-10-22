import {PropertyMetadata} from "../../../../src/jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {expect, Sinon} from "../../../tools";

class Test {
}

class Parent {
    id: string;
    name: string;
}

class Children extends Parent {
    id: string;
    test: string;
}

describe("PropertyRegistry", () => {
    describe("get()", () => {
        before(() => {
            this.propertyMetadata = PropertyRegistry.get(Test, "test");
        });

        it("should return the propertyMetadata", () => {
            expect(this.propertyMetadata).to.be.an.instanceof(PropertyMetadata);
        });
    });

    describe("required()", () => {
        before(() => {
            PropertyRegistry.required(Test, "test", [null, ""]);
            this.propertyMetadata = PropertyRegistry.get(Test, "test");
        });

        it("should return the propertyMetadata", () => {
            expect(this.propertyMetadata).to.be.an.instanceof(PropertyMetadata);
        });
        it("should be required", () => {
            expect(this.propertyMetadata.required).to.eq(true);
        });
        it("should be allowedRequiredValues", () => {
            expect(this.propertyMetadata.allowedRequiredValues).to.deep.eq([null, ""]);
        });
    });

    describe("getProperties()", () => {
        before(() => {
            PropertyRegistry.get(Children, "id");
            PropertyRegistry.get(Children, "test");
            PropertyRegistry.get(Parent, "id");
            PropertyRegistry.get(Parent, "name");
        });

        describe("when is the Parent class", () => {
            before(() => {
                this.result = PropertyRegistry.getProperties(Children);
            });
            it("should have a property id metadata from Children class", () => {
                expect(this.result.get("id").targetName).to.eq("Children");
            });

            it("should have a property name metadata from Parent class", () => {
                expect(this.result.get("name").targetName).to.eq("Parent");
            });

            it("should have a property name metadata from Parent class", () => {
                expect(this.result.get("test").targetName).to.eq("Children");
            });
        });

        describe("when is the Parent class", () => {
            before(() => {
                this.result = PropertyRegistry.getProperties(Parent);
            });
            it("should have a property name metadata from Parent class", () => {
                return expect(this.result.has("test")).to.be.false;
            });

            it("should have a property id metadata from Children class", () => {
                expect(this.result.get("id").targetName).to.eq("Parent");
            });

            it("should have a property name metadata from Parent class", () => {
                expect(this.result.get("name").targetName).to.eq("Parent");
            });
        });

    });
    describe("decorate()", () => {
        before(() => {
            this.getStub = Sinon.stub(PropertyRegistry, "get");
            this.getStub.returns({schema: "schema"});
            this.decoratorStub = Sinon.stub();
            this.cbStub = Sinon.stub().returns(this.decoratorStub);
            PropertyRegistry.decorate(this.cbStub)(Test, "test");
        });

        after(() => {
            this.getStub.restore();
        });

        it("should call PropertyRegistry.get()", () => {
            this.getStub.should.be.calledWithExactly(Test, "test");
        });

        it("should call the fn callback with the correct parameters", () => {
            this.cbStub.should.be.calledWithExactly({schema: "schema"}, [Test, "test"]);
        });

        it("should cal the decorators returned by the fn callback", () => {
            this.decoratorStub.should.be.calledWithExactly(Test, "test");
        });
    });
});