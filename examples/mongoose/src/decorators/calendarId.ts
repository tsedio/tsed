import {UseBefore} from "@tsed/common";
import {decorateMethodsOf, useDecorators} from "@tsed/core";
import {ObjectID} from "@tsed/mongoose";
import {Description, In, JsonParameterTypes} from "@tsed/schema";
import {CheckCalendarIdMiddleware} from "../middlewares/calendars/CheckCalendarId";

export function CalendarId() {
  return useDecorators(ObjectID(), Description("The calendar id"));
}

export function InCalendarId(): ClassDecorator {
  return (target) => {
    decorateMethodsOf(
      target,
      useDecorators(
        In(JsonParameterTypes.PATH)
          .Type(String)
          .Name("calendarId")
          .Description("The calendar id")
          .Pattern(/^[0-9a-fA-F]{24}$/),
        UseBefore(CheckCalendarIdMiddleware)
      )
    );
  };
}
