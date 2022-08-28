import {DITest, DITestOptions} from "@tsed/di";
import {mockConnections} from "../utils/mockConnections";

export class IORedisTest extends DITest {
  static async create(options?: DITestOptions) {
    const imports = mockConnections();

    await Promise.all(imports.map(({use}) => use.flushall()));

    return DITest.create({
      ...IORedisTest.options,
      ...options,
      imports: [...(options?.imports || []), ...imports]
    });
  }
}
