import {Controller, Put, Status} from "@tsed/common";
import {MulterOptions, MultipartFile} from "@tsed/multipartfiles";
import {Responses} from "@tsed/swagger";

@Controller("/upload")
export class UploadController {

  constructor() {
  }

  @Put("/")
  @Status(201)
  @Responses("201", {description: "Created"})
  @MulterOptions({dest: `${process.cwd()}/.tmp`})
  async add(@MultipartFile("file") file: Express.Multer.File): Promise<any> {
    return true;
  }
}
