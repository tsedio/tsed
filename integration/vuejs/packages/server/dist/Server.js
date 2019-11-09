"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
require("@tsed/swagger");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const path = require("path");
const rootDir = __dirname;
let Server = class Server extends common_1.ServerLoader {
    constructor(settings) {
        super(settings);
    }
    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    $beforeRoutesInit() {
        this
            .use(common_1.GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
            extended: true
        }));
        return null;
    }
};
Server = __decorate([
    common_1.ServerSettings({
        rootDir,
        acceptMimes: ["application/json"],
        httpPort: process.env.PORT || 8080,
        httpsPort: false,
        logger: {
            debug: true,
            logRequest: true,
            requestFields: ["reqId", "method", "url", "headers", "query", "params", "duration"]
        },
        mount: {
            "/rest": [
                `${rootDir}/controllers/**/*.ts` // Automatic Import, /!\ doesn't works with webpack/jest, use  require.context() or manual import instead
            ]
        },
        swagger: [
            {
                path: "/api-docs"
            }
        ],
        calendar: {
            token: true
        },
        statics: {
            "/": path.join(rootDir, "../../client/dist")
        }
    }),
    __metadata("design:paramtypes", [Object])
], Server);
exports.Server = Server;
//# sourceMappingURL=Server.js.map