import {Property} from "@tsed/schema";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import { expect } from 'chai';
import {getSchema, Model, MongooseSchema, ObjectID} from "../src";

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
    beforeEach(TestMongooseContext.create);
    afterEach(TestMongooseContext.reset);

    it(
      "should create model with sub document",
      () => {
        const documentSchema = getSchema(TestModelDocument);
        const subDocumentSchema = getSchema(TestSubDocument);

        expect(documentSchema.obj.sub.type.obj.prop.type).to.equal(String)
        expect(documentSchema.obj.sub.type).to.equal(subDocumentSchema)
        expect(subDocumentSchema.obj.prop.type).to.equal(String)
      });
  });
});
