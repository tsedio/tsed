import {Property} from "@tsed/schema";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";

import {getSchema, Model, MongooseSchema, ObjectID} from "../src/index.js";

@MongooseSchema()
export class TestSubDocument {
  @Property()
  prop: string;
}

@Model()
export class TestModelDocument {
  @ObjectID()
  _id: string;

  @Property()
  sub: TestSubDocument;
}

describe("Mongoose", () => {
  describe("SubDocument", () => {
    beforeEach(() => TestContainersMongo.create());
    afterEach(() => TestContainersMongo.reset());

    it("should create model with sub document", () => {
      const documentSchema: any = getSchema(TestModelDocument);
      const subDocumentSchema: any = getSchema(TestSubDocument);

      expect(documentSchema.obj.sub.type.obj.prop.type).toBe(String);
      expect(documentSchema.obj.sub.type).toBe(subDocumentSchema);
      expect(subDocumentSchema.obj.prop.type).toBe(String);
    });
  });
});
