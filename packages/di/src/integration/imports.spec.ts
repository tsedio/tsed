import {Inject} from "../decorators/inject";
import {Injectable} from "../decorators/injectable";
import {Module} from "../decorators/module";
import {DITest} from "../services/DITest";

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
            createConnection: jest.fn()
          }
        }
      ]
    })
  );

  it("should create container with stubbed service", () => {
    const service = DITest.get(MyService);
    expect(service.createConnection).toBeCalledWith();
  });
});
