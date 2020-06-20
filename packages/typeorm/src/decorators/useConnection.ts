import {UseOpts} from "@tsed/di";

/**
 * Configure the connection used by injector repository.
 *
 * ```typescript
 * import {Injectable} from "@tsed/di";
 * import {UseConnection} from "@tsed/typeorm";
 *
 * @Injectable()
 * export class MyService {
 *   constructor(UseConnection("db1") userRepositoryDb1: UserRepository,
 *               UseConnection("db2") userRepositoryDb2: UserRepository)
 *
 * }
 * ```
 *
 * @param connection The connection name of the database.
 * @decorator
 */
export function UseConnection(connection: string) {
  return UseOpts({connection});
}
