import {PlatformTest, AcceptMimesMiddleware, Controller, Get, InjectorService, PlatformTest, Service} from "@tsed/common";
import {Hidden} from "@tsed/swagger";
import {expect} from "chai";
import * as Sinon from "sinon";
import {CalendarCtrl} from "../src/controllers/calendars/CalendarCtrl";
import {FakeServer} from "./helpers/FakeServer";

@Service()
class DbService {
  async getData() {
    return {data: "data"};
  }
}

@Controller("/testMyCtrl")
@Hidden()
export class MyCtrl {
  constructor(private dbService: DbService) {
  }

  @Get("/")
  public getData() {
    return this.dbService.getData();
  }
}

describe("Example Test", () => {
  describe("DbService", () => {
    let result: any;
    before(
      PlatformTest.inject([DbService], (dbService: DbService) => {
        return dbService.getData().then(data => {
          result = data;
        });
      })
    );
    it("should data from db", () => {
      expect(result).to.be.an("object");
    });
  });

  describe("CalendarCtrl", () => {
    let instance: any;

    // bootstrap your Server to load all endpoints before run your test
    before(PlatformTest.bootstrap(FakeServer));
    before(
      PlatformTest.inject([CalendarCtrl], (calendarCtrl: CalendarCtrl) => {
        instance = calendarCtrl;
      })
    );
    after(PlatformTest.reset);

    it("should do something", () => {
      expect(!!instance).to.be.true;
    });
  });

  describe("CalendarCtrl2", () => {
    let instance: any;
    // bootstrap your Server to load all endpoints before run your test
    before(PlatformTest.bootstrap(FakeServer));

    before(
      PlatformTest.inject([InjectorService], (injectorService: InjectorService) => {
        instance = injectorService.invoke(CalendarCtrl);
      })
    );
    after(PlatformTest.reset);

    it("should do something", () => {
      expect(!!instance).to.be.true;
    });
  });

  describe("Mock dependencies", () => {
    // bootstrap your Server to load all endpoints before run your test
    before(PlatformTest.bootstrap(FakeServer));
    after(PlatformTest.reset);

    it("should do something", async () => {
      // give the locals map to the invoke method
      const instance: MyCtrl = await PlatformTest.invoke(MyCtrl, [{
        token: DbService,
        use: {
          getData: () => {
            return "test";
          }
        }
      }]);

      // and test it
      expect(!!instance).to.eq(true);
      expect(instance.getData()).to.equals("test");
    });
  });

  describe("AcceptMimesMiddleware", () => {
    it("should accept mime", PlatformTest.inject([AcceptMimesMiddleware], (middleware: AcceptMimesMiddleware) => {
      const request: any = {
        accepts: Sinon.stub().returns(true),
        ctx: {
          endpoint: {
            get: () => {
              return ["application/json"];
            }
          }
        }
      };
      request.mime = "application/json";

      middleware.use(
        request as any
      );
    }));
  });
});
