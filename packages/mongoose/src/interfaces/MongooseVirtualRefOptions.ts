export interface MongooseVirtualRefOptions {
  type: string;
  foreignField: string;
  localField?: string;
  justOne?: boolean;
  options?: object;
}
