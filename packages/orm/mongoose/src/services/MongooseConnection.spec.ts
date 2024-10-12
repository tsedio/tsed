import {Configuration} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

import {MongooseService} from "../../src/index.js";
import {MONGOOSE_CONNECTIONS} from "../../src/services/MongooseConnections.js";

describe("MongooseConnections", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should init connection with url", async () => {
    // GIVEN
    const connectStub = vi.fn().mockResolvedValue("test");

    // WHEN
    await PlatformTest.invoke(MONGOOSE_CONNECTIONS, [
      {
        token: Configuration,
        use: {
          get() {
            return {
              url: "mongodb://test",
              connectionOptions: {options: "options"}
            };
          }
        }
      },
      {
        token: MongooseService,
        use: {
          connect: connectStub
        }
      }
    ]);

    // THEN
    expect(connectStub).toHaveBeenCalledWith("default", "mongodb://test", {options: "options"}, true);
  });
  it("should init with a list of connection", async () => {
    // GIVEN
    const connectStub = vi.fn().mockResolvedValue("test");

    // WHEN
    await PlatformTest.invoke(MONGOOSE_CONNECTIONS, [
      {
        token: Configuration,
        use: {
          get() {
            return [
              {
                id: "id",
                url: "mongodb://test",
                connectionOptions: {options: "options"}
              }
            ];
          }
        }
      },
      {
        token: MongooseService,
        use: {
          connect: connectStub
        }
      }
    ]);

    // THEN
    expect(connectStub).toHaveBeenCalledWith("id", "mongodb://test", {options: "options"}, true);
  });
});
