import {Inject, Injectable} from "@tsed/di";
import type {RedisClientType} from "redis";

import {registerConnectionProvider} from "../utils/registerConnectionProvider.js";
import {RedisTest} from "./RedisTest.js";

const MY_CONNECTION = Symbol("MY_CONNECTION");
type MY_CONNECTION = RedisClientType;

registerConnectionProvider({token: MY_CONNECTION, name: "default"});

@Injectable()
class MyRepository {
  @Inject(MY_CONNECTION)
  connection: MY_CONNECTION;
}

describe("RedisTest", () => {
  beforeEach(() => RedisTest.create());
  afterEach(() => RedisTest.reset());

  it("should create mocked connection", () => {
    const service = RedisTest.get(MyRepository);

    expect(service.connection).toBeDefined();
  });
});
