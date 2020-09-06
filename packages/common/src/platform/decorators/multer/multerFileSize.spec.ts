import {PlatformMulterMiddleware} from "@tsed/common";
import {Store} from "@tsed/core";
import {MulterFileSize} from "@tsed/multipartfiles";
import {expect} from "chai";

describe("MulterFileSize", () => {
  it("should set the file size", () => {
    class Test {
      @MulterFileSize(100)
      file() {
      }
    }

    const store = Store.fromMethod(Test, "file");
    expect(store.get(PlatformMulterMiddleware)).to.deep.eq({
      options: {
        limits: {
          fileSize: 100
        }
      }
    });
  });
});
