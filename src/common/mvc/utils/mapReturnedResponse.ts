export function mapReturnedResponse(options: any): any {
  return {
    description: options.description,
    type: options.type || options.use,
    collectionType: options.collectionType || options.collection,
    headers: options.headers
  };
}
