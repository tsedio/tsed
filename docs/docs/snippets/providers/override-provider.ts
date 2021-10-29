import {OriginalService} from "@tsed/common";
import {OverrideProvider} from "@tsed/di";

@OverrideProvider(OriginalService)
export class CustomMiddleware extends OriginalService {
  public method() {
    // Do something
    return super.method();
  }
}
