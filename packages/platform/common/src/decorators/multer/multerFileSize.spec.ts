import {MulterFileSize, PlatformMulterMiddleware} from "@tsed/common";
import {Store} from "@tsed/core";

describe("MulterFileSize", () => {
  it("should set the file size", () => {
    class Test {
      @MulterFileSize(100)
      file() {}
    }

    const store = Store.fromMethod(Test, "file");
    expect(store.get(PlatformMulterMiddleware)).toEqual({
      options: {
        limits: {
          fileSize: 100
        }
      }
    });
  });
});
