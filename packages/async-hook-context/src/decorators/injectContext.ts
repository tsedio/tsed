import {Inject} from "@tsed/di";
import {PlatformAsyncHookContext} from "../services/PlatformAsyncHookContext";

export function InjectContext(): PropertyDecorator {
  return Inject(PlatformAsyncHookContext, (bean: PlatformAsyncHookContext) => bean.getContext()) as PropertyDecorator;
}
