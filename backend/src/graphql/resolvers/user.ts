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
  updateUserProfile: async (
    _parent: any,
    args: { name?: string; email?: string; avatarUrl?: string },
    context: Context
  ) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }

    const { name, email, avatarUrl } = args;

    const updatedUser = await context.prisma.user.update({
      where: { id: context.user.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(avatarUrl && { avatarUrl }),
      },
    });

    return updatedUser;
  },
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