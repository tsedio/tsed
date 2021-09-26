import {In, JsonOperation, JsonParameter, JsonEntityStore, Property, Required, Allow} from "@tsed/schema";
import {expect} from "chai";

describe("JsonEntityStore", () => {
  it("should create JsonEntityStore", () => {
    class Model {
      @Property()
      id: string;

      method(@In("path") param: string) {}
    }

    // CLASS
    const storeClass = JsonEntityStore.from(Model);
    expect(storeClass).to.be.instanceOf(JsonEntityStore);
    expect(storeClass.decoratorType).to.eq("class");
    expect(storeClass.propertyName).to.eq("undefined");
    expect(storeClass.propertyKey).to.eq(undefined);
    expect(storeClass.index).to.eq(undefined);
    expect(storeClass.parent).to.eq(storeClass);

    // PROPERTY
    const storeProp = JsonEntityStore.from(Model).children.get("id");
    expect(storeProp).to.be.instanceOf(JsonEntityStore);
    expect(storeProp?.decoratorType).to.eq("property");
    expect(storeProp?.propertyKey).to.eq("id");
    expect(storeProp?.propertyName).to.eq("id");
    expect(storeProp?.index).to.eq(undefined);
    expect(storeProp?.parameter).to.eq(undefined);
    expect(storeProp?.operation).to.eq(undefined);
    expect(storeProp?.nestedGenerics).to.deep.eq([]);
    expect(storeProp?.parent).to.deep.eq(storeClass);

    // METHOD
    const storeMethod = JsonEntityStore.from(Model).children.get("method");
    expect(storeMethod).to.be.instanceOf(JsonEntityStore);
    expect(storeMethod?.propertyKey).to.eq("method");
    expect(storeMethod?.propertyName).to.eq("method");
    expect(storeMethod?.decoratorType).to.eq("method");
    expect(storeMethod?.index).to.eq(undefined);
    expect(storeMethod?.parameter).to.eq(undefined);
    expect(storeMethod?.operation).to.be.instanceOf(JsonOperation);
    expect(storeMethod?.nestedGenerics).to.deep.eq([]);
    expect(storeProp?.parent).to.deep.eq(storeClass);

    // PARAMETERS
    const storeParam = JsonEntityStore.from(Model).children.get("method")?.children.get(0);
    expect(storeParam).to.be.instanceOf(JsonEntityStore);
    expect(storeParam?.propertyKey).to.eq("method");
    expect(storeParam?.propertyName).to.eq("method");
    expect(storeParam?.index).to.eq(0);
    expect(storeParam?.decoratorType).to.eq("parameter");
    expect(storeParam?.parameter).to.be.instanceOf(JsonParameter);
    expect(storeParam?.operation).to.eq(undefined);
    expect(storeParam?.nestedGenerics).to.deep.eq([]);
    expect(storeParam?.nestedGenerics).to.deep.eq([]);
    expect(storeParam?.parent).to.deep.eq(storeMethod);
  });

  describe("required() and allowRequiredValues", () => {
    it("should return the required value", () => {
      class Test {
        @Required(true)
        @Allow(null, "")
        test: string;
      }

      const propertyMetadata = JsonEntityStore.get(Test, "test");
      propertyMetadata.required = true;
      propertyMetadata.type = Test;

      expect(propertyMetadata.required).to.be.a("boolean").and.to.eq(true);

      expect(propertyMetadata.collectionType).to.eq(undefined);
      expect(propertyMetadata.type).to.eq(Test);
      expect(propertyMetadata.isCollection).to.eq(false);
    });
  });

  describe("isRequired", () => {
    describe("when property is required", () => {
      class Test {
        @Required(true)
        test: string;
      }

      let propertyMetadata: JsonEntityStore;

      before(() => {
        propertyMetadata = JsonEntityStore.get(Test, "test");
        propertyMetadata.required = true;
      });
      it("should return false (value 0)", () => {
        expect(propertyMetadata.isRequired(0)).to.be.false;
      });

      it("should return true (value '')", () => {
        expect(propertyMetadata.isRequired("")).to.be.true;
      });
      it("should return true (value null)", () => {
        expect(propertyMetadata.isRequired(null)).to.be.true;
      });
      it("should return true (value undefined)", () => {
        expect(propertyMetadata.isRequired(undefined)).to.be.true;
      });
    });

    describe("when property is required and have allowed values", () => {
      it("should validate the required values", () => {
        class Test {
          @Required()
          @Allow(null)
          test: string;
        }

        let propertyMetadata: JsonEntityStore;
        propertyMetadata = JsonEntityStore.get(Test, "test");

        expect(propertyMetadata.allowedRequiredValues).to.deep.eq([null]);
        expect(propertyMetadata.isRequired(0)).to.be.false;
        expect(propertyMetadata.isRequired("")).to.be.true;
        expect(propertyMetadata.isRequired(null)).to.be.false;
        expect(propertyMetadata.isRequired(undefined)).to.be.true;
      });

      it("should validate the required values (2)", () => {
        class Test {
          @Allow("")
          test: string;
        }

        let propertyMetadata: JsonEntityStore;
        propertyMetadata = JsonEntityStore.get(Test, "test");

        expect(propertyMetadata.allowedRequiredValues).to.deep.eq([""]);
        expect(propertyMetadata.isRequired(0)).to.be.false;
        expect(propertyMetadata.isRequired("")).to.be.false;
        expect(propertyMetadata.isRequired(null)).to.be.true;
        expect(propertyMetadata.isRequired(undefined)).to.be.true;
      });

      it("should validate the required values (3)", () => {
        class Test {
          @Allow("")
          test: string;
        }

        let propertyMetadata: JsonEntityStore;
        propertyMetadata = JsonEntityStore.get(Test, "test");

        expect(propertyMetadata.allowedRequiredValues).to.deep.eq([""]);
        expect(propertyMetadata.isRequired(0)).to.be.false;
        expect(propertyMetadata.isRequired("")).to.be.false;
        expect(propertyMetadata.isRequired(null)).to.be.true;
        expect(propertyMetadata.isRequired(undefined)).to.be.true;
      });
    });

    describe("when property is not required", () => {
      it("should validate values", () => {
        class Test {
          @Required(false)
          test: string;
        }

        const propertyMetadata = JsonEntityStore.get(Test, "test");
        propertyMetadata.required = false;
        expect(propertyMetadata.isRequired(0)).to.be.false;
        expect(propertyMetadata.isRequired("")).to.be.false;
        expect(propertyMetadata.isRequired(null)).to.be.false;
        expect(propertyMetadata.isRequired(undefined)).to.be.false;
      });
    });
  });

  describe("get()", () => {
    class Test {
      test: string;
    }

    it("should return the propertyMetadata", () => {
      const propertyMetadata = JsonEntityStore.get(Test, "test");
      expect(propertyMetadata).to.be.an.instanceof(JsonEntityStore);
    });
  });
});
