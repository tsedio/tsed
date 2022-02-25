import {FormioCtxMapper} from "../domain/FormioCtxMapper";

export class FormioMapper {
  constructor(readonly ctxData: FormioCtxMapper) {}

  find(key: string) {
    const store = Object.values(this.ctxData).find((store) => store.get(key));

    return store?.get(key);
  }

  findId(data: string) {
    const key = String(data).startsWith("$machineName:") ? String(data) : `$machineName:${String(data)}`;
    const item = this.find(key);

    return item ? item._id : undefined;
  }

  findMachineName(data: any) {
    const key = String(data);
    const item: any = this.find(key);

    return item ? `$machineName:${item.name || item.machineName}` : undefined;
  }

  mapToExport(data: any) {
    return this.mapData(data, this.findMachineName.bind(this));
  }

  mapToImport(data: any) {
    return this.mapData(data, this.findId.bind(this));
  }

  mapData(data: any, resolver: any): any {
    if (!data) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => {
        return this.mapData(item, resolver);
      });
    }

    const key = resolver(data, this.ctxData);

    if (key) {
      return key;
    }

    if (typeof data === "object" && !("_bsontype" in data) && !(data instanceof Date)) {
      const isForm = data.path && data.type;
      const mapped = Object.entries(data).reduce((obj, [key, value]) => {
        return {
          ...obj,
          [key]: this.mapData(value, resolver)
        };
      }, {});

      return isForm
        ? {
            ...mapped,
            name: data.name,
            machineName: data.machineName || data.name
          }
        : mapped;
    }

    return data;
  }
}
