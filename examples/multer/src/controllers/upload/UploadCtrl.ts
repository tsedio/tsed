import {Controller, MulterOptions, MultipartFile, Put} from "@tsed/common";
import {Returns} from "@tsed/schema";

@Controller("/upload")
export class UploadController {
  @Put("/")
  @Returns(201, {description: "Created"})
  @MulterOptions({dest: `${process.cwd()}/.tmp`})
  async add(@MultipartFile("file") file: MultipartFile): Promise<any> {
    return true;
  }
}
