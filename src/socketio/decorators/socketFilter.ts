import {Store} from "../../core";
import {SocketFilters} from "../interfaces/SocketFilters";

export function SocketFilter(filter: SocketFilters, mapIndex?: number) {
    return (target: any, propertyKey: string, index: number) =>
        Store.from(target).merge("socketIO", {
            handlers: {
                [propertyKey]: {
                    parameters: {
                        [index]: {
                            filter,
                            mapIndex
                        }
                    }
                }
            }
        });
}