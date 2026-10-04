import {OAuthError, OAuthErrorCode} from "@modelcontextprotocol/server";

/**
 * The authorization server or the configuration failed, whatever the presented token. Answered as `500 server_error`.
 *
 * @module platform/mcp
 */
export class PlatformServerError extends OAuthError {
  constructor(message: string) {
    super(OAuthErrorCode.ServerError, message);
  }
}
