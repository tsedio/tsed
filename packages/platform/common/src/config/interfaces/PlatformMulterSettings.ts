import type multer from "multer";

declare global {
  namespace TsED {
    export type MulterFile = Express.Multer.File;
    export type MulterStorageEngine = multer.StorageEngine;
    export type MulterOptions = multer.Options;
    export type MulterField = multer.Field;
    export type Multer = multer.Multer;
  }
}

export type PlatformMulter = TsED.Multer;
export type PlatformMulterSettings = TsED.MulterOptions;
export type PlatformMulterFile = TsED.MulterFile;
export type PlatformMulterField = TsED.MulterField;
