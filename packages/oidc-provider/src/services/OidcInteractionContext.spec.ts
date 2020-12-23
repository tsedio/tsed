import {PlatformContext, PlatformResponse, PlatformTest} from "@tsed/common";
import {OidcInteractionContext, OidcProvider} from "@tsed/oidc-provider";
import {expect} from "chai";
import Sinon from "sinon";
import {FakeResponse} from "../../../../test/helper";

const sandbox = Sinon.createSandbox();

async function createOidcInteractionContextFixture() {
  const context = PlatformTest.createRequestContext({
    response: new PlatformResponse(new FakeResponse(sandbox))
  });

  const session = {
    accountId: sandbox.stub().returns("accountId")
  };

  const interactionDetails = {
    uid: "uid",
    session,
    prompt: {
      name: "login"
    },
    params: {
      client_id: "client_id",
      email: "email@email.com"
    },
    save: sandbox.stub()
  };

  const oidcProvider = {
    interactionDetails: sandbox.stub().resolves(interactionDetails),
    interactionFinished: sandbox.stub().resolves(),
    interactionResult: sandbox.stub().resolves(),
    setProviderSession: sandbox.stub().resolves(),
    Client: {
      find: sandbox.stub().resolves({
        client_id: "client_id"
      })
    },
    Account: {
      findAccount: sandbox.stub().resolves({
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

      expect(oidcCtx.uid).to.eq("uid");
    });
  });

  describe("session()", () => {
    it("should return session", async () => {
      const {oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();

      expect(oidcCtx.session).to.eq(interactionDetails.session);
    });
  });

  describe("prompt()", () => {
    it("should return prompt", async () => {
      const {oidcCtx} = await createOidcInteractionContextFixture();

      expect(oidcCtx.prompt).to.deep.eq({
        name: "login"
      });
    });
  });

  describe("params()", () => {
    it("should return params", async () => {
      const {oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();

      expect(oidcCtx.params).to.deep.eq(interactionDetails.params);
    });
  });

  describe("interactionFinished()", () => {
    it("should return call interactionFinished", async () => {
      const {context, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      await oidcCtx.interactionFinished({login: {account: "string"}}, {mergeWithLastSubmission: false});

      expect(oidcProvider.interactionFinished).to.have.been.calledWithExactly(
        context.getReq(),
        context.getRes(),
        {login: {account: "string"}},
        {mergeWithLastSubmission: false}
      );
    });
  });

  describe("interactionResult()", () => {
    it("should return call interactionResult", async () => {
      const {context, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      await oidcCtx.interactionResult({login: {account: "string"}}, {mergeWithLastSubmission: false});

      expect(oidcProvider.interactionResult).to.have.been.calledWithExactly(
        context.getReq(),
        context.getRes(),
        {login: {account: "string"}},
        {mergeWithLastSubmission: false}
      );
    });
    it("should return call interactionResult (default)", async () => {
      const {context, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      await oidcCtx.interactionResult({login: {account: "string"}});

      expect(oidcProvider.interactionResult).to.have.been.calledWithExactly(
        context.getReq(),
        context.getRes(),
        {login: {account: "string"}},
        {mergeWithLastSubmission: false}
      );
    });
  });

  describe("setProviderSession()", () => {
    it("should return call setProviderSession", async () => {
      const {context, oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      await oidcCtx.setProviderSession({account: "string"});

      expect(oidcProvider.setProviderSession).to.have.been.calledWithExactly(context.getReq(), context.getRes(), {account: "string"});
    });
  });

  describe("render()", () => {
    it("should return call render", async () => {
      const {context, oidcCtx} = await createOidcInteractionContextFixture();

      sandbox.stub(context.response, "render");

      await oidcCtx.render("login", {});

      expect(context.response.render).to.have.been.calledWithExactly("login", {});
    });
  });

  describe("save()", () => {
    it("should return call save", async () => {
      const {oidcCtx, interactionDetails, oidcProvider} = await createOidcInteractionContextFixture();

      await oidcCtx.save(2000);

      expect(interactionDetails.save).to.have.been.calledWithExactly(2000);
    });

    it("should return call save (default)", async () => {
      const {oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();

      await oidcCtx.save();

      expect(interactionDetails.save).to.have.been.calledWithExactly(undefined);
    });
  });

  describe("findClient()", () => {
    it("should return call findClient", async () => {
      const {oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      const result = await oidcCtx.findClient("client_id");

      expect(result).to.deep.eq({
        client_id: "client_id"
      });
      expect(oidcProvider.Client.find).to.have.been.calledWithExactly("client_id");
    });

    it("should return call findClient (default)", async () => {
      const {oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      const result = await oidcCtx.findClient();

      expect(result).to.deep.eq({
        client_id: "client_id"
      });
      expect(oidcProvider.Client.find).to.have.been.calledWithExactly("client_id");
    });
  });

  describe("findAccount()", () => {
    it("should return call findAccount", async () => {
      const {oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      const result = await oidcCtx.findAccount(undefined, "token");

      expect(oidcCtx.session?.accountId).to.have.been.calledWithExactly();
      expect(oidcProvider.Account.findAccount).to.have.been.calledWithExactly(undefined, "accountId", "token");
      expect(result).to.deep.eq({
        accountId: "accountId"
      });
    });

    it("should return call findAccount (with accountId)", async () => {
      const {oidcCtx, oidcProvider} = await createOidcInteractionContextFixture();

      const result = await oidcCtx.findAccount("accountId", "token");

      expect(oidcProvider.Account.findAccount).to.have.been.calledWithExactly(undefined, "accountId", "token");
      expect(result).to.deep.eq({
        accountId: "accountId"
      });
    });

    it("should return call findAccount (without session/accountId)", async () => {
      const {oidcCtx, interactionDetails} = await createOidcInteractionContextFixture();

      interactionDetails.session.accountId.returns(undefined);

      const result = await oidcCtx.findAccount(undefined, "token");

      expect(result).to.deep.eq(undefined);
    });
  });
});
