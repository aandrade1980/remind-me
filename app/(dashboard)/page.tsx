import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { currentUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import CreateCollectionBtn from "@/components/CreateCollectionBtn";
import prisma from "@/lib/prisma";
import SadFaceIcon from "@/components/icons/SadFace";
import CollectionCard from "@/components/CollectionCard";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <WelcomeMsg />
      </Suspense>
      <Suspense fallback={<div>Loading collections...</div>}>
        <CollectionList />
      </Suspense>
    </>
  );
}

async function WelcomeMsg() {
  const user = await currentUser();

  if (!user) return <div>Error, user is null!</div>;

  return (
    <div className="flex w-full mb-10">
      <h1 className="text-4xl font-bold">
        Welcome, <br />
        {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}

function WelcomeMsgFallback() {
  return (
    <div className="flex w-full mb-10">
      <h1 className="text-4xl font-bold">
        <Skeleton className="w-[150px] h-[36px] mb-2" />
        <Skeleton className="w-[175px] h-[36px]" />
      </h1>
    </div>
  );
}

async function CollectionList() {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      tasks: true,
    },
  });

  if (collections.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <Alert>
          <SadFaceIcon />
          <AlertTitle>There are no collections yet!</AlertTitle>
          <AlertDescription>Create a collection to get started.</AlertDescription>
        </Alert>
        <CreateCollectionBtn />
      </div>
    );
  }

  return (
    <>
      <CreateCollectionBtn />
      <div className="flex flex-col gap-4 mt-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  );
}
