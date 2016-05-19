# TS-express-decorators

[![Build Status](https://travis-ci.org/Romakita/ts-express-decorators.svg?branch=master)](https://travis-ci.org/Romakita/ts-express-decorators)
[![Coverage Status](https://coveralls.io/repos/github/Romakita/ts-express-decorators/badge.svg?branch=master)](https://coveralls.io/github/Romakita/ts-express-decorators?branch=master)


> Build your Typescript Application with Express route decorators !

## Prerequisites

Express-route-decorator require Typescript 1.8, but it will work with Typescript 1.5 or higher.

## Installation

Run `npm install -g typescript typings` and `npm install ts-express-decorators`.

## Features

* Define classes as Controllers
* Define root path for an entire controller
* Define routes for a method
* Define routes on GET, POST, PUT and DELETE verbs
* Define middlewares on routes
* Define required parameters
* Inject data from query string, path parameters, entire body or cookies
* Inject Request, Response, Next object from Express request

## Example

```typescript
import {Controller, Get, PathParams} from "ts-express-decorators";
import {MyMiddlewares} from "./middlewares";

/** Define a controller class **/

@Controller("/resource")
public class ResourceCtrl {

    contructor() {
    
    }
    
    @Use()
    public middleware(
        @Request() request: any,
        @Next() next: Function,
    ){
    
        if(request.params.id) {
            console.log(`Resource ID => ${id}`)
        }
        
        next(); 
    }

    @Get("/:id")
    @Use(MyMiddlewares)
    public getResource(
        @PathParams("id") id: string
    ){
           
        //Return directly an object. @Get send automatically object in JSON
        return {
            id: id,
            text: "Hello world"
        };
        
    }
    
}

// Install the routes in an express App

import express from "express";

let app = express();
let ctrl = new ResourceCtrl();

ctrl.register(app);

/* The "/resources/:id" is exposed !

```

##### Note

* Actions can return promises and errors will get handled properly.

### API

`Controller(baseUrl)`
Decorates a class as a controller. Set baseUrl to create a route module.

