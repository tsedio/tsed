import type multer from "multer";

declare global {
  namespace TsED {
    // @ts-ignore
    export type MulterFile = Express.Multer.File;
    // @ts-ignore
    export type MulterStorageEngine = multer.StorageEngine;
    // @ts-ignore
    export type MulterOptions = multer.Options;
    // @ts-ignore
    export type MulterField = multer.Field;
    // @ts-ignore
    export type Multer = multer.Multer;
  }
}

export type PlatformMulter = TsED.Multer;
export type PlatformMulterSettings = TsED.MulterOptions;
export type PlatformMulterFile = TsED.MulterFile;
export type PlatformMulterField = TsED.MulterField;
