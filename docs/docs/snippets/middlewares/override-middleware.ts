import {OriginalMiddleware, OverrideProvider} from "@tsed/common";

@OverrideProvider(OriginalMiddleware)
export class CustomMiddleware extends OriginalMiddleware {
  public use() {
    // Do something
    return super.use();
  }
}
