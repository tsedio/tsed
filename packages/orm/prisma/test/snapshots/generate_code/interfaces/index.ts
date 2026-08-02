import { Prisma } from "../client/index.js";

declare global {
  namespace TsED {
    interface Configuration {
      prisma?: Prisma.PrismaClientOptions;
    }
  }
}
