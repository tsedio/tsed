import * as multer from "multer";

declare interface IServerSettings {
    multer?: multer.Options;
}

export * from "./decorators/multipartFile";