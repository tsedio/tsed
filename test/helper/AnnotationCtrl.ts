import {Controller, Get, Authenticated, All, Post, Put, Delete, Head, Patch} from "../../index";
import {Middleware} from "./Middleware";

@Controller("/annotation")
export class AnnotationCtrl {

    @Get("/method/get", Middleware)
    @Authenticated()
    public get() {
        
        
        return true;

    }

    @All("/method/all", Middleware)
    public all() {

    }

    @Post("/method/post", Middleware)
    public post() {

    }

    @Put("/method/put", Middleware)
    public put() {

    }

    @Delete("/method/delete", Middleware)
    public delete() {

    }

    @Head("/method/head", Middleware)
    public head() {

    }

    @Patch("/method/patch", Middleware)
    public patch() {

    }
}