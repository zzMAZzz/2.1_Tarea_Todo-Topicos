import { prisma } from "../db/client";
import { User } from "../interfaces/user.interface";

export const getAll = async (): Promise<User[]> => {
  return await prisma.user.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const findById = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const findByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const create = async (user: Partial<User>): Promise<User> => {
  return await prisma.user.create({
    data: {
      name: user.name!,
      email: user.email!,
    },
  });
};

export const update = async (
  userId: number,
  payload: Partial<User>
): Promise<User | null> => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: payload,
  });
};

export const remove = async (id: number): Promise<User | null> => {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
};
