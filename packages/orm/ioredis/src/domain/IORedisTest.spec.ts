import {Inject, Injectable} from "@tsed/di";
import type {Redis} from "ioredis";
import RedisMock from "ioredis-mock";

import {registerConnectionProvider} from "../utils/registerConnectionProvider.js";
import {IORedisTest} from "./IORedisTest.js";

const MY_CONNECTION = Symbol("MY_CONNECTION");
type MY_CONNECTION = Redis;

registerConnectionProvider({provide: MY_CONNECTION, name: "default"});

@Injectable()
class MyRepository {
  @Inject(MY_CONNECTION)
  connection: MY_CONNECTION;
}

describe("IORedisTest", () => {
  beforeEach(() => IORedisTest.create());
  afterEach(() => IORedisTest.reset());

  it("should create mocked connection", () => {
    const service = IORedisTest.get(MyRepository);

    expect(service.connection).toBeInstanceOf(RedisMock);
  });
});
