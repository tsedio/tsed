import {Controller, Get, Post, Put, Delete, PathParams, Request, Response} from "../../../index";
import * as Logger from "log-debug";
import {ICrud, IPromise} from "../../../icrud";

interface ICalendar{
    id: string;
}

@Controller("/calendars", "EventCtrl")
export class CalendarCtrl {

    @Get('/classic/:id')
    findClassic(request: any, response: any): ICalendar {

        return {id: request.params.id};
    }

    @Get('/:id')
    findWithAnnotation(
        @Request() request,
        @PathParams('id') id
    ): ICalendar {

        Logger.debug('ID =>', id, request.params.id);

        return {id: id};
    }

    @Put('/')
    save( 
        @Request() request
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