import { isArray } from "@tsed/core";
import { deserialize } from "@tsed/json-mapper";
import { Injectable, Inject } from "@tsed/di";
import { PrismaService } from "../services/PrismaService.js";
import { Prisma, Post } from "../client/index.js";
import { PostModel } from "../models/index.js";

@Injectable()
export class PostsRepository {
  @Inject()
  protected prisma: PrismaService;

  get collection() {
    return this.prisma.post
  }

  get groupBy() {
    return this.collection.groupBy.bind(this.collection)
  }

  protected deserialize<T>(obj: null | Post | Post[]): T {
    return deserialize<T>(obj, { type: PostModel, collectionType: isArray(obj) ? Array : undefined })
  }

  async findUnique(args: Prisma.PostFindUniqueArgs): Promise<PostModel | null> {
    const obj = await this.collection.findUnique(args);
    return this.deserialize<PostModel | null>(obj);
  }

  async findFirst(args: Prisma.PostFindFirstArgs): Promise<PostModel | null> {
    const obj = await this.collection.findFirst(args);
    return this.deserialize<PostModel | null>(obj);
  }

  async findMany(args?: Prisma.PostFindManyArgs): Promise<PostModel[]> {
    const obj = await this.collection.findMany(args);
    return this.deserialize<PostModel[]>(obj);
  }

  async create(args: Prisma.PostCreateArgs): Promise<PostModel> {
    const obj = await this.collection.create(args);
    return this.deserialize<PostModel>(obj);
  }

  async update(args: Prisma.PostUpdateArgs): Promise<PostModel> {
    const obj = await this.collection.update(args);
    return this.deserialize<PostModel>(obj);
  }

  async upsert(args: Prisma.PostUpsertArgs): Promise<PostModel> {
    const obj = await this.collection.upsert(args);
    return this.deserialize<PostModel>(obj);
  }

  async delete(args: Prisma.PostDeleteArgs): Promise<PostModel> {
    const obj = await this.collection.delete(args);
    return this.deserialize<PostModel>(obj);
  }

  deleteMany(args: Prisma.PostDeleteManyArgs) {
    return this.collection.deleteMany(args)
  }

  updateMany(args: Prisma.PostUpdateManyArgs) {
    return this.collection.updateMany(args)
  }

  aggregate(args: Prisma.PostAggregateArgs) {
    return this.collection.aggregate(args)
  }
}
