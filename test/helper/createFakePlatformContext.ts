import {PlatformRequest, PlatformResponse, PlatformTest} from "@tsed/common";
import {FakeRequest} from "./FakeRequest";
import {FakeResponse} from "./FakeResponse";

export function creatFakePlatformContext(sandbox: any) {
  const res = new FakeResponse(sandbox);
  const req = new FakeRequest();

  const ctx = PlatformTest.createRequestContext({
    response: new PlatformResponse(res),
    request: new PlatformRequest(req)
  });

  req.$ctx = ctx;

  return ctx;
}
