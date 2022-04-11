import {MulterOptions, MultipartFile, PlatformMulterFile} from "@tsed/common";
import {Post} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/")
class MyCtrl {
  @Post("/file")
  private uploadFile1(@MultipartFile("file") file: PlatformMulterFile) {}

  @Post("/file")
  @MulterOptions({dest: "/other-dir"})
  private uploadFile2(@MultipartFile("file") file: PlatformMulterFile) {}
}
