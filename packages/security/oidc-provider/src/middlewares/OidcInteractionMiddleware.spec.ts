import faker from "@faker-js/faker";
import {PlatformTest} from "@tsed/common";
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

    const middleware = await PlatformTest.invoke<OidcInteractionMiddleware>(OidcInteractionMiddleware, [
      {
        token: OidcInteractionContext,
        use: oidcInteractionContext
      }
    ]);

    await middleware.use();

    expect(oidcInteractionContext.interactionDetails).toBeCalledWith();
  });
});
