import {Controller, Get, Post, Put, Delete, Response, Head,Patch} from "../../../../src/index";
import {BodyParams} from '../../../../src/decorators/param/params';
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
    ): Promise<IEvent> | void {

        response.send(200, 'OK');

        return null;
    }

    /**
     *
     * @returns {null}
     */
    @Put('/')
    save(

    ): Promise<any> | void {



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

    ): Promise<any> | void {
        return null;
    }

    /**
     *
     * @returns {null}
     */
    @Get('/')
    query(

    ): Promise<any[]> | void {

        return null;
    }
}