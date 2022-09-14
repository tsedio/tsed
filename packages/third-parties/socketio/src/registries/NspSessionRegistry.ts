/**
 *
 * @type {Map<any, any>}
 */
const SESSIONS: Map<string | RegExp, Map<string, any>> = new Map();

export function getNspSession(namespace: string | RegExp = "/") {
  if (!SESSIONS.has(namespace)) {
    SESSIONS.set(namespace, new Map());
  }

  return SESSIONS.get(namespace);
}
