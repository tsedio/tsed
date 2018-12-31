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
  Status
} from "@tsed/common";
import {NotFound} from "ts-httpexceptions";
import {Event} from "../../interfaces/Event";
import {Task} from "../../interfaces/Task";


@Controller("/:calendarId/events")
@MergeParams(true)
export class EventsCtrl {
  private AUTO_INC = 5;
  private events: Event[] = require("../../../resources/events.json");

  /**
   *
   * @returns {null}
   */
  @Get("/:id")
  async get(@Required() @PathParams("calendarId") calendarId: string,
            @PathParams("id") id: string): Promise<Event> {
    const event = this.events.find(event => event.id === id && event.calendarId === calendarId);

    if (event) {
      return event;
    }

    throw new NotFound("event not found");
  }

  /**
   *
   * @returns {null}
   */
  @Get("/:id/tasks")
  async getTasks(@Required() @PathParams("calendarId") calendarId: string,
                 @PathParams("id") id: string): Promise<Task[]> {
    const event = this.events.find(event => event.id === id && event.calendarId === calendarId);

    if (event) {
      return event.tasks || [];
    }

    throw new NotFound("event not found");
  }

  /**
   *
   * @returns {null}
   */
  @Put("/")
  async save(@Required() @PathParams("calendarId") calendarId: string,
             @BodyParams("startDate") startDate: string,
             @BodyParams("endDate") endDate: string,
             @BodyParams("name") name: string): Promise<Event> {


    this.AUTO_INC++;

    const event: Event = {id: "" + this.AUTO_INC, calendarId, startDate, endDate, name};
    this.events.push(event);

    return event;
  }

  /**
   *
   * @returns {null}
   */
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

  /**
   *
   */
  @Delete("/:id")
  @Authenticated()
  @Status(204)
  async remove(@Required() @PathParams("calendarId") calendarId: string,
               @PathParams("id") id: string): Promise<Event> {

    this.events = this.events.filter(event => event.id === id && event.calendarId === calendarId);
    return null;
  }

  @Get("/")
  async getEvents(@Required() @PathParams("calendarId") calendarId: string): Promise<Event[]> {
    return this.events.filter(event => event.calendarId === calendarId);
  }
}
