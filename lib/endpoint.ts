import {Promisify} from "./promisify";

export const METHODS = [
    "all", "checkout", "connect",
    "copy", "delete", "get",
    "head", "lock", "merge",
    "mkactivity", "mkcol", "move",
    "m-search", "notify", "options",
    "param", "patch", "post",
    "propfind", "propatch", "purge",
    "put", "report", "search",
    "subscribe", "trace", "unlock",
    "unsuscribe"
];

export class Endpoint {
    /**
     * 
     */
    private handler: Function;
    /**
     * 
     * @type {Array}
     */
    private args: any[] = [];
    /**
     * 
     */
    private method: string;
    /**
     * 
     */
    private route: string | RegExp;

    /**
     * Create new Endpoint manager for a class + method
     * @param targetClass
     * @param methodClassName
     */
    constructor(targetClass: Function, methodClassName: string) {
        this.handler = <Function> Promisify(targetClass, methodClassName);
    }

    /**
     * add new endpoints
     * @param args
     */
    public push(args: any[]): void {

        let filteredArg = args
            .filter((arg: any) => {

                /* istanbul ignore else */
                if (typeof arg === "string") {

                    if (METHODS.indexOf(arg) > -1) {
                        this.method = arg;
                    } else {
                        this.route = arg;
                    }

                    return false;
                }

               /* if (arg instanceof RegExp) {

                    this.route = arg;

                    return false;
                }*/

                return !!arg;
            });

        this.args = this.args.concat(filteredArg);
    }

    /**
     * 
     * @returns {boolean}
     */
    public hasMethod(): boolean {
        return !!this.method;
    }

    /**
     * 
     * @returns {string}
     */
    public getMethod(): string {
        return this.method;
    }

    /**
     * 
     * @returns {T[]}
     */
    public toArray(): any[] {

        return <any[]>[this.method, this.route]
            .concat(<any>this.args, [<any>this.handler])
            .filter((item) => (!!item));
    }
}