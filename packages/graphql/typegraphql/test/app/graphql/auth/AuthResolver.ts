import {PassportContext} from "graphql-passport";
import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {User} from "./User";

export interface GQLContext extends PassportContext<User, {email: string; password: string}> {}

@Resolver((of) => User)
export class AuthResolver {
  @Query((returns) => User, {nullable: true})
  currentUser(@Ctx() context: GQLContext) {
    return context.getUser();
  }

  @Mutation((returns) => User)
  async login(@Arg("email") email: string, @Arg("password") password: string, @Ctx() context: GQLContext): Promise<User> {
    const {user} = await context.authenticate("graphql-local", {
      email,
      password
    });

    // only required if express-session is used
    await context.login(user);

    return user;
  }
}
