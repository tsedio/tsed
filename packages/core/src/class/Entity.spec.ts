import {expect} from "chai";
import {Entity} from "./Entity";

class Test {
  method(arg1: any, arg2: any) {}
}

class EntityTest extends Entity {
  constructor(props: any) {
    super(props);
  }
}

describe("EntityDescription", () => {
  describe("getter / setter", () => {
    before(() => {});

    it("should create entity", () => {
      const entityDescription = new EntityTest({
        target: Test,
        propertyKey: "test",
        index: 0
      });
      // entityDescription.required = true;
      entityDescription.type = Test;
      // entityDescription.allowedRequiredValues = [null, ""];

      // expect(entityDescription.required)
      //   .to.be.a("boolean")
      //   .and.to.eq(true);

      expect(entityDescription.collectionType).to.eq(undefined);
      expect(entityDescription.type).to.eq(Test);
      expect(entityDescription.collectionName).to.eq("");
      expect(entityDescription.typeName).to.eq("Test");
      expect(entityDescription.isCollection).to.eq(false);
      // expect(entityDescription.allowedRequiredValues).to.deep.eq([null, ""]);
      expect(entityDescription.isDate).to.be.false;
      expect(entityDescription.isPrimitive).to.be.false;
      expect(entityDescription.isObject).to.be.false;
    });
  });
});
