/**
 * @module server
 */
/** */
import {IComponentScanned} from "./ComponentScanned";

export interface OnRoutesInit {
    $onRoutesInit(components: IComponentScanned[]): void | Promise<any>;
}