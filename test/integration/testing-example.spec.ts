import {Controller, Get, InjectorService, ParseService, Service} from "@tsed/common";
import {bootstrap, inject} from "@tsed/testing";
import {expect} from "chai";
import {AcceptMimesMiddleware} from "../../src/common/mvc/components/AcceptMimesMiddleware";
import {Hidden} from "../../src/swagger";
import {Sinon} from "../tools";
import {CalendarCtrl} from "./app/controllers/calendars/CalendarCtrl";
import {FakeServer} from "./FakeServer";

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
  describe("ParseService", () => {

    it("should clone object", () => {

      const source = {};

      expect(ParseService.clone(source)).not.to.be.equal(source);
    });

    it("should evaluate expression with a scope and return value", inject([ParseService], (parserService: ParseService) => {

      expect(parserService.eval("test", {
        test: "yes"
      })).to.equal("yes");

    }));
  });

  describe("DbService", () => {
    let result: any;
    before(inject([DbService], (dbService: DbService) => {
      return dbService
        .getData()
        .then((data) => {
          result = data;
        });
    }));
    it("should data from db", () => {
      expect(result).to.be.an("object");
    });
  });

  describe("CalendarCtrl", () => {
    let instance: any;

    // bootstrap your Server to load all endpoints before run your test
    before(bootstrap(FakeServer));
    before(inject([CalendarCtrl], (calendarCtrl: CalendarCtrl) => {
      instance = calendarCtrl;
    }));

    it("should do something", () => {
      expect(!!instance).to.be.true;
    });
  });

  describe("CalendarCtrl2", () => {
    let instance: any;
    // bootstrap your Server to load all endpoints before run your test
    before(bootstrap(FakeServer));

    before(inject([InjectorService], (injectorService: InjectorService) => {
      instance = injectorService.invoke(CalendarCtrl);
    }));

    it("should do something", () => {
      expect(!!instance).to.be.true;
    });
  });

  describe("Mock dependencies", () => {

    // bootstrap your Server to load all endpoints before run your test
    before(bootstrap(FakeServer));

    it("should do something", inject([InjectorService], (injector: InjectorService) => {

      // create locals map
      const locals = new Map<any, any>();

      // replace DbService by a faker
      locals.set(DbService, {
        getData: () => {
          return "test";
        }
      });

      // give the locals map to the invoke method
      const instance: MyCtrl = injector.invoke<MyCtrl>(MyCtrl, locals);

      // and test it
      expect(!!instance).to.be.true;
      expect(instance.getData()).to.equals("test");
    }));
  });


  describe("AcceptMimesMiddleware", () => {
    it("should accept mime", inject([AcceptMimesMiddleware], (middleware: AcceptMimesMiddleware) => {

      const request: any = {
        accepts: Sinon.stub().returns(true)
      };
      request.mime = "application/json";

      middleware.use({
        get: () => {
          return ["application/json"];
        }
      } as any, request as any);

    }));
  });
});