import {PlatformTestingSdkOpts} from "../interfaces/index.js";
import {testAcceptMime} from "./testAcceptMime.js";
import {testAuth} from "./testAuth.js";
import {testBodyParams} from "./testBodyParams.js";
import {testCache} from "./testCache.js";
import {testChildrenControllers} from "./testChildrenControllers.js";
import {testCookies} from "./testCookies.js";
import {testCustom404} from "./testCustom404.js";
import {testDeepQueryParams} from "./testDeepQueryParams.js";
import {testErrors} from "./testErrors.js";
import {testHandlers} from "./testHandlers.js";
import {testHeaderParams} from "./testHeaderParams.js";
import {testHeaders} from "./testHeaders.js";
import {testInheritanceController} from "./testInheritanceController.js";
import {testLocals} from "./testLocals.js";
import {testLocation} from "./testLocation.js";
import {testMiddlewares} from "./testMiddlewares.js";
import {testModule} from "./testModule.js";
import {testMulter} from "./testMulter.js";
import {testPathParams} from "./testPathParams.js";
import {testQueryParams} from "./testQueryParams.js";
import {testRedirect} from "./testRedirect.js";
import {testResponse} from "./testResponse.js";
import {testResponseFilter} from "./testResponseFilter.js";
import {testRouting} from "./testRouting.js";
import {testScopeRequest} from "./testScopeRequest.js";
import {testSession} from "./testSession.js";
import {testStatics} from "./testStatics.js";
import {testStream} from "./testStream.js";
import {testView} from "./testView.js";

export const specsContainer = new Map<string, (options: PlatformTestingSdkOpts) => void>();

// HANDLERS AND MIDDLEWARES
specsContainer.set("handlers", testHandlers);
specsContainer.set("auth", testAuth);
specsContainer.set("middlewares", testMiddlewares);

// RESPONSES
specsContainer.set("headers", testHeaders);
specsContainer.set("acceptMime", testAcceptMime);
specsContainer.set("location", testLocation);
specsContainer.set("redirect", testRedirect);
specsContainer.set("view", testView);
specsContainer.set("errors", testErrors);
specsContainer.set("response", testResponse);
specsContainer.set("stream", testStream);
specsContainer.set("responseFilter", testResponseFilter);
specsContainer.set("custom404", testCustom404);
specsContainer.set("statics", testStatics);
specsContainer.set("cache", testCache);

// INPUTS
specsContainer.set("cookies", testCookies);
specsContainer.set("session", testSession);
specsContainer.set("headerParams", testHeaderParams);
specsContainer.set("bodyParams", testBodyParams);
specsContainer.set("pathParams", testPathParams);
specsContainer.set("queryParams", testQueryParams);
specsContainer.set("deepQueryParams", testDeepQueryParams);
specsContainer.set("locals", testLocals);
specsContainer.set("multer", testMulter);

// ROUTING
specsContainer.set("scopeRequest", testScopeRequest);
specsContainer.set("routing", testRouting);

// CODE ORGANIZATION
specsContainer.set("childrenControllers", testChildrenControllers);
specsContainer.set("inheritanceController", testInheritanceController);
specsContainer.set("module", testModule);
