import {Controller, Post} from "@tsed/common";
import {MulterOptions, MultipartFile} from "@tsed/multipartfiles";

@Controller("/")
class MyCtrl {

  @Post("/file")
  private uploadFile1(@MultipartFile("file") file: Express.Multer.File) {

  }

  @Post("/file")
  @MulterOptions({dest: "/other-dir"})
  private uploadFile2(@MultipartFile("file") file: Express.Multer.File) {

  }
}
