import React from "react";
import AddNewButton from "@/modules/dashboard/component/add-new";
import AddRepo from "@/modules/dashboard/component/add-repo";
import { getAllPlaygroundForUser } from "@/modules/dashboard/action";
import EmptyState from "@/modules/dashboard/component/empty-state";
import ProjectTable from "@/modules/dashboard/component/project-table";

const Page = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-auto mx-auto">
        <AddNewButton />
        <AddRepo />
      </div>
      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState />
        ) : (
          <ProjectTable
            projects={playgrounds || []}
            onDeleteproject={() => {}}
            onUpateproject={() => {}}
            onDuplicateproject={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
