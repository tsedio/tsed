import {Controller, Get, Post, Put, Delete, Response, IPromise, ICrud, Head,Patch} from "../../../../index";


interface IEvent{
    id: string;
}

@Controller("/events")
export class EventCtrl implements ICrud<IEvent> {

    @Head('/')
    head(){

    }

    @Patch('/:id')
    patch(){
        return "";
    }

    @Get('/:id')
    find(
        @Response() response: any
    ): IPromise<IEvent> | void {

        response.send(200, 'OK');

        return null;
    }

    @Put('/')
    save(

    ): IPromise<any> | void {



        return null;
    }

    @Post('/:id')
    update(

    ): IPromise<any> | void {


        return null;
    }

    @Delete('/:id')
    remove(

    ): IPromise<any> | void {
        return null;
    }

    @Get('/')
    query(

    ): IPromise<any[]> | void {

        return null;
    }
}