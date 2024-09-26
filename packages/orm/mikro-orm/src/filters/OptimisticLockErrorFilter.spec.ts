import {OptimisticLockError} from "@mikro-orm/core";
import type {Logger} from "@tsed/common";
import {PlatformContext, PlatformTest} from "@tsed/common";
import {instance, mock, objectContaining, reset, spy, verify} from "ts-mockito";

import {OptimisticLockErrorFilter} from "./OptimisticLockErrorFilter.js";

describe("OptimisticLockErrorFilter", () => {
  const mockedLogger: Logger = mock<Logger>();
  let optimisticLockErrorFilter!: OptimisticLockErrorFilter;

  beforeEach(() => {
    optimisticLockErrorFilter = new OptimisticLockErrorFilter();

    return PlatformTest.create();
  });

  afterEach(() => {
    reset(mockedLogger);

    return PlatformTest.reset();
  });

  describe("catch", () => {
    it("should set HTTP status to 409", () => {
      // arrange
      const exception = OptimisticLockError.lockFailed("entity");
      const response = PlatformTest.createResponse();
      const request = PlatformTest.createRequest({
        url: "/admin"
      });
      const context = new PlatformContext({
        event: {
          response,
          request
        },
        id: "id",
        logger: instance(mockedLogger),
        maxStackSize: 0,
        injector: PlatformTest.injector
      });
      const spiedResponse = spy(response);

      // act
      optimisticLockErrorFilter.catch(exception, context);

      verify(mockedLogger.error(objectContaining({exception}))).once();
      verify(spiedResponse.status(409)).once();
    });
  });
});
