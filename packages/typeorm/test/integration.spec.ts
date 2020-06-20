import {PlatformTest} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
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
          name: "default",
          type: "mongodb",
          url,
          entities: [
            User
          ],
          useUnifiedTopology: true
        },
        {
          name: "db2",
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
    const service = PlatformTest.injector.get<UserService>(UserService)!;

    service.should.instanceOf(UserService);
    service.repo1.should.instanceOf(UserRepository);
    service.repo1.manager.connection.name.should.equal("default");

    service.repo3.should.instanceOf(UserRepository);
    service.repo3.manager.connection.name.should.equal("db2");
    service.repo4.should.instanceOf(UserRepository);
    service.repo4.manager.connection.name.should.equal("db2");

    service.repo2.should.instanceOf(UserRepository);
    service.repo2.manager.connection.name.should.equal("default");
  });
});
