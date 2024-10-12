import {AnyPromiseResult, AnyToPromise} from "@tsed/core";

import {PlatformContext} from "./PlatformContext.js";

export class AnyToPromiseWithCtx extends AnyToPromise {
  public $ctx: PlatformContext;

  constructor($ctx: PlatformContext) {
    super();
    this.$ctx = $ctx;
  }

  isDone(): boolean {
    const {$ctx} = this;

    return $ctx?.isDone() || super.isDone();
  }

  call(cb: Function): Promise<AnyPromiseResult<any>> {
    return super.call(() => cb(this));
  }

  destroy() {
    (this.$ctx as any) = null;
  }

  isCanceledResponse(process: any) {
    return process === this.$ctx.getResponse();
  }
}
