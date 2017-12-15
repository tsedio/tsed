import {Store} from "../../core";
import {SocketReturnsTypes} from "../interfaces/SocketReturnsTypes";

export function SocketReturns(eventName: string, type: SocketReturnsTypes) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        Store.from(target).merge("socketIO", {
            handlers: {
                [propertyKey]: {
                    returns: {
                        eventName,
                        type
                    }
                }
            }
        });
    };
}
