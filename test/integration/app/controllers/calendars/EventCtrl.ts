import {
  Authenticated,
  BodyParams,
  Controller,
  Delete,
  Get,
  Head,
  MergeParams,
  Patch,
  Post,
  Put,
  QueryParams,
  Required,
  Response
} from "@tsed/common";
import {Responses, Returns, Title} from "@tsed/swagger";
import {NotFound} from "ts-httpexceptions";
import {EventModel} from "../../models/Event";
import {BaseController} from "../base/BaseController";
import {TaskCtrl} from "./TaskCtrl";

@Controller({
  path: "/events",
  children: [TaskCtrl]
})
@MergeParams()
export class EventCtrl extends BaseController {
  /**
   *
   */
  @Head("/")
  head() {
  }

  /**
   *
   * @returns {string}
   */
  @Patch("/:id")
  @Responses("404", {description: "Not found"})
  patch(
    @Title("Title event")
    @Required()
    @BodyParams()
      event: EventModel
  ): EventModel {
    if (event.id === "0" || event.id === "") {
      throw new NotFound("Not found");
    }

    return event;
  }

  /**
   *
   * @param response
   * @returns {null}
   */
  @Get("/:id")
  find(@Response() response: any): Promise<any> | void {
    response.send(200, "OK");

    return Promise.resolve(null);
  }

  /**
   *
   * @returns {null}
   */
  @Put("/:id")
  save(@BodyParams() event: EventModel): Promise<any> | void {
    event.id = "1";

    return Promise.resolve(event);
  }

  /**
   *
   * @param event
   * @returns {null}
   */
  @Post("/list")
  @Authenticated({role: "admin"})
  @Returns(200, {use: EventModel, collection: Array})
  update(@BodyParams("event", EventModel) event: EventModel[]): EventModel[] {
    return event;
  }

  /**
   *
   * @returns {null}
   */
  @Delete("/:id")
  remove(): Promise<any> | void {
    return Promise.resolve(null);
  }

  /**
   *
   * @returns {null}
   */
  @Get("/status")
  byStatus(@QueryParams("status", String) status: string[]): Promise<any[]> | void {
    return Promise.resolve(status);
  }

  /**
   *
   * @returns {null}
   */
  @Get("/")
  query(): Promise<any[]> | void {
    return Promise.resolve([
      {id: "1"},
      {id: "2"}
    ]);
  }
}
