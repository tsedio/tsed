import {ConnectionOptions} from "mongoose";
import {MDBConnection} from "./MDBConnection";

declare interface IServerSettings {
    mongoose: {
        url?: string;
        connectionOptions?: ConnectionOptions;
        urls?: { [key: string]: MDBConnection }
    };
}