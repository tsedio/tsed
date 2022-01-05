/**
 * @ignore
 */
import {IncomingMessage, ServerResponse} from "http";

export const createFakeRawDriver = (options?: any) => {
  // istanbul ignore next
  function FakeRawDriver(req: IncomingMessage, res: ServerResponse) {}

  // istanbul ignore next
  function use() {
    return this;
  }

  FakeRawDriver.use = use;
  FakeRawDriver.all = use;
  FakeRawDriver.get = use;
  FakeRawDriver.patch = use;
  FakeRawDriver.post = use;
  FakeRawDriver.put = use;
  FakeRawDriver.head = use;
  FakeRawDriver.delete = use;
  FakeRawDriver.options = use;
  FakeRawDriver.callback = (req: IncomingMessage, res: ServerResponse) => FakeRawDriver(req, res);

  return FakeRawDriver;
};
