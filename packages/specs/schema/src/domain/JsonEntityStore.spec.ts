import {
  Allow,
  In,
  JsonEntityStore,
  JsonMethodStore,
  JsonOperation,
  JsonParameter,
  JsonParameterStore,
  JsonPropertyStore,
  Property,
  Required
} from "../index.js";

describe("JsonEntityStore", () => {
  it("should create JsonEntityStore", () => {
    class Model {
      @Property()
      id: string;

      method(@In("path") param: string) {}
    }

    // CLASS
    const storeClass = JsonEntityStore.from(Model);

    expect(storeClass).toBeInstanceOf(JsonEntityStore);
    expect(storeClass.decoratorType).toBe("class");
    expect(storeClass.propertyName).toBe("undefined");
    expect(storeClass.propertyKey).toBeUndefined();
    expect(storeClass.index).toBeUndefined();
    expect(storeClass.parent).toBe(storeClass);
    expect(storeClass.type).toEqual(Model);
    expect(storeClass.target).toEqual(Model);
    expect(storeClass.token).toEqual(Model);
    expect(storeClass.isCollection).toBe(false);
    expect(storeClass.isDate).toBe(false);
    expect(storeClass.isPrimitive).toBe(false);
    expect(storeClass.isObject).toBe(false);
    expect(storeClass.isClass).toBe(true);
    expect(storeClass.isDiscriminatorChild).toBe(false);
    expect(storeClass.getBestType()).toBe(Model);

    // PROPERTY
    const storeProp = JsonEntityStore.from(Model).children.get("id") as JsonPropertyStore;
    expect(storeProp).toBeInstanceOf(JsonEntityStore);
    expect(storeProp.decoratorType).toBe("property");
    expect(storeProp.propertyKey).toBe("id");
    expect(storeProp.propertyName).toBe("id");
    expect(storeProp.index).toBeUndefined();
    expect(storeProp.nestedGenerics).toEqual([]);
    expect(storeProp.parent).toEqual(storeClass);
    expect(storeProp.type).toEqual(String);
    expect(storeProp.target).toEqual(Model);
    expect(storeProp.token).toEqual(Model);
    expect(storeProp.isCollection).toBe(false);
    expect(storeProp.isDate).toBe(false);
    expect(storeProp.isPrimitive).toBe(true);
    expect(storeProp.isObject).toBe(false);
    expect(storeProp.isClass).toBe(false);
    expect(storeProp.isGetterOnly()).toBeFalsy();

    // METHOD
    const storeMethod = JsonEntityStore.from(Model).children.get("method") as JsonMethodStore;
    expect(storeMethod).toBeInstanceOf(JsonEntityStore);
    expect(storeMethod.propertyKey).toBe("method");
    expect(storeMethod.propertyName).toBe("method");
    expect(storeMethod.decoratorType).toBe("method");
    expect(storeMethod.index).toBeUndefined();
    expect(storeMethod.operation).toBeInstanceOf(JsonOperation);
    expect(storeMethod.nestedGenerics).toEqual([]);
    expect(storeMethod.parent).toEqual(storeClass);
    expect(storeMethod.target).toEqual(Model);
    expect(storeMethod.type).toEqual(Object);
    expect(storeMethod.target).toEqual(Model);
    expect(storeMethod.token).toEqual(Model);
    expect(storeMethod.isCollection).toBe(false);
    expect(storeMethod.isDate).toBe(false);
    expect(storeMethod.isPrimitive).toBe(false);
    expect(storeMethod.isObject).toBe(false);
    expect(storeMethod.isClass).toBe(false);

    // PARAMETERS
    const storeParam = JsonEntityStore.from(Model).children.get("method")?.children.get(0) as JsonParameterStore;
    expect(storeParam).toBeInstanceOf(JsonEntityStore);
    expect(storeParam.propertyKey).toBe("method");
    expect(storeParam.propertyName).toBe("method");
    expect(storeParam.index).toBe(0);
    expect(storeParam.decoratorType).toBe("parameter");
    expect(storeParam.parameter).toBeInstanceOf(JsonParameter);
    expect(storeParam.nestedGenerics).toEqual([]);
    expect(storeParam.parent).toEqual(storeMethod);
    expect(storeParam.type).toEqual(String);
    expect(storeParam.target).toEqual(Model);
    expect(storeParam.token).toEqual(Model);
    expect(storeParam.isCollection).toBe(false);
    expect(storeParam.isDate).toBe(false);
    expect(storeParam.isPrimitive).toBe(true);
    expect(storeParam.isObject).toBe(false);
    expect(storeParam.isClass).toBe(false);
    expect(storeParam.isGetterOnly()).toBe(false);
    expect(storeParam.toString()).toBe("Model:method:0");
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

    expect(store.type).toEqual(String);
  });

  describe("isGetterOnly()", () => {
    it("should create JsonEntityStore on getter", () => {
      class Model {
        @Property()
        get id() {
          return "id";
        }
      }

      // CLASS
      // PROPERTY
      const storeProp = JsonEntityStore.from(Model).children.get("id") as JsonPropertyStore;
      expect(storeProp.isGetterOnly()).toBeTruthy();
    });
    it("should create JsonEntityStore on getter/setter", () => {
      class Model {
        @Property()
        get id() {
          return "id";
        }
        set id(id: string) {}
      }

      // CLASS
      // PROPERTY
      const storeProp = JsonEntityStore.from(Model).children.get("id") as JsonPropertyStore;
      expect(storeProp.isGetterOnly()).toBeFalsy();
    });
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

      expect(propertyMetadata.required).toEqual(true);

      expect(propertyMetadata.collectionType).toEqual(undefined);
      expect(propertyMetadata.type).toEqual(Test);
      expect(propertyMetadata.isCollection).toEqual(false);
    });
  });

  describe("isRequired", () => {
    describe("when property is required", () => {
      class Test {
        @Required(true)
        test: string;
      }

      let propertyMetadata: JsonEntityStore;

      beforeAll(() => {
        propertyMetadata = JsonEntityStore.get(Test, "test");
        propertyMetadata.required = true;
      });
      it("should return false (value 0)", () => {
        expect(propertyMetadata.isRequired(0)).toEqual(false);
      });

      it("should return true (value '')", () => {
        expect(propertyMetadata.isRequired("")).toEqual(true);
      });
      it("should return true (value null)", () => {
        expect(propertyMetadata.isRequired(null)).toEqual(true);
      });
      it("should return true (value undefined)", () => {
        expect(propertyMetadata.isRequired(undefined)).toEqual(true);
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

        expect(propertyMetadata.allowedRequiredValues).toEqual([null]);
        expect(propertyMetadata.isRequired(0)).toEqual(false);
        expect(propertyMetadata.isRequired("")).toEqual(true);
        expect(propertyMetadata.isRequired(null)).toEqual(false);
        expect(propertyMetadata.isRequired(undefined)).toEqual(true);
      });

      it("should validate the required values (2)", () => {
        class Test {
          @Allow("")
          test: string;
        }

        let propertyMetadata: JsonEntityStore;
        propertyMetadata = JsonEntityStore.get(Test, "test");

        expect(propertyMetadata.allowedRequiredValues).toEqual([""]);
        expect(propertyMetadata.isRequired(0)).toEqual(false);
        expect(propertyMetadata.isRequired("")).toEqual(false);
        expect(propertyMetadata.isRequired(null)).toEqual(true);
        expect(propertyMetadata.isRequired(undefined)).toEqual(true);
      });

      it("should validate the required values (3)", () => {
        class Test {
          @Allow("")
          test: string;
        }

        let propertyMetadata: JsonEntityStore;
        propertyMetadata = JsonEntityStore.get(Test, "test");

        expect(propertyMetadata.allowedRequiredValues).toEqual([""]);
        expect(propertyMetadata.isRequired(0)).toEqual(false);
        expect(propertyMetadata.isRequired("")).toEqual(false);
        expect(propertyMetadata.isRequired(null)).toEqual(true);
        expect(propertyMetadata.isRequired(undefined)).toEqual(true);
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
        expect(propertyMetadata.isRequired(0)).toEqual(false);
        expect(propertyMetadata.isRequired("")).toEqual(false);
        expect(propertyMetadata.isRequired(null)).toEqual(false);
        expect(propertyMetadata.isRequired(undefined)).toEqual(false);
      });
    });
  });

  describe("get()", () => {
    class Test {
      test: string;
    }

    it("should return the propertyMetadata", () => {
      const propertyMetadata = JsonEntityStore.get(Test, "test");
      expect(propertyMetadata).toBeInstanceOf(JsonEntityStore);
    });
  });
});
