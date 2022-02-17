import "@tsed/ajv";
import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import Application from "koa";
import bodyParser from "koa-bodyparser";
import compress from "koa-compress";
import session from "koa-session";
// @ts-ignore
import methodOverride from "koa-override";

export const rootDir = __dirname;

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
  }
})
export class Server {
  @Inject()
  app: PlatformApplication<Application>;

  $beforeRoutesInit() {
    this.app.getApp().keys = ["some secret hurr"];
    this.app
      .use(compress())
      .use(methodOverride())
      .use(bodyParser())
      .use(
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
