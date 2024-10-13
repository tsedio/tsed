import {OptimisticLockError} from "@mikro-orm/core";
import {PlatformTest} from "@tsed/platform-http/testing";

import {OptimisticLockErrorFilter} from "./OptimisticLockErrorFilter.js";

describe("OptimisticLockErrorFilter", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("catch", () => {
    it("should set HTTP status to 409", async () => {
      const optimisticLockErrorFilter = await PlatformTest.invoke(OptimisticLockErrorFilter);

      // arrange
      const exception = OptimisticLockError.lockFailed("entity");
      const context = PlatformTest.createRequestContext();

      vi.spyOn(context.logger, "error").mockReturnThis();

      // act
      optimisticLockErrorFilter.catch(exception, context);

      expect(context.logger.error).toHaveBeenCalledWith({
        event: "MIKRO_ORM_OPTIMISTIC_LOCK_ERROR",
        error_name: exception.name,
        error_message: exception.message,
        stack: exception.stack
      });
      expect(context.response.getBody()).toEqual("Update refused. The resource has changed on the server. Please try again later");
      expect(context.response.statusCode).toEqual(409);
    });
  });
});
