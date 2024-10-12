import {Inject, Injectable} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {getJsonSchema, Groups, Name, Property, ReadOnly, Required} from "@tsed/schema";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";

import {Immutable, Model, MongooseModel, ObjectID, SchemaIgnore} from "../src/index.js";

class BaseModel {
  @ObjectID("id")
  @Required()
  @Groups("!create")
  _id: string;

  @Required()
  @Immutable()
  @ReadOnly()
  @SchemaIgnore()
  @Name("created_at")
  @Groups("!create", "!update")
  createdAt: number = Date.now();

  @Required()
  @ReadOnly()
  @SchemaIgnore()
  @Name("updated_at")
  @Groups("!create", "!update")
  updatedAt: number = Date.now();
}

@Model()
class DataSourceModel extends BaseModel {
  @Property()
  @ReadOnly()
  get test() {
    return "test";
  }
}

@Injectable()
class MyService {
  @Inject(DataSourceModel)
  model: MongooseModel<DataSourceModel>;

  save() {
    const instance = new this.model({});
    return instance.save();
  }
}

describe("Mongoose: ReadOnly", () => {
  beforeEach(() => TestContainersMongo.create());
  afterEach(() => TestContainersMongo.reset());
  it("should generate json schema", () => {
    const jsonSchema = getJsonSchema(DataSourceModel);

    expect(jsonSchema).toMatchSnapshot();
  });

  it("should generate model", async () => {
    const service = PlatformTest.get<MyService>(MyService);
    await service.save();

    const list = await service.model.find().exec();
    expect(list.length).toEqual(1);
    expect(list[0].toObject().test).toBeUndefined();
    expect(list[0].toClass().test).toEqual("test");
  });
});
