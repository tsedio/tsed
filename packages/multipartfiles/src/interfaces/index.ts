import * as multer from "multer";

declare global {
  namespace TsED {
    interface Configuration {
      multer: multer.Options;
    }
  }
}
