import {DateFormat, DateTime} from "@tsed/schema";
import {getFormioSchema} from "../src";

describe('Date integration', () => {
  it("should generate date-time field", () => {
    class Model {
      @DateTime()
      test: Date;
    }
    const form = getFormioSchema(Model);
    expect(form).toEqual({
      "components": [
        {
          "datePicker": {
            "disableWeekdays": false,
            "disableWeekends": false
          },
          "disabled": false,
          "enableMaxDateInput": false,
          "enableMinDateInput": false,
          "enableTime": false,
          "input": true,
          "key": "test",
          "label": "Test",
          "timePicker": {
            "showMeridian": false
          },
          "type": "datetime",
          "validate": {
            "required": false
          },
          "widget": {
            "enableTime": true,
            "time_24hr": true
          }
        }
      ],
      "display": "form",
      "machineName": "model",
      "name": "model",
      "title": "Model",
      "type": "form"
    });
  });
  it("should generate date field", () => {
    class Model {
      @DateFormat()
      test: Date;
    }
    const form = getFormioSchema(Model);
    expect(form).toEqual({
      "components": [
        {
          "datePicker": {
            "disableWeekdays": false,
            "disableWeekends": false
          },
          "disabled": false,
          "enableMaxDateInput": false,
          "enableMinDateInput": false,
          "enableTime": false,
          "format": "yyyy-MM-dd",
          "input": true,
          "key": "test",
          "label": "Test",
          "type": "datetime",
          "validate": {
            "required": false
          },
          "widget": {
            "allowInput": true,
            "disableWeekdays": false,
            "disableWeekends": false,
            "displayInTimezone": "viewer",
            "enableTime": false,
            "format": "yyyy-MM-dd",
            "hourIncrement": 1,
            "locale": "en",
            "maxDate": null,
            "minDate": null,
            "minuteIncrement": 1,
            "mode": "single",
            "noCalendar": false,
            "type": "calendar",
            "useLocaleSettings": false
          }
        }
      ],
      "display": "form",
      "machineName": "model",
      "name": "model",
      "title": "Model",
      "type": "form"
    });
  });
})
