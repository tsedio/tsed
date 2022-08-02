import {PlatformTest} from "@tsed/common";
import {catchAsyncError, catchError} from "@tsed/core";
import {OidcInteractionContext, OidcProvider} from "@tsed/oidc-provider";

async function createOidcInteractionContextFixture(grantId: any = "grantId") {
  const $ctx = PlatformTest.createRequestContext();

  const session = {
    accountId: "accountId"
  };

  const interactionDetails: any = {
    uid: "uid",
    grantId,
    session,
    prompt: {
      name: "login"
    },
    params: {
      client_id: "client_id",
      email: "email@email.com"
    },
    save: jest.fn()
  };

  const oidcProvider = {
    interactionDetails: jest.fn().mockResolvedValue(interactionDetails),
    interactionFinished: jest.fn().mockResolvedValue(undefined),
    interactionResult: jest.fn().mockResolvedValue(undefined),
    setProviderSession: jest.fn().mockResolvedValue(undefined),
    find: jest.fn().mockResolvedValue("grant"),
    Grant: class {
      static find = jest.fn().mockResolvedValue(undefined);
    },
    Client: {
      find: jest.fn().mockResolvedValue({
        client_id: "client_id"
      })
    },
    Account: {
      findAccount: jest.fn().mockResolvedValue({
        accountId: "accountId"
      })
    }
  };
  const oidcCtx = await PlatformTest.invoke<OidcInteractionContext>(OidcInteractionContext, [
    {
      token: OidcProvider,
      use: {
        get() {
          return oidcProvider;
        }
      }
    }
  ]);

  await $ctx.runInContext(() => oidcCtx.interactionDetails());

  return {$ctx, oidcCtx, oidcProvider, session, interactionDetails};
}

