import "@tsed/ajv";

import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import Application from "koa";
import session from "koa-session";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build
export {rootDir};

@Configuration({
  port: 8083,
  statics: {
    "/": `${rootDir}/public`
  },
  views: {
    root: `${rootDir}/views`,
    extensions: {
      ejs: "ejs"
    }
  },
  middlewares: ["koa-compress", "koa-override", "koa-bodyparser"]
})
export class Server {
  @Inject()
  app: PlatformApplication<Application>;

  $beforeRoutesInit() {
    this.app.getApp().keys = ["some secret hurr"];
    this.app.use(
      session(
        {
          key: "connect.sid" /** (string) cookie key (default is koa.sess) */,
          /** (number || 'session') maxAge in ms (default is 1 days) */
          /** 'session' will result in a cookie that expires when session/browser is closed */
          /** Warning: If a session cookie is stolen, this cookie will never expire */
          maxAge: 86400000,
          /** (boolean) automatically commit headers (default true) */
          overwrite: true,
          /** (boolean) can overwrite or not (default true) */
          httpOnly: false,
          /** (boolean) httpOnly or not (default true) */
          signed: false,
          /** (boolean) signed or not (default true) */
          rolling: false,
          /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
          renew: false,
          /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
          secure: false,
          /** (boolean) secure cookie*/
          sameSite: undefined /** (string) session cookie sameSite options (default null, don't set it) */
        },
        this.app.rawApp as any
      )
    );
  }
}
