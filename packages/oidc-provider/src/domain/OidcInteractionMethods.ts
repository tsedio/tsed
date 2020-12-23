export interface OidcInteractionMethods {
  $prompts?(...args: unknown[]): void | unknown | Promise<unknown>;
}
