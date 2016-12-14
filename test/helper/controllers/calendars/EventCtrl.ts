import {Controller, Get, Post, Put, Delete, Response, IPromise, Head,Patch} from "../../../../src/index";
import {BodyParams} from '../../../../src/decorators/params';
import {EventModel} from '../../models/Event';


interface IEvent{
    id: string;
}

@Controller("/events")
export class EventCtrl {
    /**
     *
     */
    @Head('/')
    head(){

    }

    /**
     *
     * @returns {string}
     */
    @Patch('/:id')
    patch(){
        return "";
    }

    /**
     *
     * @param response
     * @returns {null}
     */
    @Get('/:id')
    find(
        @Response() response: any
    ): IPromise<IEvent> | void {

        response.send(200, 'OK');

        return null;
    }

    /**
     *
     * @returns {null}
     */
    @Put('/')
    save(

    ): IPromise<any> | void {



        return null;
    }

    /**
     *
     * @param event
     * @returns {null}
     */
    @Post('/:id')
    update(@BodyParams("event", EventModel) event: EventModel[]): EventModel[] {

        return event;
    }

    /**
     *
     * @returns {null}
     */
    @Delete('/:id')
    remove(

    ): IPromise<any> | void {
        return null;
    }

    /**
     *
     * @returns {null}
     */
    @Get('/')
    query(

    ): IPromise<any[]> | void {

        return null;
    }
}