import {Controller, Put, Status, UseBefore} from "@tsed/common";
import {MulterOptions, MultipartFile} from "@tsed/multipartfiles";
import {Responses} from "@tsed/swagger";
import {BeforeMiddleware} from "../../middlewares/BeforeMiddleware";

@Controller("/upload")
@UseBefore(BeforeMiddleware, {})
export class UploadController {
  @Put("/")
  @Status(201)
  @Responses("201", {description: "Created"})
  @MulterOptions({dest: `${process.cwd()}/.tmp`})
  async add(@MultipartFile("file") file: Express.Multer.File): Promise<any> {
    return true;
  }
}
