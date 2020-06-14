import {expect} from "chai";
import {PlatformTest} from "@tsed/common";
import {Configuration} from "@tsed/di";
import * as Sinon from "sinon";
import {MongooseService} from "../../src";
import {MONGOOSE_CONNECTIONS} from "../../src/services/MongooseConnections";

const sandbox = Sinon.createSandbox();

describe("MongooseConnections", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should init connection with url", async () => {
    // GIVEN
    const connectStub = sandbox.stub().resolves("test");

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
    expect(connectStub).to.have.been.calledWithExactly("default", "mongodb://test", {options: "options"}, true);
  });
  it("should init with a list of connection", async () => {
    // GIVEN
    const connectStub = sandbox.stub().resolves("test");

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
    expect(connectStub).to.have.been.calledWithExactly("id", "mongodb://test", {options: "options"}, true);
  });
});
