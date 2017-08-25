import {NotFound} from "ts-httpexceptions";
import {BodyParams, Controller, Delete, Get, Head, Patch, Post, Put, Response} from "../../../../../src/index";
import {Required} from "../../../../../src/mvc/decorators";
import {Authenticated} from "../../../../../src/mvc/decorators/method/authenticated";
import {Responses} from "../../../../../src/swagger/decorators/responses";
import {Returns} from "../../../../../src/swagger/decorators/returns";
import {EventModel} from "../../models/Event";
import {BaseController} from "../base/BaseController";


interface IEvent {
    id: string;
}

@Controller("/events")
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
    patch(@Required() @BodyParams() event: EventModel): EventModel {

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
    @Put("/")
    save(): Promise<any> | void {


        return Promise.resolve(null);
    }

    /**
     *
     * @param event
     * @returns {null}
     */
    @Post("/:id")
    @Authenticated()
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
    @Get("/")
    query(): Promise<any[]> | void {
        return Promise.resolve([]);
    }
}