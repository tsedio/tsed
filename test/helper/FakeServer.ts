// import {ServerLoader} from "../../src";
//
// export class FakeServer extends ServerLoader {
//
//     public importMiddlewares(): ServerLoader {
//         return this;
//     }
//
//
//     public createHttpServer(port): ServerLoader {
//
//         (<any>this)._httpServer = {
//             port: undefined,
//             events: {},
//             listen: function (port) {
//                 this.port = port;
//                 return this;
//             },
//             on: function (event, fn) {
//                 this.events[event] = fn;
//                 return this;
//             },
//             fire: function (event) {
//                 this.events[event]();
//                 return this;
//             }
//         };
//
//         (<any>this).httpsPort = port;
//         return this;
//     }
//
//     public createHttpsServer(options: any): ServerLoader {
//
//         (<any>this)._httpsServer = {
//             port: undefined,
//             events: {},
//             listen: function (port) {
//                 this.port = port;
//                 return this;
//             },
//             on: function (event, fn) {
//                 this.events[event] = fn;
//                 return this;
//             },
//             fire: function (event) {
//                 this.events[event]();
//                 return this;
//             }
//         };
//
//         (<any>this).httpsPort = options.port;
//         return this;
//     }
// }