/**
 * @ignore
 */
export function mapReturnedResponse({use, collection, ...options}: any): any {
  return {
    ...options,
    type: options.type || use,
    collectionType: options.collectionType || collection
  };
}
