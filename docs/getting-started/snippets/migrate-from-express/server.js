"use strict";
var __esDecorate =
  (this && this.__esDecorate) ||
  function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) {
      if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
      return f;
    }
    var kind = contextIn.kind,
      key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? (contextIn["static"] ? ctor : ctor.prototype) : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _,
      done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) {
        if (done) throw new TypeError("Cannot add initializers after decoration has completed");
        extraInitializers.push(accept(f || null));
      };
      var result = (0, decorators[i])(kind === "accessor" ? {get: descriptor.get, set: descriptor.set} : descriptor[key], context);
      if (kind === "accessor") {
        if (result === void 0) continue;
        if (result === null || typeof result !== "object") throw new TypeError("Object expected");
        if ((_ = accept(result.get))) descriptor.get = _;
        if ((_ = accept(result.set))) descriptor.set = _;
        if ((_ = accept(result.init))) initializers.unshift(_);
      } else if ((_ = accept(result))) {
        if (kind === "field") initializers.unshift(_);
        else descriptor[key] = _;
      }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
  };
var __runInitializers =
  (this && this.__runInitializers) ||
  function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
  };
var __setFunctionName =
  (this && this.__setFunctionName) ||
  function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", {configurable: true, value: prefix ? "".concat(prefix, " ", name) : name});
  };
Object.defineProperty(exports, "__esModule", {value: true});
exports.Server = void 0;
var di_1 = require("@tsed/di");
// import compress from "compression";
// import cookieParser from "cookie-parser";
// import methodOverride from "method-override";
var Server = (function () {
  var _classDecorators = [
    (0, di_1.Configuration)({
      acceptMimes: ["application/json"]
    })
  ];
  var _classDescriptor;
  var _classExtraInitializers = [];
  var _classThis;
  var _app_decorators;
  var _app_initializers = [];
  var _app_extraInitializers = [];
  var _settings_decorators;
  var _settings_initializers = [];
  var _settings_extraInitializers = [];
  var Server = (_classThis = /** @class */ (function () {
    function Server_1() {
      this.app = __runInitializers(this, _app_initializers, void 0);
      this.settings = (__runInitializers(this, _app_extraInitializers), __runInitializers(this, _settings_initializers, void 0));
      __runInitializers(this, _settings_extraInitializers);
    }
    /**
     * This method let you configure the express middleware required by your application to works.
     * @returns {Server}
     */
    Server_1.prototype.$beforeRoutesInit = function () {
      // Add middlewares here only when all of your legacy routes are migrated to Ts.ED
      // this.app
      //   .use(cookieParser())
      //   .use(compress({}))
      //   .use(methodOverride())
    };
    return Server_1;
  })());
  __setFunctionName(_classThis, "Server");
  (function () {
    var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
    _app_decorators = [(0, di_1.Inject)()];
    _settings_decorators = [(0, di_1.Configuration)()];
    __esDecorate(
      null,
      null,
      _app_decorators,
      {
        kind: "field",
        name: "app",
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return "app" in obj;
          },
          get: function (obj) {
            return obj.app;
          },
          set: function (obj, value) {
            obj.app = value;
          }
        },
        metadata: _metadata
      },
      _app_initializers,
      _app_extraInitializers
    );
    __esDecorate(
      null,
      null,
      _settings_decorators,
      {
        kind: "field",
        name: "settings",
        static: false,
        private: false,
        access: {
          has: function (obj) {
            return "settings" in obj;
          },
          get: function (obj) {
            return obj.settings;
          },
          set: function (obj, value) {
            obj.settings = value;
          }
        },
        metadata: _metadata
      },
      _settings_initializers,
      _settings_extraInitializers
    );
    __esDecorate(
      null,
      (_classDescriptor = {value: _classThis}),
      _classDecorators,
      {kind: "class", name: _classThis.name, metadata: _metadata},
      null,
      _classExtraInitializers
    );
    Server = _classThis = _classDescriptor.value;
    if (_metadata)
      Object.defineProperty(_classThis, Symbol.metadata, {enumerable: true, configurable: true, writable: true, value: _metadata});
    __runInitializers(_classThis, _classExtraInitializers);
  })();
  return (Server = _classThis);
})();
exports.Server = Server;
