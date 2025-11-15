/**
 * Représente un constructeur de classe `new (...args) => T`.
 *
 * Dans Ts.ED, `Type<T>` est utilisé pour typer les références de classes
 * (contrôleurs, services, modèles, etc.) là où un constructeur est attendu.
 *
 * @typeParam T Type de l'instance créée par le constructeur.
 * @public
 */
export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

/**
 * Alias du constructeur de base de JavaScript, utilisé pour préserver
 * la compatibilité avec certains contextes d'inférence.
 *
 * @deprecated Éviter d'utiliser cette constante directement; préférer le type `Type<T>`.
 */
export const Type = Function;

/**
 * Décrit un type abstrait (classe abstraite), utile pour déclarer des dépendances
 * qui ne doivent pas être instanciées directement.
 */
export interface AbstractType<T> extends Function {
  prototype: T;
}
