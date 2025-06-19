import { PrismaClient } from '@prisma/client';

type Context = {
  prisma: PrismaClient;
  user?: any;
};

const Query = {
  me: async (_parent: any, _args: any, context: Context) => {
    if (!context.user) return null;
    return context.prisma.user.findUnique({
      where: { id: context.user.id },
    });
  },
  users: async (_parent: any, _args: any, context: Context) => {
    return context.prisma.user.findMany();
  },
};

const Mutation = {
  // Signup/login/Google Auth handled in auth resolvers (to be implemented)
};

const User = {
  prompts: async (parent: any, _args: any, context: Context) => {
    return context.prisma.prompt.findMany({ where: { authorId: parent.id } });
  },
  feedbacks: async (parent: any, _args: any, context: Context) => {
    return context.prisma.feedback.findMany({ where: { userId: parent.id } });
  },
};

export default {
  Query,
  Mutation,
  User,
};