export const createFakeRawDriver = () => {
  // istanbul ignore next
  function FakeRawDriver() {}

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

  return FakeRawDriver;
};
