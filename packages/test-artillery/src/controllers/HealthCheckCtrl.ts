import {Controller, Get} from "@tsed/common";

@Controller("/")
export class HealthCheckCtrl {
  @Get("/healthcheck")
  @Get("/")
  public healthCheck(): {version: string} {
    return {
      version: "1.0.0"
    };
  }
}
