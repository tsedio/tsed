"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UndefinedTokenError extends Error {
    constructor() {
        super("Given token is undefined. Have you enabled emitDecoratorMetadata in your tsconfig.json or decorated your class with @Injectable, @Service, ... decorator ?");
        this.name = "UNDEFINED_TOKEN_ERROR";
    }
}
exports.UndefinedTokenError = UndefinedTokenError;
//# sourceMappingURL=UndefinedTokenError.js.map