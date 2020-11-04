import {BodyParams, Controller, Delete, Get, Inject, PathParams, Post, Put} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Description, Required, Returns, Status, Summary} from "@tsed/schema";
import {InCalendarId} from "../../../decorators/calendarId";
import {EventId} from "../../../decorators/eventId";
import {CalendarEvent} from "../../../models/events/CalendarEvent";
import {CalendarEventsService} from "../../../services/calendars/CalendarEventsService";

@Controller("/:calendarId/events")
@InCalendarId()
export class EventsCtrl {
  @Inject()
  private calendarEventsService: CalendarEventsService;

  @Get("/:id")
  @Summary("Get an event from his ID")
  @(Returns(200).Description("Success"))
  async get(@EventId() @PathParams("id") id: string): Promise<CalendarEvent | null> {
    return this.calendarEventsService.find(id).catch((err) => {
      throw new NotFound("Event not found", err);
    });
  }

  @Post("/")
  @Summary("Create an event")
  @(Status(201).Description("Created"))
  async save(@BodyParams() calendarEvent: CalendarEvent): Promise<CalendarEvent> {
    return this.calendarEventsService.save(calendarEvent);
  }

  @Put("/:id")
  @Summary("Update event information")
  @(Status(200).Description("Success"))
  async update(
    @EventId()
    @PathParams("id")
    id: string,
    @BodyParams() calendarEvent: CalendarEvent
  ): Promise<CalendarEvent> {
    return this.calendarEventsService
      .find(id)
      .then(() => this.calendarEventsService.save(calendarEvent))
      .catch((err) => {
        throw new NotFound("Calendar id not found");
      });
  }

  @Delete("/:id")
  @Summary("Remove an event")
  @(Status(204).Description("No content"))
  async remove(
    @Description("The calendar id of the event")
    @Required()
    @PathParams("calendarId")
    calendarId: string,
    @Description("The event id")
    @PathParams("id")
    id: string
  ): Promise<void> {
    return this.calendarEventsService.remove(id);
  }

  @Get("/")
  @Summary("Get all events for a calendar")
  @(Status(200).Description("Success"))
  async getEvents(
    @Description("The calendar id of the event")
    @Required()
    @PathParams("calendarId")
    calendarId: string
  ): Promise<CalendarEvent[]> {
    return this.calendarEventsService.query(calendarId);
  }
}
