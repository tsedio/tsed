import {
  Authenticated,
  BodyParams,
  Controller,
  Delete,
  Get,
  MergeParams,
  PathParams,
  Post,
  Put,
  Required,
  Status,
  UseBefore
} from "@tsed/common";
import {Authorize} from "@tsed/passport";
import {Responses, Returns} from "@tsed/swagger";
import {NotFound} from "@tsed/exceptions";
import {CheckCalendarIdMiddleware} from "../../middlewares/CheckCalendarIdMiddleware";
import {CalendarCreation} from "../../models/Calendar";
import {Event, EventCreation} from "../../models/Event";
import {Task} from "../../models/Task";
import {CalendarEventsService} from "../../services/events/CalendarEventsService";


@Controller("/:calendarId/events")
@MergeParams(true)
@UseBefore(CheckCalendarIdMiddleware)
export class EventsCtrl {
  constructor(private calendarEventsService: CalendarEventsService) {
  }

  @Get("/:id")
  @Returns(Event)
  @Responses(404, {description: "Event not found"})
  @Authorize("*")
  async get(@Required() @PathParams("calendarId") calendarId: string,
            @PathParams("id") id: string): Promise<Event> {
    const event = await this.calendarEventsService.findById(id);

    if (!event) {
      throw new NotFound("Event not found");
    }

    return event;
  }

  @Get("/:id/tasks")
  @Authorize("*")
  async getTasks(@Required() @PathParams("calendarId") calendarId: string,
                 @PathParams("id") id: string): Promise<Task[]> {
    const event = await this.get(calendarId, id);

    return event.tasks;
  }

  @Put("/")
  @Returns(201, {type: Event})
  @Returns(Event)
  @Authorize("*")
  async create(@Required() @PathParams("calendarId") calendarId: string,
               @BodyParams() event: EventCreation): Promise<Event> {
    return this.calendarEventsService.create({calendarId, ...event});
  }

  @Post("/:id")
  @Authorize("*")
  async update(@Required() @PathParams("calendarId") calendarId: string,
               @PathParams("id") id: string,
               @BodyParams() event: CalendarCreation): Promise<Event> {
    const updatedEvent = await this.calendarEventsService.update({_id: id, calendarId, ...event});

    if (!updatedEvent) {
      throw new NotFound("Event not found");
    }

    return updatedEvent;
  }

  @Delete("/:id")
  @Authenticated()
  @Status(204)
  @Authorize("*")
  async remove(@Required() @PathParams("calendarId") calendarId: string,
               @PathParams("id") id: string): Promise<Event> {
    if (!await this.calendarEventsService.removeOne({_id: id, calendarId})) {
      throw new NotFound("Event not found");
    }

    return null;
  }

  @Get("/")
  @Authorize("*")
  async getAll(@Required() @PathParams("calendarId") calendarId: string): Promise<Event[]> {
    return this.calendarEventsService.findAll({calendarId});
  }
}
