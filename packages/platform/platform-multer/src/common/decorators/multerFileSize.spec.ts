import {MulterFileSize} from "./multerFileSize.js";
import {PLATFORM_MULTER_OPTIONS} from "../constants/constants.js";
import {Store} from "@tsed/core";

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
