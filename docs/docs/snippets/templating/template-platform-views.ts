import {Inject, Injectable} from "@tsed/di";
import {PlatformViews} from "@tsed/platform-views";

@Injectable()
export class MyService {
  @Inject()
  platformViews: PlatformViews;

  public async renderTemplate(data: any) {
    const result = await this.platformViews.render("view.ejs", {
      // some other options
      // ...
      ...data
    });

    console.log(result);

    return result;
  }
}
