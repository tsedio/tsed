import {InjectorService} from "@tsed/di";

export class TestContext {
  static injector: InjectorService | null;
  static reset() {
    if (this.injector) {
      this.injector.clear();
    }
    this.injector = null;
  }
}
