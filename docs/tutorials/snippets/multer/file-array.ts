import {Controller, MultipartFile, PlatformMulterFile, Post} from "@tsed/common";

@Controller("/")
class MyCtrl {
  @Post("/files")
  private uploadFile(@MultipartFile("files", 4) files: PlatformMulterFile[]) {
    // multiple files with 4 as limits
  }
}
