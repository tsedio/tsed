import {PlatformTest} from "@tsed/platform-http/testing";
import {deserialize} from "@tsed/json-mapper";

import {CalendarModel} from "../../models/CalendarModel";
import {CalendarsController} from "./CalendarsController";

async function getControllerFixture() {
  const controller = await PlatformTest.invoke<CalendarsController>(CalendarsController);
  const calendar = deserialize<CalendarModel>({name: "name", description: "description"}, {type: CalendarModel, groups: ["creation"]});

  controller.create(calendar);

  return {
    calendar,
    controller
  };
}

describe("CalendarsController", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("getAll()", () => {
    it("should return all calendars", async () => {
      const {controller, calendar} = await getControllerFixture();

      expect(controller.getAll()).toEqual([calendar]);
    });
  });

  describe("getById()", () => {
    it("should return a calendar", async () => {
      const {controller, calendar} = await getControllerFixture();
      const result = controller.getById(calendar.id);

      expect(result).toEqual(calendar);
    });

    it("should throw an error if the calendar isn't found", async () => {
      const {controller, calendar} = await getControllerFixture();

      expect(() => controller.getById("not-found")).toThrow("Calendar not found");
    });
  });

  describe("create()", () => {
    it("should create a calendar", async () => {
      const {controller} = await getControllerFixture();

      const calendar = deserialize(
        {name: "name", description: "description"},
        {
          type: CalendarModel,
          groups: ["creation"]
        }
      );

      expect(calendar.id).toBeUndefined();

      const created = controller.create(calendar);

      expect(created.id).toEqual(expect.any(String));
      expect(controller.getAll()).toHaveLength(2);
    });
  });

  describe("update()", () => {
    it("should update a calendar", async () => {
      const {controller, calendar} = await getControllerFixture();
      const updateCalendar = deserialize<CalendarModel>(
        {name: "new name", description: "new description"},
        {type: CalendarModel, groups: ["update"]}
      );

      const updated = controller.update(calendar.id, updateCalendar);

      expect(updated.name).toEqual(updateCalendar.name);
      expect(updated.description).toEqual(updateCalendar.description);

      expect(controller.getAll()).toHaveLength(1);
    });

    it("should throw an error if the calendar isn't found", async () => {
      const {controller} = await getControllerFixture();
      const updateCalendar = deserialize<CalendarModel>(
        {name: "new name", description: "new description"},
        {type: CalendarModel, groups: ["update"]}
      );

      expect(() => controller.update("not-found", updateCalendar)).toThrow("Calendar not found");
    });
  });

  describe("remove()", () => {
    it("should remove a calendar", async () => {
      const {controller, calendar} = await getControllerFixture();

      controller.remove(calendar.id);

      expect(controller.getAll()).toHaveLength(0);
    });

    it("should throw an error if the calendar isn't found", async () => {
      const {controller} = await getControllerFixture();

      expect(() => controller.remove("not-found")).toThrow("Calendar not found");
    });
  });
});
