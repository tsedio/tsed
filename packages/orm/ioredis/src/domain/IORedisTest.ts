import {DITest} from "@tsed/di";

import {mockConnections} from "../utils/mockConnections.js";

export class IORedisTest extends DITest {
  static async create(options?: Partial<TsED.Configuration>) {
    const imports = await mockConnections();

    await Promise.all(imports.map(({use}) => use.flushall()));

    return DITest.create({
      ...options,
      imports: [...(options?.imports || []), ...imports]
    });
  }
}
