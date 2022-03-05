import { Prisma } from "../client";

declare global {
  namespace TsED {
    interface Configuration {
      prisma?: Prisma.PrismaClientOptions;
    }
  }
}
