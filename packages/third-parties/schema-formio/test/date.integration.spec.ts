import {DateFormat, DateTime} from "@tsed/schema";

import {Component, getFormioSchema} from "../src/index.js";

describe("Date integration", () => {
  it("should generate date-time field", async () => {
    class Model {
      @DateTime()
      test: Date;
    }

    const form = await getFormioSchema(Model);
    expect(form).toMatchSnapshot();
  });
  it("should generate date field", async () => {
    class Model {
      @DateFormat()
      test: Date;
    }

    const form = await getFormioSchema(Model);
    expect(form).toEqual({
      components: [
        {
          datePicker: {
            disableWeekdays: false,
            disableWeekends: false
          },
          disabled: false,
          enableMaxDateInput: false,
          enableMinDateInput: false,
          enableTime: false,
          format: "yyyy-MM-dd",
          input: true,
          key: "test",
          label: "Test",
          type: "datetime",
          validate: {
            required: false
          },
          widget: {
            allowInput: true,
            disableWeekdays: false,
            disableWeekends: false,
            displayInTimezone: "viewer",
            enableTime: false,
            format: "yyyy-MM-dd",
            hourIncrement: 1,
            locale: "en",
            maxDate: null,
            minDate: null,
            minuteIncrement: 1,
            mode: "single",
            noCalendar: false,
            type: "calendar",
            useLocaleSettings: false
          }
        }
      ],
      display: "form",
      machineName: "model",
      name: "model",
      title: "Model",
      type: "form",
      submissionAccess: [],
      access: [],
      tags: []
    });
  });
  it("should generate date field with additional props", async () => {
    class Model {
      @DateFormat()
      @Component({
        datePicker: {
          disableWeekends: true,
          disableWeekdays: true
        }
      })
      test: Date;
    }

    const form = await getFormioSchema(Model);
    expect(form).toEqual({
      components: [
        {
          datePicker: {
            disableWeekdays: true,
            disableWeekends: true
          },
          disabled: false,
          enableMaxDateInput: false,
          enableMinDateInput: false,
          enableTime: false,
          format: "yyyy-MM-dd",
          input: true,
          key: "test",
          label: "Test",
          type: "datetime",
          validate: {
            required: false
          },
          widget: {
            allowInput: true,
            disableWeekdays: false,
            disableWeekends: false,
            displayInTimezone: "viewer",
            enableTime: false,
            format: "yyyy-MM-dd",
            hourIncrement: 1,
            locale: "en",
            maxDate: null,
            minDate: null,
            minuteIncrement: 1,
            mode: "single",
            noCalendar: false,
            type: "calendar",
            useLocaleSettings: false
          }
        }
      ],
      display: "form",
      machineName: "model",
      name: "model",
      title: "Model",
      type: "form",
      submissionAccess: [],
      access: [],
      tags: []
    });
  });
});
