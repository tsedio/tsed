import {Controller, MulterOptions, MultipartFile, PlatformMulterFile, Post} from "@tsed/common";

@Controller("/")
class MyCtrl {

  @Post("/file")
  private uploadFile1(@MultipartFile("file") file: PlatformMulterFile) {

  }

  @Post("/file")
  @MulterOptions({dest: "/other-dir"})
  private uploadFile2(@MultipartFile("file") file: PlatformMulterFile) {

  }
}
