import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
  QueryParams,
  Req,
  Status,
} from "@tsed/common";
import {Authorize} from "@tsed/passport";
import {NotFound} from "@tsed/exceptions";
import {Required, Returns} from "@tsed/schema";
import {Calendar, CalendarCreation} from "../../models/Calendar";
import {User} from "../../models/User";
import {CalendarsService} from "../../services/calendars/CalendarsService";
import {EventsCtrl} from "../events/EventsCtrl";

/**
 * Add @Controller annotation to declare your class as Router controller.
 * The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * In this case, EventsCtrl is a dependency of CalendarsCtrl.
 * All routes of EventsCtrl will be mounted on the `/calendars` path.
 */
@Controller("/calendars", EventsCtrl)
export class CalendarCtrl {
  constructor(private calendarsService: CalendarsService) {
  }

  @Get("/:id")
  @Returns(200, Calendar)
  @Authorize("basic")
  async get(@Req("user") user: User,
            @Required() @PathParams("id") id: string): Promise<Calendar> {
    const calendar = await this.calendarsService.findOne({_id: id, owner: user._id});

    if (!calendar) {
      throw new NotFound("Calendar not found");
    }

    return calendar;
  }

  @Put("/")
  @Returns(201, Calendar)
  @Authorize("basic")
  create(@Req("user") user: User,
         @BodyParams() calendar: CalendarCreation): Promise<Calendar> {
    return this.calendarsService.create(calendar);
  }

  @Post("/:id")
  @Returns(200, Calendar)
  @Returns(404).Description("Calendar not found")
  @Authorize("basic")
  async update(@Req("user") user: User,
               @PathParams("id") @Required() id: string,
               @BodyParams() @Required() calendar: CalendarCreation): Promise<Calendar> {
    await this.get(user, id);

    return this.calendarsService.update({_id: id, ...calendar});
  }

  @Delete("/")
  @Status(204)
  @Returns(404).Description("Calendar not found")
  @Authorize("basic")
  async remove(@Req("user") user: User,
               @BodyParams("id") @Required() id: string): Promise<void> {
    if (!await this.calendarsService.removeOne({_id: id, owner: user._id})) {
      throw new NotFound("Calendar not found");
    }
  }

  @Get("/")
  @Authorize("basic")
  async getAll(
    @QueryParams("id") id: string,
    @QueryParams("name") name: string,
    @QueryParams("owner") owner: string
  ): Promise<Calendar[]> {
    return this.calendarsService.findAll({_id: id, name, owner});
  }
}
