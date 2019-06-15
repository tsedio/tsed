export class UndefinedTokenError extends Error {
  name = "UNDEFINED_TOKEN_ERROR";

  constructor() {
    super(
      "Given token is undefined. Have you enabled emitDecoratorMetadata in your tsconfig.json or decorated your class with @Injectable, @Service, ... decorator ?"
    );
  }
}
