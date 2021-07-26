import {serialize} from "@tsed/json-mapper";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import {Server} from "./helpers/Server";
import {MongooseModel} from "../src/interfaces/MongooseModel";
import {Integer, Required} from "@tsed/schema";
import {Model, ObjectID, VersionKey} from "../src";

describe("Mongoose", () => {
  describe("Versioning", () => {
    @Model()
    class ModelWithoutVersion {
      @ObjectID()
      _id: string;

      @Required()
      prop: string;
    }

    @Model()
    class ModelWithCustomVersion {
      @ObjectID()
      _id: string;

      @Integer()
      @VersionKey()
      version: number;

      @Required()
      tags: Array<string>;
    }

    beforeEach(TestMongooseContext.bootstrap(Server));
    afterEach(TestMongooseContext.clearDatabase);
    afterEach(TestMongooseContext.reset);

    it("should save and retrieve version key field", async () => {
      const versionModel = TestMongooseContext.get<MongooseModel<ModelWithCustomVersion>>(ModelWithCustomVersion);

      const testObject = await versionModel.create({tags: []});
      expect(testObject.tags).to.eql([]);
      expect(testObject).to.not.include.keys(["version"]);
      expect(testObject.version).to.eq(0);

      testObject.tags.push("awesome");
      await testObject.save();
      expect(testObject.version).to.eq(1);

      const retrievedDataModel = await versionModel.findById(testObject.id);
      const deserializedObject = retrievedDataModel.toClass();

      expect(deserializedObject instanceof ModelWithCustomVersion).to.be.true;
      expect(testObject.tags).to.eql(["awesome"]);
      expect(deserializedObject.version).to.eq(1);

      const serializedObject = serialize(deserializedObject);
      expect(serializedObject).to.deep.equal({_id: testObject.id, version: 1, tags: ["awesome"]});
    });

    it("should not serialize __v field by default", async () => {
      const dataModel = TestMongooseContext.get<MongooseModel<ModelWithoutVersion>>(ModelWithoutVersion);

      const testObject = await dataModel.create({prop: "Test"});
      const deserializedObject = testObject.toClass();

      expect(deserializedObject instanceof ModelWithoutVersion).to.be.true;
      expect(deserializedObject).to.not.have.any.keys("__v");

      const serializedObject = serialize(deserializedObject);
      expect(serializedObject).to.deep.equal({_id: testObject.id, prop: "Test"});
    });
  });
});
