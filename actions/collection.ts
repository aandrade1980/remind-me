'use server';

import prisma from "@/lib/prisma";
import { CreateCollectionSchemaType } from "@/schema/createCollection";
import { currentUser } from "@clerk/nextjs";

export async function createCollection(form: CreateCollectionSchemaType) {
  const user = await currentUser();

  if (!user) throw new Error('User not found!');

  return await prisma.collection.create({
    data: {
      userId: user.id,
      ...form,

    }
  })
}

export async function deleteCollection(id: number) {
  const user = await currentUser();

  if (!user) throw new Error('User not found!');

  return await prisma.collection.delete({
    where: {
      id,
      userId: user.id,
    }
  })
}