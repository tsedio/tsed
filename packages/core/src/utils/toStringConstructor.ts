import {constructorOf} from "./constructorOf.js";

/**
 * Retourne la signature textuelle du constructeur d'une classe/instance.
 *
 * Exemple de sortie: `constructor(id: string, name?: string)`.
 * Utile pour le débogage et la génération de documentation.
 *
 * @param target Instance ou constructeur.
 * @returns La signature du constructeur sous forme de chaîne.
 * @public
 */
export function toStringConstructor(target: any): string {
  const ctr = constructorOf(target);
  const strings = ctr.toString().split("\n");
  const ctrString = strings.find((s) => s.indexOf("constructor(") > -1) || "constructor()";

  return `${ctrString.replace("{", "").trim()}`;
}
