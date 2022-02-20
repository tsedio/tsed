import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as faker from "faker";
import Sinon from "sinon";
import {
  INTERACTION_CONTEXT,
  INTERACTION_DETAILS,
  INTERACTION_PARAMS,
  INTERACTION_PROMPT,
  INTERACTION_SESSION,
  INTERACTION_UID
} from "../constants/constants";
import {OidcInteractionContext} from "../services/OidcInteractionContext";
import {OidcInteractionMiddleware} from "./OidcInteractionMiddleware";

describe("OidcInteractionMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create interaction details and store it to the context", async () => {
    const interactionDetails = {
      uid: faker.random.uuid(),
      prompt: {},
      params: {},
      session: {}
    };
    const oidcInteractionContext = {
      interactionDetails: Sinon.stub().resolves(interactionDetails)
    };
    const ctx = PlatformTest.createRequestContext();
    ctx.container.set(OidcInteractionContext, oidcInteractionContext);

    const middleware = await PlatformTest.invoke<OidcInteractionMiddleware>(OidcInteractionMiddleware);

    await middleware.use(ctx);

    expect(oidcInteractionContext.interactionDetails).to.have.been.calledWithExactly();
    expect(ctx.get(INTERACTION_CONTEXT)).to.eq(oidcInteractionContext);
    expect(ctx.get(INTERACTION_DETAILS)).to.eq(interactionDetails);
    expect(ctx.get(INTERACTION_UID)).to.eq(interactionDetails.uid);
    expect(ctx.get(INTERACTION_PROMPT)).to.eq(interactionDetails.prompt);
    expect(ctx.get(INTERACTION_PARAMS)).to.eq(interactionDetails.params);
    expect(ctx.get(INTERACTION_SESSION)).to.eq(interactionDetails.session);
  });
});
