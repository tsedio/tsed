import {
  Authenticated,
  BodyParams,
  Controller,
  Delete,
  Get,
  Inject,
  MergeParams,
  PathParams,
  Post,
  Put,
  Required,
  Status,
  UseBefore
} from "@tsed/common";
import {Responses, Returns} from "@tsed/swagger";
import {NotFound} from "ts-httpexceptions";
import {CheckCalendarIdMiddleware} from "../../middlewares/CheckCalendarIdMiddleware";
import {Event} from "../../models/Event";
import {Task} from "../../models/Task";
import {CalendarEventsService} from "../../services/events/CalendarEventsService";


@Controller("/:calendarId/events")
@MergeParams(true)
@UseBefore(CheckCalendarIdMiddleware)
export class EventsCtrl {
  @Inject(CalendarEventsService)
  calendarEventsService: CalendarEventsService;

  /**
   *
   * @returns {null}
   */
  @Get("/:id")
  @Returns(Event)
  @Responses(404, {description: "Event not found"})
  async get(@Required() @PathParams("calendarId") calendarId: string,
            @PathParams("id") id: string): Promise<Event> {

    const event = this.calendarEventsService.findById(id);

    if (!event) {
      throw new NotFound("Event not found");
    }

    return event;
  }

  /**
   *
   * @returns {null}
   */
  @Get("/:id/tasks")
  async getTasks(@Required() @PathParams("calendarId") calendarId: string,
                 @PathParams("id") id: string): Promise<Task[]> {
    const event = await this.get(calendarId, id);

    return event.tasks;
  }

  /**
   *
   * @returns {null}
   */
  @Put("/")
  @Returns(Event)
  async save(@Required() @PathParams("calendarId") calendarId: string,
             @BodyParams("startDate") startDate: string,
             @BodyParams("endDate") endDate: string,
             @BodyParams("name") name: string): Promise<Event> {


    return this.calendarEventsService.create({calendarId, startDate, endDate, name});
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

    return this.calendarEventsService.update({_id: id, calendarId, startDate, endDate, name});
  }

  /**
   *
   */
  @Delete("/:id")
  @Authenticated()
  @Status(204)
  async remove(@Required() @PathParams("calendarId") calendarId: string,
               @PathParams("id") id: string): Promise<Event> {

    this.calendarEventsService.remove

    this.events = this.events.filter(event => event.id === id && event.calendarId === calendarId);
    return null;
  }

  @Get("/")
  async getEvents(@Required() @PathParams("calendarId") calendarId: string): Promise<Event[]> {
    return this.events.filter(event => event.calendarId === calendarId);
  }
}
