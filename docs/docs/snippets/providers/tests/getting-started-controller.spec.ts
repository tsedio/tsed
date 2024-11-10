import {PlatformTest} from "@tsed/platform-http/testing";
import {Calendar} from "../models/Calendar.js";
import {CalendarsService} from "../services/CalendarsService.js";

async function getFixture() {
  const service = {
    findAll: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockImplementation((calendar: Calendar) => {
      calendar.id = "id";
      return calendar;
    })
  };
  const controller = await PlatformTest.invoke<CalendarsController>(CalendarsController, [
    {
      token: CalendarsService,
      use: service
    }
  ]);

  return {
    service,
    controller
  };
}

describe("CalendarsController", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("findAll()", () => {
    it("should return calendars from the service", async () => {
      const {controller, service} = await getFixture();

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledWith();
    });
  });

  describe("create()", () => {
    it("should create using the service", async () => {
      const {controller, service} = await getFixture();

      const calendar = new Calendar();

      const result = await controller.create(calendar);

      expect(result.id).toEqual(id);
      expect(service.create).toHaveBeenCalledWith(calendar);
    });
  });
});
