import {Store} from "@tsed/core";

import {PlatformMulterMiddleware} from "../../middlewares/PlatformMulterMiddleware.js";
import {MulterFileSize} from "./multerFileSize.js";

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
