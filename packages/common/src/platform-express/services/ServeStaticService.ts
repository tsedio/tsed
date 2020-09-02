import {Service} from "@tsed/di";
import * as Express from "express";
import {PlatformApplication} from "../../platform/services/PlatformApplication";
/**
 * @deprecated Use PlatformApplication.statics() instead
 */
@Service()
export class ServeStaticService {
  constructor(private app: PlatformApplication) {}

  statics(statics: {[key: string]: string | string[]}) {
    /* istanbul ignore else */
    Object.keys(statics).forEach((path) => {
      [].concat(statics[path] as any).forEach((directory: string) => this.mount(path, directory));
    });
  }

  mount(path: string, root: string) {
    this.app.statics(path, {root});
  }
}
