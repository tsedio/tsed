import {PlatformTest} from "@tsed/common";
import faker from "@faker-js/faker";
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
      uid: faker.datatype.uuid(),
      prompt: {},
      params: {},
      session: {}
    };
    const oidcInteractionContext = {
      interactionDetails: jest.fn().mockReturnValue(interactionDetails)
    };
    const ctx = PlatformTest.createRequestContext();
    ctx.container.set(OidcInteractionContext, oidcInteractionContext);

    const middleware = await PlatformTest.invoke<OidcInteractionMiddleware>(OidcInteractionMiddleware);

    await middleware.use(ctx);

    expect(oidcInteractionContext.interactionDetails).toBeCalledWith();
    expect(ctx.get(INTERACTION_CONTEXT)).toEqual(oidcInteractionContext);
    expect(ctx.get(INTERACTION_DETAILS)).toEqual(interactionDetails);
    expect(ctx.get(INTERACTION_UID)).toEqual(interactionDetails.uid);
    expect(ctx.get(INTERACTION_PROMPT)).toEqual(interactionDetails.prompt);
    expect(ctx.get(INTERACTION_PARAMS)).toEqual(interactionDetails.params);
    expect(ctx.get(INTERACTION_SESSION)).toEqual(interactionDetails.session);
  });
});
