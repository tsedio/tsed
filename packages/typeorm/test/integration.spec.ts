import {TestContext} from "@tsed/testing";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {User} from "./helpers/entity/User";
import {UserRepository} from "./helpers/repository/UserRepository";
import {Server} from "./helpers/Server";

describe("TypeORM integration", () => {
  beforeEach(async () => {
    await TestMongooseContext.install();
    const {url} = await TestMongooseContext.getMongooseOptions();
    const bstrp = TestContext.bootstrap(Server, {
      typeorm: [
        {
          name: "default",
          type: "mongodb",
          url,
          entities: [
            User
          ],
          useUnifiedTopology: true
        }
      ]
    });

    await bstrp();
  });
  afterEach(TestMongooseContext.reset);

  it("should return repository", () => {
    const repo: any = TestContext.injector.get(UserRepository)!;

    repo.should.instanceOf(UserRepository);
  });
});
