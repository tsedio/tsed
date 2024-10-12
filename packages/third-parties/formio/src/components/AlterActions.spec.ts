import {BadRequest} from "@tsed/exceptions";
import {FormioActionInfo, FormioComponent} from "@tsed/formio-types";
import {PlatformContext} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Context} from "@tsed/platform-params";

import {Action} from "../decorators/action.js";
import {ActionCtx} from "../decorators/actionCtx.js";
import {ActionMethods} from "../domain/FormioAction.js";
import {FormioActions} from "../domain/FormioActionsIndex.js";
import {FormioService} from "../services/FormioService.js";
import {AlterActions} from "./AlterActions.js";

async function getActionsFixture(formio: any) {
  const ctx = PlatformTest.createRequestContext();

  ctx.getRequest().$ctx = ctx;

  const alterActions = await PlatformTest.invoke<AlterActions>(AlterActions, [
    {
      token: FormioService,
      use: formio
    }
  ]);
  return {ctx, alterActions};
}

describe("AlterActions", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it("should create the new actions and return response", async () => {
    @Action({
      name: "custom",
      title: "My custom Action",
      description: "Custom action description",
      priority: 0,
      defaults: {
        handler: [],
        method: []
      }
    })
    class CustomAction implements ActionMethods {
      resolve(@ActionCtx() actionCtx: ActionCtx, @Context() ctx: PlatformContext) {
        return Promise.resolve(actionCtx);
      }

      settingsForm() {
        return Promise.resolve([{} as any]);
      }
    }

    const formio = {
      Action: class Action {}
    };

    // PlatformTest.injector.forkProvider(CustomAction);
    PlatformTest.injector.invoke(CustomAction);

    const {ctx, alterActions} = await getActionsFixture(formio);

    let actions: FormioActions = {} as any;

    actions = alterActions.transform(actions);

    const info: FormioActionInfo = await new Promise((resolve) => {
      actions.custom.info(ctx.getRequest(), ctx.getResponse(), (err, info) => resolve(info));
    });

    const settings: FormioComponent[] = await new Promise((resolve) => {
      actions.custom.settingsForm(ctx.getRequest(), ctx.getResponse(), (err, components) => resolve(components));
    });

    const instance = new actions.custom(info as any, ctx.getRequest(), ctx.getResponse());

    new Promise((resolve) => {
      instance.resolve(
        "handler",
        "method",
        ctx.getRequest(),
        ctx.getResponse(),
        (err: any, result: any) => resolve(result),
        "setActionItemMessage" as any
      );
    });

    await new Promise((r) => setTimeout(r, 200));

    expect(instance).toBeInstanceOf(formio.Action);
    expect(info).toEqual({
      defaults: {
        handler: [],
        method: []
      },
      description: "Custom action description",
      name: "custom",
      priority: 0,
      title: "My custom Action"
    });
    expect(settings).toEqual([{}]);
    expect(ctx.response.raw.data).toEqual({
      handler: "handler",
      method: "method",
      setActionItemMessage: "setActionItemMessage",
      action: {}
    });
  });
  it("should create the new actions and return response with customInfo", async () => {
    @Action({
      name: "custom",
      title: "My custom Action",
      description: "Custom action description",
      priority: 0,
      defaults: {
        handler: [],
        method: []
      }
    })
    class CustomAction implements ActionMethods {
      resolve(@ActionCtx() actionCtx: ActionCtx, @Context() ctx: PlatformContext) {
        return Promise.resolve(actionCtx);
      }

      info(opts: any) {
        return opts;
      }

      settingsForm() {
        return Promise.resolve([{} as any]);
      }
    }

    const formio = {
      Action: class Action {}
    };

    // PlatformTest.injector.forkProvider(CustomAction);
    PlatformTest.injector.invoke(CustomAction);

    const {ctx, alterActions} = await getActionsFixture(formio);

    let actions: FormioActions = {} as any;

    actions = alterActions.transform(actions);

    const info: FormioActionInfo = await new Promise((resolve) => {
      actions.custom.info(ctx.getRequest(), ctx.getResponse(), (err, info) => resolve(info));
    });

    const settings: FormioComponent[] = await new Promise((resolve) => {
      actions.custom.settingsForm(ctx.getRequest(), ctx.getResponse(), (err, components) => resolve(components));
    });

    const instance = new actions.custom(info as any, ctx.getRequest(), ctx.getResponse());

    new Promise((resolve) => {
      instance.resolve(
        "handler",
        "method",
        ctx.getRequest(),
        ctx.getResponse(),
        (err: any, result: any) => resolve(result),
        "setActionItemMessage" as any
      );
    });

    await new Promise((r) => setTimeout(r, 200));

    expect(instance).toBeInstanceOf(formio.Action);
    expect(info).toEqual({
      defaults: {
        handler: [],
        method: []
      },
      description: "Custom action description",
      name: "custom",
      priority: 0,
      title: "My custom Action"
    });
    expect(settings).toEqual([{}]);
    expect(ctx.response.raw.data).toEqual({
      handler: "handler",
      method: "method",
      setActionItemMessage: "setActionItemMessage",
      action: {}
    });
  });
  it("should create the new actions and call next", async () => {
    @Action({
      name: "custom",
      title: "My custom Action",
      description: "Custom action description",
      priority: 0,
      defaults: {
        handler: [],
        method: []
      }
    })
    class CustomAction implements ActionMethods {
      resolve(@ActionCtx() actionCtx: ActionCtx, @Context() ctx: PlatformContext) {
        return Promise.resolve();
      }

      settingsForm() {
        return Promise.resolve([{} as any]);
      }
    }

    const formio = {
      Action: class Action {}
    };

    // PlatformTest.injector.forkProvider(CustomAction);
    PlatformTest.injector.invoke(CustomAction);

    const {ctx, alterActions} = await getActionsFixture(formio);

    let actions: FormioActions = {} as any;

    actions = alterActions.transform(actions);

    const info: FormioActionInfo = await new Promise((resolve) => {
      actions.custom.info(ctx.getRequest(), ctx.getResponse(), (err, info) => resolve(info));
    });

    const instance = new actions.custom(info as any, ctx.getRequest(), ctx.getResponse());

    const result = await new Promise((resolve) => {
      instance.resolve(
        "handler",
        "method",
        ctx.getRequest(),
        ctx.getResponse(),
        (err: any, result: any) => resolve(result),
        "setActionItemMessage" as any
      );
    });
    expect(result).toEqual(undefined);
  });
  it("should create the new actions and call next with error", async () => {
    @Action({
      name: "custom",
      title: "My custom Action",
      description: "Custom action description",
      priority: 0,
      defaults: {
        handler: [],
        method: []
      }
    })
    class CustomAction implements ActionMethods {
      resolve(@ActionCtx() actionCtx: ActionCtx, @Context() ctx: PlatformContext) {
        return Promise.reject(new BadRequest("bad request"));
      }

      settingsForm() {
        return Promise.resolve([{} as any]);
      }
    }

    const formio = {
      Action: class Action {}
    };

    // PlatformTest.injector.forkProvider(CustomAction);
    PlatformTest.injector.invoke(CustomAction);

    const {ctx, alterActions} = await getActionsFixture(formio);

    let actions: FormioActions = {} as any;

    actions = alterActions.transform(actions);

    const info: FormioActionInfo = await new Promise((resolve) => {
      actions.custom.info(ctx.getRequest(), ctx.getResponse(), (err, info) => resolve(info));
    });

    const instance = new actions.custom(info as any, ctx.getRequest(), ctx.getResponse());

    const result: any = await new Promise((resolve) => {
      instance.resolve(
        "handler",
        "method",
        ctx.getRequest(),
        ctx.getResponse(),
        (err: any, result: any) => {
          return resolve(err);
        },
        "setActionItemMessage" as any
      );
    });
    expect(result.message).toEqual("bad request");
  });
  it("should create the new actions and call next (with status and headers)", async () => {
    @Action({
      name: "custom",
      title: "My custom Action",
      description: "Custom action description",
      priority: 0,
      defaults: {
        handler: [],
        method: []
      }
    })
    class CustomAction implements ActionMethods {
      resolve(@ActionCtx() actionCtx: ActionCtx, @Context() ctx: PlatformContext) {
        return Promise.resolve({
          statusText: "Created",
          status: 201,
          headers: {
            "x-header": "test"
          },
          data: {
            hello: "world"
          }
        });
      }

      settingsForm() {
        return Promise.resolve([{} as any]);
      }
    }

    const formio = {
      Action: class Action {}
    };

    // PlatformTest.injector.forkProvider(CustomAction);
    PlatformTest.injector.invoke(CustomAction);

    const {ctx, alterActions} = await getActionsFixture(formio);

    let actions: FormioActions = {} as any;

    actions = alterActions.transform(actions);

    const info: FormioActionInfo = await new Promise((resolve) => {
      actions.custom.info(ctx.getRequest(), ctx.getResponse(), (err, info) => resolve(info));
    });

    const settings: FormioComponent[] = await new Promise((resolve) => {
      actions.custom.settingsForm(ctx.getRequest(), ctx.getResponse(), (err, components) => resolve(components));
    });

    const instance = new actions.custom(info as any, ctx.getRequest(), ctx.getResponse());

    new Promise((resolve) => {
      instance.resolve(
        "handler",
        "method",
        ctx.getRequest(),
        ctx.getResponse(),
        (err: any, result: any) => resolve(result),
        "setActionItemMessage" as any
      );
    });

    await new Promise((r) => setTimeout(r, 200));

    expect(instance).toBeInstanceOf(formio.Action);
    expect(info).toEqual({
      defaults: {
        handler: [],
        method: []
      },
      description: "Custom action description",
      name: "custom",
      priority: 0,
      title: "My custom Action"
    });
    expect(settings).toEqual([{}]);
    expect(ctx.response.raw.data).toEqual({
      hello: "world"
    });
  });
});
