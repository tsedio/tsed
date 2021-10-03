import {In, JsonEntityStore, JsonOperation, JsonParameter, Property, Required, Allow} from "@tsed/schema";
import {expect} from "chai";
import {classOf, Metadata} from "@tsed/core";

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
  it("should manage enum from babel", () => {
    enum MyEnum {
      test = "test"
    }

    const decorator = () => (...args: any[]) => console.log(args);

    class Model {
      @decorator()
      test: MyEnum;
    }

    Reflect.defineMetadata("design:type", MyEnum, Model.prototype, "test");

    // CLASS
    Property()(Model.prototype, "test");
    const store = JsonEntityStore.from(Model, "test");

    expect(store.type).to.deep.eq(String);
  });
});
