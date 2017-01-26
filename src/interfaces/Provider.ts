import {Type} from "./Type";

export interface IProvider {
    /**
     * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
     */
    provide: any;

    /**
     * Class to instantiate for the `token`.
     */
    useClass: Type<any>;

    /**
     *
     */
    instance?: any;
    /**
     *
     */
    type?: "service"|"factory";
}
