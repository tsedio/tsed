import commonParamsOS2 from "./__mock__/common_params/os2.spec.json";
import commonParamsOS3 from "./__mock__/common_params/os3.spec.json";
import deprecatedOS2 from "./__mock__/deprecated/os2.spec.json";
import deprecatedOS3 from "./__mock__/deprecated/os3.spec.json";
import formParamOS2 from "./__mock__/form_param/os2.spec.json";
import formParamOS3 from "./__mock__/form_param/os3.spec.json";
import minimalOS2 from "./__mock__/minimal/os2.spec.json";
import minimalOS3 from "./__mock__/minimal/os3.spec.json";
import multipleRefOS2 from "./__mock__/multiple_ref/os2.spec.json";
import multipleRefOS3 from "./__mock__/multiple_ref/os3.spec.json";
import nestedOneOfOS2 from "./__mock__/nested_oneof/os2.spec.json";
import nestedOneOfOS3 from "./__mock__/nested_oneof/os3.spec.json";
import nullableOS2 from "./__mock__/nullable/os2.spec.json";
import nullableOS3 from "./__mock__/nullable/os3.spec.json";
import paramSchemaRefOS2 from "./__mock__/param_schema_ref/os2.spec.json";
import paramSchemaRefOS3 from "./__mock__/param_schema_ref/os3.spec.json";
import petstoreOS2 from "./__mock__/petstore/os2.spec.json";
import petstoreOS3 from "./__mock__/petstore/os3.spec.json";
import producesOS2 from "./__mock__/produces/os2.spec.json";
import producesOS3 from "./__mock__/produces/os3.spec.json";
import requestResponseRefOS2 from "./__mock__/request_response_ref/os2.spec.json";
import requestResponseRefOS3 from "./__mock__/request_response_ref/os3.spec.json";
import serversOS2 from "./__mock__/servers/os2.spec.json";
import serversOS3 from "./__mock__/servers/os3.spec.json";
import slashRefOS2 from "./__mock__/slash_ref/os2.spec.json";
import slashRefOS3 from "./__mock__/slash_ref/os3.spec.json";
import {transformSecurity, transformToOS2} from "./transformToOS2.js";

describe("transform", () => {
  describe("transformSecurity()", () => {
    it("should transform security definition", () => {
      const result = transformSecurity({
        httpBasic: {
          type: "http",
          scheme: "basic"
        },
        httpScheme: {
          type: "http",
          scheme: "bearer"
        },
        httpUnknown: {
          type: "http",
          scheme: "other"
        },
        oauth2_accessCode: {
          flows: {
            authorizationCode: {
              authorizationUrl: "http://petstore.swagger.wordnik.com/api/oauth/requestToken",
              scopes: {
                "read:pets": "Read your pets",
                "write:pets": "Modify pets in your account"
              },
              tokenUrl: "http://petstore.swagger.wordnik.com/api/oauth/token"
            }
          },
          type: "oauth2"
        },
        oauth2_implicit: {
          flows: {
            implicit: {
              authorizationUrl: "http://petstore.swagger.wordnik.com/api/oauth/dialog",
              scopes: {
                "read:pets": "Read your pets",
                "write:pets": "Modify pets in your account"
              }
            }
          },
          type: "oauth2"
        },
        oauth2_credential: {
          flows: {
            clientCredentials: {
              authorizationUrl: "http://petstore.swagger.wordnik.com/api/oauth/dialog",
              scopes: {
                "read:pets": "Read your pets",
                "write:pets": "Modify pets in your account"
              }
            }
          },
          type: "oauth2"
        }
      });

      expect(result).toEqual({
        httpBasic: {
          type: "basic"
        },
        httpScheme: {
          in: "header",
          name: "Authorization",
          type: "apiKey"
        },
        oauth2_accessCode: {
          authorizationUrl: "http://petstore.swagger.wordnik.com/api/oauth/requestToken",
          flow: "accessCode",
          scopes: {
            "read:pets": "Read your pets",
            "write:pets": "Modify pets in your account"
          },
          tokenUrl: "http://petstore.swagger.wordnik.com/api/oauth/token",
          type: "oauth2"
        },
        oauth2_credential: {
          authorizationUrl: "http://petstore.swagger.wordnik.com/api/oauth/dialog",
          flow: "application",
          scopes: {
            "read:pets": "Read your pets",
            "write:pets": "Modify pets in your account"
          },
          type: "oauth2"
        },
        oauth2_implicit: {
          authorizationUrl: "http://petstore.swagger.wordnik.com/api/oauth/dialog",
          flow: "implicit",
          scopes: {
            "read:pets": "Read your pets",
            "write:pets": "Modify pets in your account"
          },
          type: "oauth2"
        }
      });
    });
  });
  describe("transformToOS2()", () => {
    it("should transform OS3 spec to OS2 (scenario 1 - common_params)", () => {
      expect(transformToOS2(commonParamsOS3 as any)).toEqual(commonParamsOS2);
    });

    it("should transform OS3 spec to OS2 (scenario 2 - deprecated)", () => {
      expect(transformToOS2(deprecatedOS3 as any)).toEqual(deprecatedOS2);
    });

    it("should transform OS3 spec to OS2 (scenario 3 - minimal)", () => {
      expect(transformToOS2(formParamOS3 as any)).toEqual(formParamOS2);
    });

    it("should transform OS3 spec to OS2 (scenario 5 - minimal)", () => {
      expect(transformToOS2(minimalOS3 as any)).toEqual(minimalOS2);
    });

    it("should transform OS3 spec to OS2 (scenario 6 - multiple_ref)", () => {
      expect(transformToOS2(multipleRefOS3 as any)).toEqual(multipleRefOS2);
    });

    it("should transform OS3 spec to OS2 (scenario 7 - nested_oneof)", () => {
      expect(transformToOS2(nestedOneOfOS3 as any)).toEqual(nestedOneOfOS2);
    });

    it("should transform OS3 spec to OS2 (scenario 8 - nullable)", () => {
      expect(transformToOS2(nullableOS3 as any)).toEqual(nullableOS2);
    });

    it("should transform OS3 spec to OS2 (scenario 9 - param_schema_ref)", () => {
      expect(transformToOS2(paramSchemaRefOS3 as any)).toEqual(paramSchemaRefOS2);
    });

    it("should transform OS3 spec to OS2 (scenario 10 - petstore)", () => {
      expect(transformToOS2(petstoreOS3 as any)).toEqual(petstoreOS2);
    });

    it("should transform OS3 spec to OS2 (scenario 11 - produces)", () => {
      expect(transformToOS2(producesOS3 as any)).toEqual(producesOS2);
    });

    it("should transform OS3 spec to OS2 (scenario 12 - request_response_ref)", () => {
      expect(transformToOS2(requestResponseRefOS3 as any)).toEqual(requestResponseRefOS2);
    });

    it("should transform OS3 spec to OS2 (scenario 13 - servers)", () => {
      expect(transformToOS2(serversOS3 as any)).toEqual(serversOS2);
    });

    it("should transform OS3 spec to OS2 (scenario 14 - slash_ref)", () => {
      expect(transformToOS2(slashRefOS3 as any)).toEqual(slashRefOS2);
    });
  });
});
