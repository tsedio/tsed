import {DITest} from "../../node/index.js";
import {Inject} from "../decorators/inject.js";
import {Injectable} from "../decorators/injectable.js";
import {Module} from "../decorators/module.js";

@Injectable()
class MyService {
  createConnection() {}
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
  beforeEach(() =>
    DITest.create({
      imports: [
        {
          token: MyService,
          use: {
            createConnection: vi.fn()
          }
        }
      ]
    })
  );

  it("should create container with stubbed service", () => {
    const service = DITest.get(MyService);
    expect(service.createConnection).toHaveBeenCalledWith();
  });
});
