import {PlatformDriver, PlatformStaticsOptions} from "@tsed/common";
import {staticsMiddleware} from "../middlewares/staticsMiddleware";

/**
 * @platform
 * @express
 */
export class PlatformExpressDriver<T> extends PlatformDriver<T> {
  statics(endpoint: string, options: PlatformStaticsOptions) {
    const {root, ...props} = options;

    this.use(endpoint, staticsMiddleware(root, props));

    return this;
  }
}
