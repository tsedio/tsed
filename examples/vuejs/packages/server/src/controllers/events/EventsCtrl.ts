import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
  UseBefore
} from "@tsed/common";
import {Status, Required} from "@tsed/schema";
import {NotFound} from "@tsed/exceptions";
import {CheckCalendarIdMiddleware} from "../../middlewares/CheckCalendarIdMiddleware";
import {Event} from "../../interfaces/Event";
import {Task} from "../../interfaces/Task";

@Controller("/:calendarId/events")
@UseBefore(CheckCalendarIdMiddleware)
export class EventsCtrl {
  private AUTO_INC = 5;
  private events: Event[] = require("../../../resources/events.json");

  @Get("/:id")
  async get(@Required() @PathParams("calendarId") calendarId: string,
            @PathParams("id") id: string): Promise<Event> {

    const event = this.events.find(event => event.id === id && event.calendarId === calendarId);

    if (event) {
      return event;
    }

    throw new NotFound("event not found");
  }

  @Get("/:id/tasks")
  async getTasks(@Required() @PathParams("calendarId") calendarId: string,
                 @PathParams("id") id: string): Promise<Task[]> {
    const event = this.events.find(event => event.id === id && event.calendarId === calendarId);

    if (event) {
      return event.tasks || [];
    }

    throw new NotFound("event not found");
  }

  @Put("/")
  async save(@Required() @PathParams("calendarId") calendarId: string,
             @BodyParams("startDate") startDate: string,
             @BodyParams("endDate") endDate: string,
             @BodyParams("name") name: string): Promise<Event> {


    this.AUTO_INC++;

    const event: Event = {id: String(this.AUTO_INC), calendarId, startDate, endDate, name};
    this.events.push(event);

    return event;
  }

  @Post("/:id")
  async update(@Required() @PathParams("calendarId") calendarId: string,
               @PathParams("id") id: string,
               @BodyParams("startDate") startDate: string,
               @BodyParams("endDate") endDate: string,
               @BodyParams("name") name: string): Promise<Event> {

    const event = await this.get(calendarId, id);
    event.name = name;
    event.startDate = name;
    event.endDate = name;

    return event;
  }

  @Delete("/:id")
  @Status(204)
  async remove(@Required() @PathParams("calendarId") calendarId: string,
               @PathParams("id") id: string): Promise<void> {
    this.events = this.events.filter(event => event.id === id && event.calendarId === calendarId);
  }

  @Get("/")
  async getEvents(@Required() @PathParams("calendarId") calendarId: string): Promise<Event[]> {
    return this.events.filter(event => event.calendarId === calendarId);
  }
}
