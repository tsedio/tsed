/**
 *
 * @type {Map<any, any>}
 */
const SESSIONS: Map<string, Map<string, any>> = new Map();

export function getNspSession(namespace: string = "/") {
  if (!SESSIONS.has(namespace)) {
    SESSIONS.set(namespace, new Map());
  }

  return SESSIONS.get(namespace);
}
