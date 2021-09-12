import {PlatformTest} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import {User} from "./helpers/entity/User";
import {UserRepository} from "./helpers/repository/UserRepository";
import {Server} from "./helpers/Server";
import {UserService} from "./helpers/services/UserService";

describe("TypeORM integration", () => {
  beforeEach(async () => {
    await TestMongooseContext.install();
    const {url} = await TestMongooseContext.getMongooseOptions();
    const bstrp = PlatformTest.bootstrap(Server, {
      typeorm: [
        {
          type: "mongodb",
          url,
          entities: [User],
          useUnifiedTopology: true
        },
        {
          name: "db2",
          type: "mongodb",
          url,
          entities: [User],
          useUnifiedTopology: true
        }
      ]
    });

    await bstrp();
  });
  afterEach(TestMongooseContext.reset);

  it("should return repository", () => {
    const service = PlatformTest.injector.get<UserService>(UserService)!;
    const repository = PlatformTest.injector.get(UserRepository);

    expect(!!repository).to.equal(true);
    expect(service).to.instanceOf(UserService);
    expect(service.repo1).to.instanceOf(UserRepository);
    expect(service.repo1.manager.connection.name).to.equal("default");

    expect(service.repo3).to.instanceOf(UserRepository);
    expect(service.repo3.manager.connection.name).to.equal("db2");
    expect(service.repo4).to.instanceOf(UserRepository);
    expect(service.repo4.manager.connection.name).to.equal("db2");

    expect(service.repo2).to.instanceOf(UserRepository);
    expect(service.repo2.manager.connection.name).to.equal("default");
  });
});
