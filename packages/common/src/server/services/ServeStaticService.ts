import {Service} from "@tsed/di";
import * as Express from "express";
import {IServerMountDirectories} from "../../config";
import {ExpressApplication} from "../decorators/expressApplication";

@Service()
export class ServeStaticService {
  constructor(@ExpressApplication private expressApp: Express.Application) {}

  statics(statics: IServerMountDirectories) {
    /* istanbul ignore else */
    Object.keys(statics).forEach(path => {
      [].concat(statics[path] as any).forEach((directory: string) => this.mount(path, directory));
    });
  }

  mount(path: string, directory: string) {
    const middleware = Express.static(directory);
    this.expressApp.use(path, (request: any, response: any, next: any) => {
      if (!response.headersSent) {
        middleware(request, response, next);
      } else {
        next();
      }
    });
  }
}
