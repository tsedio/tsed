import {getAsyncStore, getContext, Injectable, runInContext} from "@tsed/di";

/**
 * @deprecated Since 2022-05-14. Use getAsyncStore()/runInContext() to retrieve context.
 */
@Injectable()
export class PlatformAsyncHookContext {
  static getStore = getAsyncStore;
  static run = runInContext;
  getContext = getContext;
  run = runInContext;
}
