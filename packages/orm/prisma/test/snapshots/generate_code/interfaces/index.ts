import {Prisma} from "../client.js";

declare global {
  namespace TsED {
    interface Configuration {
      prisma?: Prisma.PrismaClientOptions;
    }
  }
}
