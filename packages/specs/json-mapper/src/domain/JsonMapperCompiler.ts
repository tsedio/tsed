import {isCollection, nameOf, objectKeys, Type} from "@tsed/core";
import {alterIgnore} from "@tsed/schema";
import {getRandomComponentId} from "../utils/getRandomComponentId";
import {getJsonMapperTypes} from "./JsonMapperTypesContainer";

export type JsonMapperCallback<Options> = (input: any, options?: Options) => any;
export type CachedJsonMapper<Options> = {
  id: string;
  fn: JsonMapperCallback<Options>;
  source: string;
};

export abstract class JsonMapperCompiler<Options = any> {
  cache = new Map<Type<any>, CachedJsonMapper<Options>>();
  mappers: Record<string, JsonMapperCallback<Options>> = {};
  schemes: Record<string, any> = {};

  abstract alterValue(schemaId: string, value: any, options: Options): any;
  abstract createMapper(model: Type<any>, id: string): string;

  set(model: Type<any>, mapper: CachedJsonMapper<Options>) {
    this.cache.set(model, mapper);
    this.mappers[mapper.id] = mapper.fn;
  }

  get(model: Type<any>) {
    return this.cache.get(model);
  }

  has(model: Type<any>) {
    return this.cache.has(model);
  }

  addTypeMapper(model: Type<any>, fn: any) {
    this.cache.set(model, {
      id: nameOf(model),
      source: "",
      fn
    });
    this.mappers[nameOf(model)] = fn;

    return this;
  }

  eval(id: string, model: Type<any>, mapper: string) {
    const {cache} = this;
    eval(`cache.set(model, { fn: ${mapper} })`);

    const serializer = this.cache.get(model)!;
    serializer.source = mapper;
    serializer.id = id;

    this.mappers[id] = serializer.fn;

    return serializer.fn;
  }

  createContext(options: Options) {
    return {
      ...options,
      alterIgnore: (id: string, options: Options) => {
        return alterIgnore(this.schemes[id], options);
      },
      alterValue: (id: string, value: any, options: Options) => {
        return this.alterValue(id, value, options);
      },
      objectKeys,
      cache: this.cache,
      mappers: this.mappers
    };
  }

  compile(model: Type<any>): CachedJsonMapper<Options> {
    if (!this.has(model)) {
      const types = getJsonMapperTypes();

      if (types.has(model) && !isCollection(model)) {
        const mapper = types.get(model);

        if (mapper) {
          this.addTypeMapper(model, mapper.serialize.bind(mapper));
        }

        return this.get(model)!;
      }

      const id = `${nameOf(model)}:${getRandomComponentId()}`;
      this.cache.set(model, {id} as any);

      const mapper = this.createMapper(model, id);

      try {
        this.eval(id, model, mapper);
      } catch (err) {
        console.log(mapper);
        throw new Error(`Fail to compile mapper for ${nameOf(model)}. See the error above: ${err.message}.\n${mapper}`);
      }
    }

    return this.get(model)!;
  }
}
