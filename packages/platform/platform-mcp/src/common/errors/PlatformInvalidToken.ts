import {OAuthError, OAuthErrorCode} from "@modelcontextprotocol/server";

/**
 * The presented access token cannot be trusted. Answered as a `401 invalid_token` challenge.
 *
 * @module platform/mcp
 */
export class PlatformInvalidToken extends OAuthError {
  constructor(message: string) {
    super(OAuthErrorCode.InvalidToken, message);
  }
}
