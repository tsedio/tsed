import {PlatformContext, PlatformTest} from "@tsed/common";
import {OidcInteractionContext, OidcProvider} from "@tsed/oidc-provider";

async function createOidcInteractionContextFixture(grantId: any = "grantId") {
  const context = PlatformTest.createRequestContext();

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
      token: PlatformContext,
      use: context
    },
    {
      token: OidcProvider,
      use: {
        get() {
          return oidcProvider;
        }
      }
    }
  ]);

  await oidcCtx.interactionDetails();

  return {context, oidcCtx, oidcProvider, session, interactionDetails};
}

describe("OidcInteractionContext", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("uid()", () => {
    it("should return uid", async () => {
      const {oidcCtx} = await createOidcInteractionContextFixture();

      expect(oidcCtx.uid).toEqual("uid");
    });
  });

  describe("grantId()", () => {
    it("should return uid", async () => {
      const {oidcCtx} = await createOidcInteractionContextFixture();

      expect(oidcCtx.grantId).toEqual("grantId");
    });
  });

  describe("session()", () => {
    it("should return session", async () => {
      const {oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();

      expect(oidcCtx.session).toEqual(interactionDetails.session);
    });
  });

  describe("prompt()", () => {
    it("should return prompt", async () => {
      const {oidcCtx} = await createOidcInteractionContextFixture();

      expect(oidcCtx.prompt).toEqual({
        name: "login"
      });
    });
  });

  describe("params()", () => {
    it("should return params", async () => {
      const {oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();

      expect(oidcCtx.params).toEqual(interactionDetails.params);
    });
  });

  describe("interactionFinished()", () => {
    it("should return call interactionFinished", async () => {
      const {context, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      await oidcCtx.interactionFinished({login: {accountId: "string"}}, {mergeWithLastSubmission: false});

      expect(oidcProvider.interactionFinished).toBeCalledWith(
        context.getReq(),
        context.getRes(),
        {login: {accountId: "string"}},
        {mergeWithLastSubmission: false}
      );
    });
  });

  describe("interactionResult()", () => {
    it("should return call interactionResult", async () => {
      const {context, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      await oidcCtx.interactionResult({login: {accountId: "string"}}, {mergeWithLastSubmission: false});

      expect(oidcProvider.interactionResult).toBeCalledWith(
        context.getReq(),
        context.getRes(),
        {login: {accountId: "string"}},
        {mergeWithLastSubmission: false}
      );
    });
    it("should return call interactionResult (default)", async () => {
      const {context, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      await oidcCtx.interactionResult({login: {accountId: "string"}});

      expect(oidcProvider.interactionResult).toBeCalledWith(
        context.getReq(),
        context.getRes(),
        {login: {accountId: "string"}},
        {mergeWithLastSubmission: false}
      );
    });
  });

  describe("render()", () => {
    it("should return call render", async () => {
      const {context, oidcCtx} = await createOidcInteractionContextFixture();

      jest.spyOn(context.response, "render").mockResolvedValue("");

      await oidcCtx.render("login", {});

      expect(context.response.render).toBeCalledWith("login", {});
    });
  });

  describe("save()", () => {
    it("should return call save", async () => {
      const {oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();

      await oidcCtx.save(2000);

      expect(interactionDetails.save).toBeCalledWith(2000);
    });

    it("should return call save (default)", async () => {
      const {oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();

      await oidcCtx.save(100);

      expect(interactionDetails.save).toBeCalledWith(100);
    });
  });

  describe("findClient()", () => {
    it("should return call findClient", async () => {
      const {oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      const result = await oidcCtx.findClient("client_id");

      expect(result).toEqual({
        client_id: "client_id"
      });
      expect(oidcProvider.Client.find).toBeCalledWith("client_id");
    });

    it("should return call findClient (default)", async () => {
      const {oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      const result = await oidcCtx.findClient();

      expect(result).toEqual({
        client_id: "client_id"
      });
      expect(oidcProvider.Client.find).toBeCalledWith("client_id");
    });
  });

  describe("findAccount()", () => {
    it("should return call findAccount", async () => {
      const {oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      const result = await oidcCtx.findAccount(undefined, "token");

      expect(oidcProvider.Account.findAccount).toBeCalledWith(undefined, "accountId", "token");
      expect(result).toEqual({
        accountId: "accountId"
      });
    });

    it("should return call findAccount (with accountId)", async () => {
      const {oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      const result = await oidcCtx.findAccount("accountId", "token");

      expect(oidcProvider.Account.findAccount).toBeCalledWith(undefined, "accountId", "token");
      expect(result).toEqual({
        accountId: "accountId"
      });
    });

    it("should return call findAccount (without session/accountId)", async () => {
      const {oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();

      interactionDetails.session.accountId = undefined;

      const result = await oidcCtx.findAccount(undefined, "token");

      expect(result).toBeUndefined();
    });
  });

  describe("getGrant()", () => {
    it("should return call grant from grantId", async () => {
      const {oidcCtx} = await createOidcInteractionContextFixture();

      const result = await oidcCtx.getGrant();
      expect(result).toEqual("grant");
    });

    it("should create grant", async () => {
      const {oidcCtx} = await createOidcInteractionContextFixture(null);

      const result = await oidcCtx.getGrant();
      expect(result).toEqual({});
    });
  });
});
