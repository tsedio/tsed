import {PlatformTest, TokenProvider} from "@tsed/common";

/**
 * @deprecated
 */
export interface IInvokeOptions {
  token?: TokenProvider;
  /**
   * @deprecated
   */
  provide?: TokenProvider;
  use: any;
}

/**
 * @deprecated Use PlatformTest instead of
 */
export class TestContext extends PlatformTest {
  /**
   * @deprecated Use PlatformTest.invoke instead of
   */
  static invoke<T = any>(target: TokenProvider, providers: IInvokeOptions[] = []): T | Promise<T> {
    providers = providers.map((p) => {
      return {
        token: p.token || p.provide,
        use: p.use
      };
    });

    return super.invoke(target, providers);
  }
}
