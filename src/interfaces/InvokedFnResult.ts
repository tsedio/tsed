import * as Bluebird from "bluebird";

export interface IInvokedFNResult {
    result: Bluebird<any> | any | void;
    impliciteNext: boolean;
}