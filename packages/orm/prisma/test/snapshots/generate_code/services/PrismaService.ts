import {Injectable, Configuration, OnInit, OnDestroy, logger} from "@tsed/di";
import {PrismaClient} from "../client/index.js";

@Injectable()
export class PrismaService extends PrismaClient implements OnInit, OnDestroy {
  protected logger = logger();

  constructor(@Configuration() settings: Configuration) {
    super(settings.get("prisma"));
  }

  async $onInit(): Promise<void> {
    this.logger.info("Connection to prisma database");
    await this.$connect();
  }

  async $onDestroy(): Promise<void> {
    this.logger.info("Disconnection from prisma database");
    await this.$disconnect();
  }
}
