import {Store} from "@tsed/core";
import {MulterFileSize, MultipartFileMiddleware} from "@tsed/multipartfiles";
import {expect} from "chai";

describe("MulterFileSize", () => {
  it("should set the file size", () => {
    class Test {
      @MulterFileSize(100)
      file() {}
    }

    const store = Store.fromMethod(Test, "file");
    expect(store.get(MultipartFileMiddleware)).to.deep.eq({
      options: {
        limits: {
          fileSize: 100,
        },
      },
    });
  });
});
