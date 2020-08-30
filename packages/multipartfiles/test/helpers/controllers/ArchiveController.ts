import {BodyParams, Controller, Post, Status} from "@tsed/common";
import {MulterOptions, MultipartFile} from "../../../src";
import {Event} from "../models/Event";

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

  @Post("/with-payload")
  @Status(201)
  @MulterOptions({dest: `${__dirname}/../../.tmp`})
  uploadWithPayload(
    @MultipartFile("media") media: Express.Multer.File,
    @BodyParams("form_id") formId: string,
    @BodyParams("event") event: Event
  ) {
    return {
      file: media.originalname,
      formId,
      event,
    };
  }
}
