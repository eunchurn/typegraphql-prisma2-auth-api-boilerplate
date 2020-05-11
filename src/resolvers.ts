import { Resolver, Query, FieldResolver, Ctx, Root } from "type-graphql";
import * as resolvers from "../prisma/generated/type-graphql";
import { getUserId } from "./utils";

const { User, Post } = resolvers;

// custom resolver for custom business logic using Prisma Client
@Resolver((_of) => User)
export class CustomUserResolver {
  @Query((_returns) => User, { nullable: true })
  async bestUser(@Ctx() { prisma }: Context): Promise<User | null> {
    return await prisma.user.findOne({
      where: { email: "ec.park@danbicorp.com" },
    });
  }

  @FieldResolver((_type) => Post, { nullable: true })
  async favoritePost(
    @Root() user: User,
    @Ctx() { prisma }: Context,
  ): Promise<Post | undefined> {
    const [favoritePost] = await prisma.user
      .findOne({ where: { id: user.id } })
      .posts({ first: 1 });

    return favoritePost;
  }

  @Query((_returns) => User, { nullable: true })
  async me(@Ctx() ctx: Context): Promise<User | null> {
    return await ctx.prisma.user.fundOne({
      where: { id: Number(getUserId(ctx)) },
    });
  }
}

export default resolvers;
