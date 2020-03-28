import {In, JsonOperation, JsonParameter, JsonSchemaStore, Property} from "@tsed/schema";
import {expect} from "chai";

describe("JsonSchemaStore", () => {
  it("should create JsonSchemaStore", () => {
    class Model {
      @Property()
      id: string;

      method(@In("path") param: string) {}
    }

    // CLASS
    const storeClass = JsonSchemaStore.from(Model);
    expect(storeClass).to.be.instanceOf(JsonSchemaStore);
    expect(storeClass.decoratorType).to.eq("class");
    expect(storeClass.propertyName).to.eq("undefined");
    expect(storeClass.propertyKey).to.eq(undefined);
    expect(storeClass.index).to.eq(undefined);
    expect(storeClass.parent).to.eq(storeClass);

    // PROPERTY
    const storeProp = JsonSchemaStore.from(Model).get("id");
    expect(storeProp).to.be.instanceOf(JsonSchemaStore);
    expect(storeProp?.decoratorType).to.eq("property");
    expect(storeProp?.propertyKey).to.eq("id");
    expect(storeProp?.propertyName).to.eq("id");
    expect(storeProp?.index).to.eq(undefined);
    expect(storeProp?.parameter).to.eq(undefined);
    expect(storeProp?.operation).to.eq(undefined);
    expect(storeProp?.nestedGenerics).to.deep.eq([]);
    expect(storeProp?.parent).to.deep.eq(storeClass);

    // METHOD
    const storeMethod = JsonSchemaStore.from(Model).get("method");
    expect(storeMethod).to.be.instanceOf(JsonSchemaStore);
    expect(storeMethod?.propertyKey).to.eq("method");
    expect(storeMethod?.propertyName).to.eq("method");
    expect(storeMethod?.decoratorType).to.eq("method");
    expect(storeMethod?.index).to.eq(undefined);
    expect(storeMethod?.parameter).to.eq(undefined);
    expect(storeMethod?.operation).to.be.instanceOf(JsonOperation);
    expect(storeMethod?.nestedGenerics).to.deep.eq([]);
    expect(storeProp?.parent).to.deep.eq(storeClass);

    // PARAMETERS
    const storeParam = JsonSchemaStore.from(Model)
      .get("method")
      ?.get(0);
    expect(storeParam).to.be.instanceOf(JsonSchemaStore);
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
});
