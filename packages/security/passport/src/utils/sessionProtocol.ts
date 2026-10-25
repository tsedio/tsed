/**
 * Session key used by Passport.js to store the login state (`req.session.passport.user`).
 * @ignore
 */
const PASSPORT_SESSION_KEY = "passport";

/**
 * Return the name of the protocol that established the current login session.
 * @ignore
 */
export function getSessionProtocol(req: any): string | undefined {
  return req.session?.[PASSPORT_SESSION_KEY]?.protocol;
}

/**
 * Record the protocol that established the current login session, next to the user stored by Passport.js.
 * The record is dropped with the login state on `req.logout()`.
 * @ignore
 */
export function setSessionProtocol(req: any, protocol: string) {
  const state = req.session?.[PASSPORT_SESSION_KEY];

  if (state && state.user !== undefined) {
    state.protocol = protocol;
  }
}
