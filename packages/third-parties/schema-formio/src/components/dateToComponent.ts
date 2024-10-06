import {getValue} from "@tsed/core";

import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer.js";

function dateToComponent(schema: any, options: any) {
  const component = execMapper("default", schema, options);

  const base = {
    enableMinDateInput: false,
    enableMaxDateInput: false,
    input: true,
    ...component,
    type: "datetime",
    datePicker: {
      disableWeekends: false,
      disableWeekdays: false,
      ...getValue(component, "datePicker")
    },
    widget: {
      type: "calendar",
      displayInTimezone: "viewer",
      locale: "en",
      useLocaleSettings: false,
      allowInput: true,
      mode: "single",
      noCalendar: false,
      hourIncrement: 1,
      minuteIncrement: 1,
      minDate: null,
      disableWeekends: false,
      disableWeekdays: false,
      maxDate: null,
      ...getValue(component, "widget")
    }
  };

  if (schema.format === "date") {
    return {
      ...base,
      format: "yyyy-MM-dd",
      enableTime: false,
      widget: {
        ...base.widget,
        enableTime: false,
        format: "yyyy-MM-dd",
        ...getValue(component, "widget")
      }
    };
  }

  return {
    ...base,
    timePicker: {
      showMeridian: false,
      ...getValue(component, "timePicker")
    },
    widget: {
      ...base.widget,
      enableTime: true,
      time_24hr: true,
      ...getValue(component, "widget")
    }
  };
}

registerFormioMapper("date", dateToComponent);
