import {BodyParams, Controller, ConverterService, Get, Post} from "@tsed/common";
import {Description, Name, Required, Returns, Summary} from "@tsed/schema";
import {Docs, Hidden, Responses} from "@tsed/swagger";
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
  @Get("/custom-bad-request")
  @Summary("Throw a CustomBadRequestError")
  @Description(`Return a custom error with "errors" and "x-header-error" headers`)
  @Returns(500).Description("Custom Bad Request")
  public customBadRequest() {
    throw new CustomBadRequest("Custom Bad Request");
  }

  @Get("/error")
  @Summary("Throw a classic Error")
  @Description(`Return an Internal Server Error. The error is logged on server.`)
  @Returns(500).Description("Internal Server Error")
  public error() {
    throw new Error("My error");
  }

  @Get("/custom-internal-error")
  @Summary("Throw a CustomInternalError")
  @Description(`Return a custom error with "errors" and "x-header-error" headers`)
  @Returns(400).Description("Bad request")
  public customInternalError() {
    throw new CustomInternalError("My custom error");
  }

  @Post("/required-param")
  @Summary("Throw a Required param if the parameters isn't given")
  @Description(`Return a required error`)
  @Returns(400).Description("Bad request")
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
  @Returns(400).Description("Bad request")
  public requiredModel(
    @Required()
    @BodyParams()
      model: CustomModel
  ) {
    return model;
  }

  @Post("/required-prop-name")
  @Summary("Throw a Required prop if prop name is required")
  @Description(`Return a required error`)
  @Returns(400).Description("Bad request")
  public requiredPropName(
    @Required()
    @BodyParams()
      model: CustomPropModel
  ) {
    return model;
  }
}
