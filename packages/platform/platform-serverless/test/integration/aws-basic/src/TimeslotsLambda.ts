import {Injectable} from "@tsed/di";
import {BodyParams, Delete, Get, Lambda, PathParams, Post, Put, QueryParams} from "@tsed/platform-serverless";
import {Description, Groups, Path, Returns, Summary} from "@tsed/schema";

@Injectable()
@Path("/timeslots")
export class TimeslotsLambda {
  @Lambda()
  @Get("/:id")
  @Returns(200)
  @Summary("Get a timeslot by his id")
  get(@PathParams("id") id: string) {
    return {
      id
    };
  }

  @Lambda()
  @Post("/")
  @Returns(201)
  @Summary("Create timeslots from scheduled periods or from given date")
  create(@BodyParams() @Groups("create") timeslot: any) {
    return {
      id: "id",
      ...timeslot
    };
  }

  @Lambda()
  @Put("/:id")
  @Returns(200)
  @Summary("Update a timeslot timeslot")
  update(@PathParams("id") id: string, @Groups("update") @BodyParams() timeslot: any) {
    return {
      id,
      ...timeslot
    };
  }

  @Lambda()
  @Delete("/:id")
  @Returns(204)
  @Summary("Delete a timeslot timeslot by his id")
  delete(@PathParams("id") id: string) {
    return {};
  }

  @Lambda()
  @Get("/")
  @(Returns(200, Array))
  @Summary("Find all timeslot included in the given criteria")
  @Description(
    "Search timeslots from the given criteria. By default, the `start_date` value is the actual date and the `end_date` is `start_date + 7 days`"
  )
  findTimeslots(@QueryParams() criteria: any) {
    return [];
  }
}
