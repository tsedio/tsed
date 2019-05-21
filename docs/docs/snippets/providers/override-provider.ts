import {OriginalService, OverrideProvider} from "@tsed/common";

@OverrideProvider(OriginalService)
export class CustomMiddleware extends OriginalService {
  public method() {
    // Do something
    return super.method();
  }
}
