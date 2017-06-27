import {Controller, Delete, Get, Head, IPromise, Next, Patch, Post, Put, Response} from "../../../../src/index";
import {BodyParams} from "../../../../src/decorators/params";
import {EventModel} from "../../models/Event";


interface IEvent {
    id: string;
}

@Controller("/events")
export class EventCtrl {
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
    patch() {
        return "";
    }

    /**
     *
     * @param response
     * @returns {null}
     */
    @Get("/:id")
    find(@Response() response: any): IPromise<IEvent> | void {

        response.send(200, "OK");

        return null;
    }

    /**
     *
     * @returns {null}
     */
    @Put("/")
    save(): IPromise<any> | void {


        return null;
    }

    /**
     *
     * @param event
     * @returns {null}
     */
    @Post("/:id")
    update(@BodyParams("events", EventModel) events: EventModel[]): EventModel[] {

        return events;
    }

    /**
     *
     * @returns {null}
     */
    @Delete("/:id")
    remove(): IPromise<any> | void {
        return null;
    }

    /**
     *
     * @returns {null}
     */
    @Get("/")
    query(@Response() response,
          @Next() next): IPromise<any[]> | void {
        return Promise.resolve([{test: "test"}])
            .then((response) => {

                setTimeout(() => {
                    console.log("NextTick");
                    next();
                });
                return response;
            });
    }
}