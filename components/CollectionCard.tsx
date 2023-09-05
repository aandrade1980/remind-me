"use client";

import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { Collection, Task } from "@prisma/client";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { CaretDownIcon, CaretUpIcon, TrashIcon } from "@radix-ui/react-icons";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import PlusIcon from "./icons/Plus";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from "./ui/use-toast";
import { deleteCollection } from "@/actions/collection";
import { useRouter } from "next/navigation";
import CreateTaskDialog from "./CreateTaskDialog";
import TaskCard from "./TaskCard";

type CollectionCardProps = {
  collection: Collection & {
    tasks: Array<Task>;
  };
};

export default function CollectionCard({ collection }: CollectionCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleDeleteCollection = async () => {
    startTransition(async () => {
      try {
        await deleteCollection(collection.id);

        toast({
          title: "Success!",
          description: "Collection deleted successfully",
        });
        router.refresh();
      } catch (e) {
        toast({
          title: "Error!",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
        console.error(e);
      }
    });
  };

  const { tasks } = collection;

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((task) => task.done).length;

  const progress = totalTasks === 0 ? 0 : (doneTasks / totalTasks) * 100;

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "flex w-full justify-between p-6",
              isOpen && "rounded-b-none",
              CollectionColors[collection.color as CollectionColor],
            )}
          >
            <span className="text-white font-bold">{collection.name}</span>
            {!isOpen ? (
              <CaretDownIcon className="ml-2 h-6 w-6" />
            ) : (
              <CaretUpIcon className="ml-2 h-6 w-6" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex rounded-md flex-col dark:bg-neutral-900 shadow-lg">
          {tasks.length === 0 ? (
            <Button
              variant="ghost"
              className="flex items-center justify-center gap-1 p-8 py-12 rounded-none"
              onClick={() => setShowCreateModal(true)}
            >
              <p>There are no tasks yet: </p>
              <span
                className={cn(
                  "text-sm bg-clip-text text-transparent",
                  CollectionColors[collection.color as CollectionColor],
                )}
              >
                Create one
              </span>
            </Button>
          ) : (
            <>
              <Progress className="rounded-none" value={progress} />
              <div className="p-4 gap-3 flex flex-col ">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </>
          )}
          <Separator />
          <footer className="h-[40px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between items-center">
            <p>Created at {collection.createdAt.toDateString()}</p>
            {isPending ? (
              <div>Deleting...</div>
            ) : (
              <div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowCreateModal(true)}
                >
                  <PlusIcon />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <TrashIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>
                      Are you sure you want to delete the Collection?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteCollection}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </footer>
        </CollapsibleContent>
      </Collapsible>
      <CreateTaskDialog
        isOpen={showCreateModal}
        setOpen={setShowCreateModal}
        collection={collection}
      />
    </>
  );
}
