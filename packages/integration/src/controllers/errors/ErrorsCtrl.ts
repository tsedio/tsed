import {BodyParams, Controller, ConverterService, Get, Post, Name, Required} from "@tsed/common";
import {Description, Docs, Hidden, Responses, Summary} from "@tsed/swagger";
import {CustomBadRequest} from "../../errors/CustomBadRequest";
import {CustomInternalError} from "../../errors/CustomInternalError";

class CustomModel {
  @Required() name: string;
}

class CustomPropModel {
  @Name("role_item")
  @Required()
  roleItem: string;
}

@Controller("/errors")
@Docs("errors")
@Hidden()
export class ErrorsCtrl {
  constructor(private converterService: ConverterService) {}

  @Get("/custom-bad-request")
  @Summary("Throw a CustomBadRequestError")
  @Description(`Return a custom error with "errors" and "x-header-error" headers`)
  @Responses(400, {description: "Custom Bad Request"})
  public customBadRequest() {
    throw new CustomBadRequest("Custom Bad Request");
  }

  @Get("/error")
  @Summary("Throw a classic Error")
  @Description(`Return an Internal Server Error. The error is logged on server.`)
  @Responses(500, {description: "Internal Server Error"})
  public error() {
    throw new Error("My error");
  }

  @Get("/custom-internal-error")
  @Summary("Throw a CustomInternalError")
  @Description(`Return a custom error with "errors" and "x-header-error" headers`)
  @Responses(500, {description: "My custom error"})
  public customInternalError() {
    throw new CustomInternalError("My custom error");
  }

  @Post("/required-param")
  @Summary("Throw a Required param if the parameters isn't given")
  @Description(`Return a required error`)
  @Responses(400, {description: "Bad request"})
  public requiredParam(
    @Required()
    @BodyParams("name")
    name: string
  ) {
    return name;
  }

  @Post("/required-model")
  @Summary("Throw a Required model if the parameters isn't given")
  @Description(`Return a required error`)
  @Responses(400, {description: "Bad request"})
  public requiredModel(
    @Required()
    @BodyParams()
    model: CustomModel
  ) {
    return model;
  }

  @Post("/required-model-2")
  @Summary("Throw a Required model if the parameters isn't given")
  @Description(`Return a required error`)
  @Responses(400, {description: "Bad request"})
  public requiredModel2(@BodyParams() model: any) {
    return this.converterService.deserialize(model, CustomModel);
  }

  @Post("/required-prop-name")
  @Summary("Throw a Required prop if prop name is required")
  @Description(`Return a required error`)
  @Responses(400, {description: "Bad request"})
  public requiredPropName(
    @Required()
    @BodyParams()
    model: CustomPropModel
  ) {
    return model;
  }
}