describe("OidcInteractionContext", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("uid()", () => {
    it("should return uid", async () => {
      const {$ctx, oidcCtx} = await createOidcInteractionContextFixture();

      await $ctx.runInContext(() => {
        expect(oidcCtx.uid).toEqual("uid");
      });
    });
  });

  describe("checkInteractionName()", () => {
    it("should throw error", async () => {
      const {$ctx, oidcCtx} = await createOidcInteractionContextFixture();

      await $ctx.runInContext(() => {
        const error: any = catchError(() => oidcCtx.checkInteractionName("test"));

        expect(error?.message).toEqual("Bad interaction name");
      });
    });
  });

  describe("checkClientId()", () => {
    it("should throw error", async () => {
      const {$ctx, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();
      oidcProvider.Client.find.mockResolvedValue(undefined);

      await $ctx.runInContext(async () => {
        const error: any = await catchAsyncError(() => oidcCtx.checkClientId());

        expect(error?.message).toEqual("Unknown client_id client_id");
      });
    });
  });

  describe("grantId()", () => {
    it("should return uid", async () => {
      const {$ctx, oidcCtx} = await createOidcInteractionContextFixture();
      await $ctx.runInContext(async () => {
        expect(oidcCtx.grantId).toEqual("grantId");
      });
    });
  });

  describe("session()", () => {
    it("should return session", async () => {
      const {$ctx, oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();
      await $ctx.runInContext(async () => {
        expect(oidcCtx.session).toEqual(interactionDetails.session);
      });
    });
  });

  describe("prompt()", () => {
    it("should return prompt", async () => {
      const {$ctx, oidcCtx} = await createOidcInteractionContextFixture();

      await $ctx.runInContext(async () => {
        expect(oidcCtx.prompt).toEqual({
          name: "login"
        });
      });
    });
  });

  describe("params()", () => {
    it("should return params", async () => {
      const {$ctx, oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();
      await $ctx.runInContext(async () => {
        expect(oidcCtx.params).toEqual(interactionDetails.params);
      });
    });
  });

  describe("interactionFinished()", () => {
    it("should return call interactionFinished", async () => {
      const {$ctx, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      await $ctx.runInContext(async () => {
        await oidcCtx.interactionFinished({login: {accountId: "string"}}, {mergeWithLastSubmission: false});

        expect(oidcProvider.interactionFinished).toBeCalledWith(
          $ctx.getReq(),
          $ctx.getRes(),
          {login: {accountId: "string"}},
          {mergeWithLastSubmission: false}
        );
      });
    });
  });

  describe("interactionResult()", () => {
    it("should return call interactionResult", async () => {
      const {$ctx, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();
      await $ctx.runInContext(async () => {
        await oidcCtx.interactionResult({login: {accountId: "string"}}, {mergeWithLastSubmission: false});

        expect(oidcProvider.interactionResult).toBeCalledWith(
          $ctx.getReq(),
          $ctx.getRes(),
          {login: {accountId: "string"}},
          {mergeWithLastSubmission: false}
        );
      });
    });
    it("should return call interactionResult (default)", async () => {
      const {$ctx, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();
      await $ctx.runInContext(async () => {
        await oidcCtx.interactionResult({login: {accountId: "string"}});

        expect(oidcProvider.interactionResult).toBeCalledWith(
          $ctx.getReq(),
          $ctx.getRes(),
          {login: {accountId: "string"}},
          {mergeWithLastSubmission: false}
        );
      });
    });
  });

  describe("render()", () => {
    it("should return call render", async () => {
      const {$ctx, oidcCtx} = await createOidcInteractionContextFixture();
      await $ctx.runInContext(async () => {
        jest.spyOn($ctx.response, "render").mockResolvedValue("");

        await oidcCtx.render("login", {});

        expect($ctx.response.render).toBeCalledWith("login", {});
      });
    });
  });

  describe("save()", () => {
    it("should return call save", async () => {
      const {$ctx, oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();
      await $ctx.runInContext(async () => {
        await oidcCtx.save(2000);

        expect(interactionDetails.save).toBeCalledWith(2000);
      });
    });

    it("should return call save (default)", async () => {
      const {$ctx, oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();
      await $ctx.runInContext(async () => {
        await oidcCtx.save(100);

        expect(interactionDetails.save).toBeCalledWith(100);
      });
    });
  });

  describe("findClient()", () => {
    it("should return call findClient", async () => {
      const {$ctx, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();
      await $ctx.runInContext(async () => {
        const result = await oidcCtx.findClient("client_id");

        expect(result).toEqual({
          client_id: "client_id"
        });
        expect(oidcProvider.Client.find).toBeCalledWith("client_id");
      });
    });

    it("should return call findClient (default)", async () => {
      const {$ctx, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      await $ctx.runInContext(async () => {
        const result = await oidcCtx.findClient();

        expect(result).toEqual({
          client_id: "client_id"
        });
        expect(oidcProvider.Client.find).toBeCalledWith("client_id");
      });
    });
  });

  describe("findAccount()", () => {
    it("should return call findAccount", async () => {
      const {$ctx, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();
      await $ctx.runInContext(async () => {
        const result = await oidcCtx.findAccount(undefined, "token");

        expect(oidcProvider.Account.findAccount).toBeCalledWith(undefined, "accountId", "token");
        expect(result).toEqual({
          accountId: "accountId"
        });
      });
    });

    it("should return call findAccount (with accountId)", async () => {
      const {$ctx, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();
      await $ctx.runInContext(async () => {
        const result = await oidcCtx.findAccount("accountId", "token");

        expect(oidcProvider.Account.findAccount).toBeCalledWith(undefined, "accountId", "token");
        expect(result).toEqual({
          accountId: "accountId"
        });
      });
    });

    it("should return call findAccount (without session/accountId)", async () => {
      const {$ctx, oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();

      await $ctx.runInContext(async () => {
        interactionDetails.session.accountId = undefined;

        const result = await $ctx.runInContext(() => oidcCtx.findAccount(undefined, "token"));

        expect(result).toBeUndefined();
      });
    });
  });

  describe("getGrant()", () => {
    it("should return call grant from grantId", async () => {
      const {$ctx, oidcCtx} = await createOidcInteractionContextFixture();
      await $ctx.runInContext(async () => {
        const result = await oidcCtx.getGrant();
        expect(result).toEqual("grant");
      });
    });

    it("should create grant", async () => {
      const {$ctx, oidcCtx} = await createOidcInteractionContextFixture(null);
      await $ctx.runInContext(async () => {
        const result = await oidcCtx.getGrant();
        expect(result).toEqual({});
      });
    });
  });
});
