import { Inject, Injectable, Configuration, OnInit, OnDestroy } from "@tsed/di";
import { Logger } from "@tsed/logger";
import { PrismaClient } from "../client";

@Injectable()
export class PrismaService extends PrismaClient implements OnInit, OnDestroy {
  @Inject()
  protected logger: Logger;

  constructor(@Configuration() settings: Configuration) {
    super(settings.get('prisma'));
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
