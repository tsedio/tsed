import {PlatformTest} from "@tsed/common";
import {PlatformTestOptions} from "./interfaces";
import {specsContainer} from "./tests";

export class PlatformTestUtils {
  protected constructor(private options: PlatformTestOptions) {}

  static create(options: PlatformTestOptions) {
    return new PlatformTestUtils({disableComponentsScan: true, ...options});
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
