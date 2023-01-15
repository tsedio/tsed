import {PlatformTest} from "@tsed/common";
import {PlatformTestingSdkOpts} from "../interfaces/index";
import {specsContainer} from "../tests/exports";

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
    return PlatformTest.reset;
  }
}
