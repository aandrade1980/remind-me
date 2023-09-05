import { Task } from "@prisma/client";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { markTaskDone } from "@/actions/task";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function getExpirationColor(expiresAt: Date) {
  const daysLeft = Math.floor(expiresAt.getTime() - Date.now()) / 1000 / 60 / 60;

  if (daysLeft < 0) return "text-gray-500 dark:text-gray-300";
  if (daysLeft <= 3 * 24) return "text-red-500 dark:text-red-400";
  if (daysLeft <= 7 * 24) return "text-orange-500 dark:text-orange-400";

  return "text-green-500 dark:text-green-400";
}

export default function TaskCard({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleChange = (checked: boolean) => {
    startTransition(async () => {
      try {
        await markTaskDone({ id: task.id, done: checked });

        router.refresh();
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <div className="flex gap-2 items-start">
      <Checkbox
        id={task.id.toString()}
        className="w-5 h-5"
        checked={task.done}
        onCheckedChange={handleChange}
        disabled={isPending}
      />
      <label
        htmlFor={task.id.toString()}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 decoration-1 dark:decoration-white",
          task.done && "line-through",
        )}
      >
        {task.content}
        {task.expiresAt && (
          <p
            className={cn(
              "text-xs text-neutral-500 dark:text-neutral-400",
              getExpirationColor(task.expiresAt),
            )}
          >
            {format(task.expiresAt, "dd/MM/yyyy")}
          </p>
        )}
      </label>
    </div>
  );
}
