import {Controller} from "@tsed/di";
import {BodyParams, PathParams, QueryParams} from "@tsed/platform-params";
import {Delete, Get, Post, Put} from "@tsed/schema";
import {Description, Groups, Returns, Summary} from "@tsed/schema";

@Controller("/timeslots")
export class TimeslotsController {
  @Get("/:id")
  @Returns(200)
  @Summary("Get a timeslot by his id")
  get(@PathParams("id") id: string) {
    return {
      id: "id " + id
    };
  }

  @Post("/")
  @Returns(201)
  @Summary("Create timeslots from scheduled periods or from given date")
  create(@BodyParams() @Groups("create") timeslot: any) {
    return {
      id: "id",
      ...timeslot
    };
  }

  @Put("/:id")
  @Returns(200)
  @Summary("Update a timeslot timeslot")
  update(@PathParams("id") id: string, @Groups("update") @BodyParams() timeslot: any) {
    return {
      id,
      ...timeslot
    };
  }

  @Delete("/:id")
  @Returns(204)
  @Summary("Delete a timeslot timeslot by his id")
  delete(@PathParams("id") id: string) {
    return {};
  }

  @Get("/")
  @Returns(200, Array)
  @Summary("Find all timeslot included in the given criteria")
  @Description(
    "Search timeslots from the given criteria. By default, the `start_date` value is the actual date and the `end_date` is `start_date + 7 days`"
  )
  findTimeslots(@QueryParams() criteria: any) {
    return [];
  }
}
