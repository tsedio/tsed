import {
  In,
  JsonEntityStore,
  JsonMethodStore,
  JsonOperation,
  JsonParameter,
  JsonParameterStore,
  JsonPropertyStore,
  Property
} from "@tsed/schema";
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
    expect(storeClass.type).to.deep.eq(Model);
    expect(storeClass.target).to.deep.eq(Model);
    expect(storeClass.token).to.deep.eq(Model);
    expect(storeClass.isCollection).to.eq(false);
    expect(storeClass.isDate).to.be.false;
    expect(storeClass.isPrimitive).to.be.false;
    expect(storeClass.isObject).to.be.false;
    expect(storeClass.isClass).to.be.true;

    // PROPERTY
    const storeProp = JsonEntityStore.from(Model).children.get("id") as JsonPropertyStore;
    expect(storeProp).to.be.instanceOf(JsonEntityStore);
    expect(storeProp.decoratorType).to.eq("property");
    expect(storeProp.propertyKey).to.eq("id");
    expect(storeProp.propertyName).to.eq("id");
    expect(storeProp.index).to.eq(undefined);
    expect(storeProp.nestedGenerics).to.deep.eq([]);
    expect(storeProp.parent).to.deep.eq(storeClass);
    expect(storeProp.type).to.deep.eq(String);
    expect(storeProp.target).to.deep.eq(Model);
    expect(storeProp.token).to.deep.eq(Model);
    expect(storeProp.isCollection).to.eq(false);
    expect(storeProp.isDate).to.be.false;
    expect(storeProp.isPrimitive).to.be.true;
    expect(storeProp.isObject).to.be.false;
    expect(storeProp.isClass).to.be.false;

    // METHOD
    const storeMethod = JsonEntityStore.from(Model).children.get("method") as JsonMethodStore;
    expect(storeMethod).to.be.instanceOf(JsonEntityStore);
    expect(storeMethod.propertyKey).to.eq("method");
    expect(storeMethod.propertyName).to.eq("method");
    expect(storeMethod.decoratorType).to.eq("method");
    expect(storeMethod.index).to.eq(undefined);
    expect(storeMethod.operation).to.be.instanceOf(JsonOperation);
    expect(storeMethod.nestedGenerics).to.deep.eq([]);
    expect(storeMethod.parent).to.deep.eq(storeClass);
    expect(storeMethod.target).to.deep.eq(Model);
    expect(storeMethod.type).to.deep.eq(Object);
    expect(storeMethod.target).to.deep.eq(Model);
    expect(storeMethod.token).to.deep.eq(Model);
    expect(storeMethod.isCollection).to.eq(false);
    expect(storeMethod.isDate).to.be.false;
    expect(storeMethod.isPrimitive).to.be.false;
    expect(storeMethod.isObject).to.be.false;
    expect(storeMethod.isClass).to.be.false;

    // PARAMETERS
    const storeParam = JsonEntityStore.from(Model).children.get("method")?.children.get(0) as JsonParameterStore;
    expect(storeParam).to.be.instanceOf(JsonEntityStore);
    expect(storeParam.propertyKey).to.eq("method");
    expect(storeParam.propertyName).to.eq("method");
    expect(storeParam.index).to.eq(0);
    expect(storeParam.decoratorType).to.eq("parameter");
    expect(storeParam.parameter).to.be.instanceOf(JsonParameter);
    expect(storeParam.nestedGenerics).to.deep.eq([]);
    expect(storeParam.parent).to.deep.eq(storeMethod);
    expect(storeParam.type).to.deep.eq(String);
    expect(storeParam.target).to.deep.eq(Model);
    expect(storeParam.token).to.deep.eq(Model);
    expect(storeParam.isCollection).to.eq(false);
    expect(storeParam.isDate).to.be.false;
    expect(storeParam.isPrimitive).to.be.true;
    expect(storeParam.isObject).to.be.false;
    expect(storeParam.isClass).to.be.false;
  });
  it("should manage enum from babel", () => {
    enum MyEnum {
      test = "test"
    }

    class Model {
      test: MyEnum;
    }

    Reflect.defineMetadata("design:type", MyEnum, Model.prototype, "test");

    // CLASS
    Property()(Model.prototype, "test");
    const store = JsonEntityStore.from(Model, "test");

    expect(store.type).to.deep.eq(String);
  });
});
