import {Injectable, injectable, injector} from "@tsed/di";
import {BadRequest} from "@tsed/exceptions";
import {PlatformTest} from "@tsed/platform-http/testing";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";

import {invokePlatformParams} from "../../test/helpers/buildPlatformParams.js";
import {HeaderParams} from "../decorators/headerParams.js";
import {PathParams} from "../decorators/pathParams.js";
import {QueryParams} from "../decorators/queryParams.js";
import {UsePipe} from "../decorators/usePipe.js";
import {ParamValidationError} from "../errors/ParamValidationError.js";

class AsyncAPipe implements PipeMethods {
  transform() {
    return new Promise((resolve) => setTimeout(() => resolve("a"), 5));
  }
}

class AppendBPipe implements PipeMethods {
  received: unknown[] = [];

  transform(value: unknown) {
    this.received.push(value);
    return `${value}b`;
  }
}

class ThrowPipe implements PipeMethods {
  transform(): never {
    throw new BadRequest("sync failure");
  }
}

class RejectPipe implements PipeMethods {
  transform() {
    return Promise.reject(new BadRequest("async failure"));
  }
}

injectable(AsyncAPipe).priority(10);
injectable(AppendBPipe).priority(20);
injectable(ThrowPipe);
injectable(RejectPipe);

function createContext(request: any = {}) {
  return PlatformTest.createRequestContext({event: {request}});
}

describe("PlatformParams: parameter resolution", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should resolve the parameters and call the method in the same tick when every pipe is synchronous", async () => {
    const platformParams = await invokePlatformParams();

    @Injectable()
    class SyncParamsCtrl {
      get(@PathParams("id") id: string, @QueryParams("full") full: string) {
        return {id, full};
      }
    }

    injector().add(SyncParamsCtrl);

    const handler = platformParams.compileHandler({token: SyncParamsCtrl, propertyKey: "get"});
    const result = handler({$ctx: createContext({params: {id: "1"}, query: {full: "true"}})});

    expect(result).not.toBeInstanceOf(Promise);
    expect(result).toEqual({id: "1", full: "true"});
  });

  it("should give the resolved value of an async pipe to the next pipe", async () => {
    const platformParams = await invokePlatformParams();

    @Injectable()
    class AsyncPipeCtrl {
      get(@QueryParams("q") @UsePipe(AppendBPipe) @UsePipe(AsyncAPipe) q: string) {
        return q;
      }
    }

    injector().add(AsyncPipeCtrl);

    const handler = platformParams.compileHandler({token: AsyncPipeCtrl, propertyKey: "get"});
    const result = handler({$ctx: createContext({query: {q: "x"}})});

    expect(result).toBeInstanceOf(Promise);
    expect(await result).toEqual("ab");
    expect(injector().get<AppendBPipe>(AppendBPipe)!.received).toEqual(["a"]);
  });

  it("should call the method once with the arguments in order when one parameter is async", async () => {
    const platformParams = await invokePlatformParams();
    const calls: unknown[][] = [];

    @Injectable()
    class MixedParamsCtrl {
      get(@PathParams("id") id: string, @QueryParams("q") @UsePipe(AsyncAPipe) q: string, @QueryParams("p") p: string) {
        calls.push([id, q, p]);
        return "done";
      }
    }

    injector().add(MixedParamsCtrl);

    const handler = platformParams.compileHandler({token: MixedParamsCtrl, propertyKey: "get"});

    expect(await handler({$ctx: createContext({params: {id: "1"}, query: {q: "x", p: "2"}})})).toEqual("done");
    expect(calls).toEqual([["1", "a", "2"]]);
  });

  it("should wrap an error thrown by a pipe in a ParamValidationError", async () => {
    const platformParams = await invokePlatformParams();

    @Injectable()
    class ThrowCtrl {
      get(@QueryParams("q") @UsePipe(ThrowPipe) q: string) {
        return q;
      }
    }

    injector().add(ThrowCtrl);

    const handler = platformParams.compileHandler({token: ThrowCtrl, propertyKey: "get"});
    const error = await (async () => handler({$ctx: createContext({query: {q: "x"}})}))().catch((er) => er);

    expect(error).toBeInstanceOf(ParamValidationError);
    expect(error.origin.message).toEqual("sync failure");
  });

  it("should wrap a rejection of a pipe in a ParamValidationError", async () => {
    const platformParams = await invokePlatformParams();

    @Injectable()
    class RejectCtrl {
      get(@QueryParams("q") @UsePipe(RejectPipe) q: string) {
        return q;
      }
    }

    injector().add(RejectCtrl);

    const handler = platformParams.compileHandler({token: RejectCtrl, propertyKey: "get"});
    const error = await handler({$ctx: createContext({query: {q: "x"}})}).catch((er: any) => er);

    expect(error).toBeInstanceOf(ParamValidationError);
    expect(error.origin.message).toEqual("async failure");
  });

  it("should keep getArg() async for its callers", async () => {
    const platformParams = await invokePlatformParams();

    class Ctrl {
      get(@QueryParams("q") q: string) {}
    }

    const [param] = JsonParameterStore.getParams(Ctrl, "get");
    const result = platformParams.getArg({$ctx: createContext({query: {q: "x"}})}, platformParams.getPipes(param), param);

    expect(result).toBeInstanceOf(Promise);
  });

  it("should read a header parameter declared with an upper-case name", async () => {
    const platformParams = await invokePlatformParams();

    @Injectable()
    class HeaderCtrl {
      get(@HeaderParams("X-Request-Id") id: string) {
        return id;
      }
    }

    injector().add(HeaderCtrl);

    const handler = platformParams.compileHandler({token: HeaderCtrl, propertyKey: "get"});

    expect(handler({$ctx: createContext({headers: {"x-request-id": "42"}})})).toEqual("42");
  });

  it("should give undefined for an empty numeric query value", async () => {
    const platformParams = await invokePlatformParams();

    @Injectable()
    class PageCtrl {
      get(@QueryParams("page") page: number) {
        return {page};
      }
    }

    injector().add(PageCtrl);

    const handler = platformParams.compileHandler({token: PageCtrl, propertyKey: "get"});

    expect(handler({$ctx: createContext({query: {page: ""}})})).toEqual({page: undefined});
  });
});
