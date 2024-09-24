import {MultipartFile, PlatformMulterFile} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Post} from "@tsed/schema";

@Controller("/")
class MyCtrl {
  @Post("/files")
  private uploadFile(@MultipartFile("files", 4) files: PlatformMulterFile[]) {
    // multiple files with 4 as limits
  }
}
