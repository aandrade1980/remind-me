import { z } from "zod";

export const createTaskSchema = z.object({
  collectionId: z.number().nonnegative(),
  content: z.string().min(8, {
    message: "Task content must be at least 8 characters"
  }),
  expiresAt: z.date().optional(),
});

export const markTaskDoneSchema = z.object({
  id: z.number().nonnegative(),
  done: z.boolean()
})

export type CreateTaskSchemaType = z.infer<typeof createTaskSchema>;

export type MarkTaskDoneSchemaType = z.infer<typeof markTaskDoneSchema>;
