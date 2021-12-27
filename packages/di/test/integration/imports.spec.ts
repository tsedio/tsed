import {DITest, Inject, Injectable, Module} from "../../src";
import Sinon from "sinon";
import {expect} from "chai";
import {PlatformTest} from "@tsed/common/src";

@Injectable()
class MyService {
  createConnection() {
  }
}

@Module()
class MyModule {
  @Inject()
  myService: MyService;

  $onInit() {
    this.myService.createConnection();
  }
}

describe("DITest", () => {
  beforeEach(() => DITest.create({
    imports: [
      {
        token: MyService,
        use: {
          createConnection: Sinon.stub()
        }
      }
    ]
  }));

  it("should create container with stubbed service", () => {
    const service = DITest.get(MyService);
    expect(service.createConnection).to.have.been.calledWithExactly();
  });
});
