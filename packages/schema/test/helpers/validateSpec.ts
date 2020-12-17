import SwaggerParser from "@apidevtools/swagger-parser";
import {unlinkSync, writeJsonSync} from "fs-extra";
import {SpecTypes} from "../../src/domain";

export const validateSpec = async (spec: any, version = SpecTypes.SWAGGER) => {
  const file = __dirname + "/spec.json";
  spec = {
    ...spec
  };
  try {
    if (version === SpecTypes.OPENAPI) {
      spec.openapi = "3.0.1";
    } else {
      spec.swagger = "2.0";
    }

    spec.info = {
      title: "Title",
      description: "Description",
      termsOfService: "http://www.apache.org/",
      contact: {
        email: "apiteam@swagger.io"
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html"
      },
      version: "1.0.0"
    };

    writeJsonSync(file, spec, {encoding: "utf8"});
    await SwaggerParser.validate(file);
    unlinkSync(file);

    return true;
  } catch (er) {
    console.error(er);
    // unlinkSync(file);

    return er;
  }
};
