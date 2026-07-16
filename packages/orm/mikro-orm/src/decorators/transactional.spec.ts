import {Controller, DITest} from "@tsed/di";
import {afterEach, beforeEach} from "vitest";
import {Post} from "@tsed/schema";
import {Transactional} from "./transactional.js";
import {TransactionalInterceptor} from "../interceptors/TransactionalInterceptor.js";

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
