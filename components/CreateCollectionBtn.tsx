"use client";

import { Button } from "./ui/button";
import { useState } from "react";
import CreateCollectionDrawer from "./CreateCollectionDrawer";

export default function CreateCollectionBtn() {
  const [open, setOpen] = useState(false);

  const handelOpenChange = (open: boolean) => setOpen(open);

  return (
    <div className="w-full rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[1px]">
      <Button
        variant="outline"
        className="dark:text-white dark:bg-neutral-950 w-full bg-white"
        onClick={() => setOpen(true)}
      >
        <span className="bg-gradient-to-r from-red-500 to-orange-500 hover:to-orange-800 bg-clip-text text-transparent">
          Create collection
        </span>
      </Button>

      <CreateCollectionDrawer open={open} onOpenChange={handelOpenChange} />
    </div>
  );
}
