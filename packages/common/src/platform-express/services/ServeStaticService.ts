import {Service} from "@tsed/di";
import * as Express from "express";
import {IServerMountDirectories} from "../../config";
import {PlatformApplication} from "../../platform/services/PlatformApplication";

function statics(directory: string) {
  const middleware = Express.static(directory);

  return (request: any, response: any, next: any) => {
    if (!response.headersSent) {
      middleware(request, response, next);
    } else {
      next();
    }
  };
}

@Service()
export class ServeStaticService {
  constructor(private platformApplication: PlatformApplication) {}

  statics(statics: IServerMountDirectories) {
    /* istanbul ignore else */
    Object.keys(statics).forEach((path) => {
      [].concat(statics[path] as any).forEach((directory: string) => this.mount(path, directory));
    });
  }

  mount(path: string, directory: string) {
    this.platformApplication.use(path, statics(directory));
  }
}
