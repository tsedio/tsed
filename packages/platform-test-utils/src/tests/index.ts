import {PlatformTestOptions} from "../interfaces";
import {testAcceptMime} from "./testAcceptMime";
import {testAuth} from "./testAuth";
import {testBodyParams} from "./testBodyParams";
import {testChildrenControllers} from "./testChildrenControllers";
import {testCookies} from "./testCookies";
import {testCustom404} from "./testCustom404";
import {testErrors} from "./testErrors";
import {testHandlers} from "./testHandlers";
import {testHeaderParams} from "./testHeaderParams";
import {testHeaders} from "./testHeaders";
import {testInheritanceController} from "./testInheritanceController";
import {testLocals} from "./testLocals";
import {testLocation} from "./testLocation";
import {testModule} from "./testModule";
import {testMulter} from "./testMulter";
import {testPathParams} from "./testPathParams";
import {testQueryParams} from "./testQueryParams";
import {testRedirect} from "./testRedirect";
import {testResponse} from "./testResponse";
import {testRouting} from "./testRouting";
import {testScopeRequest} from "./testScopeRequest";
import {testSession} from "./testSession";
import {testStatics} from "./testStatics";
import {testView} from "./testView";

export const specsContainer = new Map<string, (options: PlatformTestOptions) => void>();

// HANDLERS AND MIDDLEWARES
specsContainer.set("handlers", testHandlers);
specsContainer.set("auth", testAuth);

// RESPONSES
specsContainer.set("headers", testHeaders);
specsContainer.set("acceptMime", testAcceptMime);
specsContainer.set("location", testLocation);
specsContainer.set("redirect", testRedirect);
specsContainer.set("view", testView);
specsContainer.set("errors", testErrors);
specsContainer.set("response", testResponse);
specsContainer.set("custom404", testCustom404);
specsContainer.set("statics", testStatics);

// INPUTS
specsContainer.set("cookies", testCookies);
specsContainer.set("session", testSession);
specsContainer.set("headerParams", testHeaderParams);
specsContainer.set("bodyParams", testBodyParams);
specsContainer.set("pathParams", testPathParams);
specsContainer.set("queryParams", testQueryParams);
specsContainer.set("locals", testLocals);
specsContainer.set("multer", testMulter);

// ROUTING
specsContainer.set("scopeRequest", testScopeRequest);
specsContainer.set("routing", testRouting);

// CODE ORGANIZATION
specsContainer.set("childrenControllers", testChildrenControllers);
specsContainer.set("inheritanceController", testInheritanceController);
specsContainer.set("module", testModule);
