import {Controller, DITest} from "@tsed/di";
import {Post} from "@tsed/schema";
import {afterEach, beforeEach} from "vitest";

import {TransactionalInterceptor} from "../interceptors/TransactionalInterceptor.js";
import {Transactional} from "./transactional.js";

@Controller("/users")
export class UsersCtrl {
  @Post("/")
  @Transactional()
  create(): any {}
}

describe("@Transactional", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());
  it("should decorate method", async () => {
    const interceptor = {
      intercept: vi.fn().mockResolvedValue({})
    };

    const usersService = await DITest.invoke<UsersCtrl>(UsersCtrl, [
      {
        token: TransactionalInterceptor,
        use: interceptor
      }
    ]);

    const result = await usersService.create();

    expect(result).toEqual({});
  });
});
