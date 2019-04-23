/**
 * @module common/mvc
 * @preferred
 */
/** */
import "./interfaces/Express";
import "./utils/extendsRequest";

export * from "./interfaces";

// provide
export * from "./class/ControllerBuilder";
export * from "./class/HandlerBuilder";
export * from "./class/ControllerProvider";
export * from "./class/EndpointMetadata";
export * from "./class/HandlerMetadata";
export * from "./class/Context";
export * from "./class/RequestLogger";

// registries
export * from "./registries/ControllerRegistry";
export * from "./registries/EndpointRegistry";
export * from "./registries/MiddlewareRegistry";

// middlewares
export * from "./components/AuthenticatedMiddleware";
export * from "./components/AcceptMimesMiddleware";
export * from "./components/ResponseViewMiddleware";
export * from "./components/SendResponseMiddleware";

// services
export * from "./services/ControllerService";
export * from "./services/ExpressRouter";
export * from "./services/RouteService";

// errors
export * from "./errors/CyclicReferenceError";
export * from "./errors/TemplateRenderingError";
export * from "./errors/UnknowControllerError";
export * from "./errors/UnknowMiddlewareError";

// decorators
export * from "./decorators";

export * from "./utils/mapHeaders";
export * from "./utils/mapReturnedResponse";
