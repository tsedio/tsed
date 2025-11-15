import {classOf} from "./classOf.js";
import {isClass} from "./isClass.js";

/**
 * Retourne le constructeur de classe lorsque `target` est une classe/instance,
 * sinon retourne la valeur telle quelle (utile pour les `symbol`).
 *
 * @param target Valeur potentiellement typée classe, instance, ou symbole.
 * @returns Le constructeur de la classe ou la valeur originale si ce n'est pas une classe.
 * @public
 */
export function getClassOrSymbol(target: any): any {
  return isClass(target) ? classOf(target) : target;
}
