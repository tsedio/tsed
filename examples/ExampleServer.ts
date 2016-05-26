
import * as Express from "express";
import * as Logger from "log-debug";
import {ServerLoader} from "./../server-loader";
import Path = require("path");

export class ExampleServer extends ServerLoader {

    constructor() {
        let appPath = Path.resolve(__dirname);

        super();
        
        this.setEndpoint('/rest')
            .scan(appPath + "/controllers/**/**.js")
            .createHttpServer(8000)
            .createHttpsServer({
                port: 8080
            });

    }

    /**
     *
     * @returns {Server}
     */
    public importMiddlewares(): ExampleServer {
        let morgan = require('morgan'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override'),
            session = require('express-session');

        //if(this.config.getEnv() !== 'test'){
            this.expressApp.use(morgan('dev')); //Test
        //}

        //httpExceptions.debug(false);

        //MIDDLEWARE - Gestion de l'entete Accept.
        //this.expressApp.use(httpExceptions.mime('application/json'));
        //this.expressApp.use(httpExceptions.paramsRequired())
        //MIDDLEWARES
        this.use(bodyParser.json());
        this.use(bodyParser.urlencoded({
            extended: true
        }));
        this.use(cookieParser());
        this.use(compress({}));
        this.use(methodOverride());

        return this;
    }

    /**
     * 
     * @param error
     * @param request
     * @param response
     * @param next
     */
    public onError(error: any, request: Express.Request, response: Express.Response, next: Function): void {

        Logger.error(error);

        response
            .status(500)
            .send('Internal Server error');
        
        next();
    }

    static Initialize(): Promise<any> {

        Logger.info('Initialize server');

        return new ExampleServer()
            .start()
            .then(() => {
                Logger.info('Server started...');
            });
    }
    
}


