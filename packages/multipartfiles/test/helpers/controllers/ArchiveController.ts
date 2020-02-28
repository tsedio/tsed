import {Controller, Post, Status} from "@tsed/common";
import {MulterOptions, MultipartFile} from "../../../src";

@Controller("/archives")
export class ArchiveController {

  @Post("/with-name")
  @Status(201)
  @MulterOptions({dest: `${__dirname}/../../.tmp`})
  uploadWithName(@MultipartFile("media") media: Express.Multer.File) {
    return media.originalname;
  }

  @Post("/without-name")
  @Status(201)
  @MulterOptions({dest: `${__dirname}/../../.tmp`})
  uploadWithoutName(@MultipartFile() media: Express.Multer.File) {
    return media.originalname;
  }
}
