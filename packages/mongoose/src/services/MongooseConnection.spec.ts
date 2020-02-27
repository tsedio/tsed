import {Configuration} from "@tsed/di";
import {TestContext} from "@tsed/testing";
import * as Sinon from "sinon";
import {MongooseService} from "../../src";
import {MONGOOSE_CONNECTIONS} from "../../src/services/MongooseConnections";

const sandbox = Sinon.createSandbox();

describe("MongooseConnections", () => {
  beforeEach(TestContext.create);
  afterEach(TestContext.reset);

  it("should init connection with url", async () => {
    // GIVEN
    const connectStub = sandbox.stub().resolves("test");

    // WHEN
    await TestContext.invoke(MONGOOSE_CONNECTIONS, [
      {
        provide: Configuration,
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
        provide: MongooseService,
        use: {
          connect: connectStub
        }
      }
    ]);

    // THEN
    connectStub.should.have.been.calledWithExactly("default", "mongodb://test", {options: "options"});
  });
  it("should init connection with urls", async () => {
    // GIVEN
    const connectStub = sandbox.stub().resolves("test");

    // WHEN
    await TestContext.invoke(MONGOOSE_CONNECTIONS, [
      {
        provide: Configuration,
        use: {
          get() {
            return {
              urls: {
                db1: {
                  url: "mongodb://test",
                  connectionOptions: {options: "options"}
                }
              }
            };
          }
        }
      },
      {
        provide: MongooseService,
        use: {
          connect: connectStub
        }
      }
    ]);

    // THEN
    connectStub.should.have.been.calledWithExactly("db1", "mongodb://test", {options: "options"});
  });
});
