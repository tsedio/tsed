import {Prisma} from "../client/index";

declare global {
  namespace TsED {
    interface Configuration {
      prisma?: Prisma.PrismaClientOptions;
    }
  }
}
