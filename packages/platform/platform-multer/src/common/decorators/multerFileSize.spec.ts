import {Store} from "@tsed/core";

import {PLATFORM_MULTER_OPTIONS} from "../constants/constants.js";
import {MulterFileSize} from "./multerFileSize.js";

describe("MulterFileSize", () => {
  it("should set the file size", () => {
    class Test {
      @MulterFileSize(100)
      file() {}
    }

    const store = Store.fromMethod(Test, "file");
    expect(store.get(PLATFORM_MULTER_OPTIONS)).toEqual({
      options: {
        limits: {
          fileSize: 100
        }
      }
    });
  });
});
