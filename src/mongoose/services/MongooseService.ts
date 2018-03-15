import {AfterRoutesInit, Constant, ExpressApplication, OnInit, Service} from "@tsed/common";
import * as Mongoose from "mongoose";
import {$log} from "ts-log-debug";
import {MDBConnection} from "../interfaces/MDBConnection";
import {ValidationErrorMiddleware} from "../middlewares/ValidationErrorMiddleware";

@Service()
export class MongooseService implements OnInit, AfterRoutesInit {

    @Constant("mongoose.url")
    private url: string;

    @Constant("mongoose.connectionOptions")
    private connectionOptions: Mongoose.ConnectionOptions;

    @Constant("mongoose.urls")
    private urls: { [key: string]: MDBConnection };

    /**
     *
     * @type {Map<any, any>}
     * @private
     */
    private _instances: Map<string, Mongoose.Mongoose> = new Map();

    constructor(@ExpressApplication private expressApp: ExpressApplication) {
    }

    $onInit(): Promise<any> | void {
        const promises: Promise<Mongoose.Mongoose>[] = [];

        if (this.url) {
            promises.push(this.connect("default", this.url, this.connectionOptions || {}));
        }

        if (this.urls) {
            Object.keys(this.urls).forEach((key: string) => {
                promises.push(this.connect(key, this.urls[key].url, this.urls[key].connectionOptions));
            });
        }

        return Promise.all(promises);
    }

    $afterRoutesInit(): void {
        this.expressApp.use(ValidationErrorMiddleware as any);
    }

    /**
     *
     * @returns {Promise<"mongoose".Connection>}
     */
    async connect(id: string, url: string, connectionOptions: Mongoose.ConnectionOptions = {}): Promise<any> {

        if (this.has(id)) {
            return await this.get(id)!;
        }

        $log.info(`Connect to mongo database: ${id}`);
        $log.debug(`Url: ${url}`);
        $log.debug(`options: ${JSON.stringify(connectionOptions)}`);

        try {
            const mongoose = await Mongoose.connect(url, connectionOptions);
            this._instances.set(id, mongoose);

            return mongoose;
        } catch (er) {
            /* istanbul ignore next */
            $log.error(er);
            /* istanbul ignore next */
            process.exit();
        }
    }

    /**
     *
     * @returns {"mongoose".Connection}
     */
    get(id: string = "default"): Mongoose.Mongoose | undefined {
        return this._instances.get(id);
    }

    /**
     *
     * @param {string} id
     * @returns {boolean}
     */
    has(id: string = "default"): boolean {
        return this._instances.has(id);
    }
}