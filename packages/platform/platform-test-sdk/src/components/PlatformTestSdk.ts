import {PlatformTest} from "@tsed/platform-http/testing";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";
import {specsContainer} from "../tests/exports.js";

export class PlatformTestSdk {
  protected constructor(private options: PlatformTestingSdkOpts) {}

  static create(options: PlatformTestingSdkOpts) {
    return new PlatformTestSdk(options);
  }

  test(name: string, options: any = {}) {
    specsContainer.get(name)!({
      ...this.options,
      ...options
    });
  }

  bootstrap(options: any = {}) {
    return PlatformTest.bootstrap(this.options.server, {
      ...this.options,
      ...options
    });
  }

  reset() {
    return PlatformTest.reset();
  }
}
