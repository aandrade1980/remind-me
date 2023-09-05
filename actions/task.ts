'use server';

import prisma from "@/lib/prisma";
import { CreateTaskSchemaType, MarkTaskDoneSchemaType } from "@/schema/createTaks";
import { currentUser } from "@clerk/nextjs";

export async function createTask(form: CreateTaskSchemaType) {
  const user = await currentUser();

  if (!user) throw new Error('User not found!');

  const { collectionId, content, expiresAt } = form;

  await prisma.task.create({
    data: {
      content,
      expiresAt,
      userId: user.id,
      Collection: {
        connect: {
          id: collectionId
        }
      }
    }
  })
}

export async function markTaskDone(form: MarkTaskDoneSchemaType) {
  const user = await currentUser();

  if (!user) throw new Error('User not found!');

  const { done, id } = form;

  await prisma.task.update({
    where: {
      id,
      userId: user.id
    },
    data: {
      done
    }
  })
}