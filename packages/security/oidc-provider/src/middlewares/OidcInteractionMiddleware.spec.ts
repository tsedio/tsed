import {faker} from "@faker-js/faker";
import {PlatformTest} from "@tsed/platform-http/testing";

import {
  INTERACTION_CONTEXT,
  INTERACTION_DETAILS,
  INTERACTION_PARAMS,
  INTERACTION_PROMPT,
  INTERACTION_SESSION,
  INTERACTION_UID
} from "../constants/constants.js";
import {OidcInteractionContext} from "../services/OidcInteractionContext.js";
import {OidcInteractionMiddleware} from "./OidcInteractionMiddleware.js";

describe("OidcInteractionMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create interaction details and store it to the context", async () => {
    const interactionDetails = {
      uid: faker.string.uuid(),
      prompt: {},
      params: {},
      session: {}
    };
    const oidcInteractionContext = {
      interactionDetails: vi.fn().mockReturnValue(interactionDetails)
    };

    const middleware = await PlatformTest.invoke<OidcInteractionMiddleware>(OidcInteractionMiddleware, [
      {
        token: OidcInteractionContext,
        use: oidcInteractionContext
      }
    ]);

    await middleware.use();

    expect(oidcInteractionContext.interactionDetails).toHaveBeenCalledWith();
  });
});
