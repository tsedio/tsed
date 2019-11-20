import {Controller, Post} from "@tsed/common";
import {MultipartFile} from "@tsed/multipartfiles";

@Controller("/")
class MyCtrl {
  @Post("/files")
  private uploadFile(@MultipartFile("files", 4) files: Express.Multer.File[]) {
    // multiple files with 4 as limits
  }
}
