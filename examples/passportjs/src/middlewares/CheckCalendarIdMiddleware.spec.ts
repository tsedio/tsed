import {expect} from "chai";
import {PlatformTest} from "@tsed/common";
import * as Sinon from "sinon";
import {Calendar} from "../models/Calendar";
import {User} from "../models/User";
import {CalendarsService} from "../services/calendars/CalendarsService";
import {CheckCalendarIdMiddleware} from "./CheckCalendarIdMiddleware";

const sandbox = Sinon.createSandbox();
describe("CheckCalendarIdMiddleware", () => {
  const user = new User();
  user._id = "u1";

  let middleware: CheckCalendarIdMiddleware;

  const calendarsService = {
    findOne: sandbox.stub()
  };

  beforeEach(async () => {
    await PlatformTest.create();
    middleware = await PlatformTest.invoke(CheckCalendarIdMiddleware, [
      {
        token: CalendarsService,
        use: calendarsService
      }
    ]);
  });
  afterEach(() => PlatformTest.reset());
  afterEach(() => sandbox.reset());

  it("should return nothing", async () => {
    // GIVEN
    const calendar = new Calendar();
    calendarsService.findOne.resolves(calendar);
    // WHEN
    const result = await middleware.use(user, "1");

    // THEN
    expect(result).to.equal(undefined);
    calendarsService.findOne.should.be.calledWithExactly({_id: "1", owner: user._id});
  });

  it("should throw error", async () => {
    // GIVEN
    const user = new User();
    user._id = "u1";

    calendarsService.findOne.resolves(undefined);

    // WHEN
    let actualError: any;
    try {
      await middleware.use(user, "1");
    } catch (er) {
      actualError = er;
    }

    // THEN
    actualError.message.should.deep.eq("Calendar not found");
  });
});
