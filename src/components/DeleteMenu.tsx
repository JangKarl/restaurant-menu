"use client";

import React, { useState } from "react";
import { FormData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { FileX, RotateCw, X } from "lucide-react";
import { ref, remove } from "firebase/database";
import { db } from "../../firebase";
import { DialogClose } from "@radix-ui/react-dialog";
import { useToast } from "./ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type DeleteMenuFormProps = {
  menuItem: FormData;
};

const DeleteMenu = ({ menuItem }: DeleteMenuFormProps) => {
  const [deleteMenuItem, setDeleteMenuItem] = useState(menuItem);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteMenu = async (
    itemCategory: string,
    itemId: string,
    itemName: string,
  ) => {
    const menuItemRef = ref(db, `menu/${itemCategory}/${itemId}`);
    setIsDeleting(true);

    try {
      await remove(menuItemRef);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Menu deleted successfully",
        description: <p>{itemName} deleted!</p>,
      });

      setTimeout(() => {
        // Navigate back to the same page
        window.location.reload();
      }, 2000);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Error in deleting menu",
        description: `${error}`,
      });
    }
  };
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="z-55 group absolute -right-4 -top-4 rounded-full px-3 opacity-0 transition-all delay-300 group-hover:opacity-100"
              >
                <X
                  className=" text-white transition-all group-hover:cursor-pointer"
                  width={14}
                  height={14}
                  strokeWidth={3}
                />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Remove {deleteMenuItem.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Menu</DialogTitle>
          <DialogDescription>
            Deleting &quot;{deleteMenuItem.name}&quot;.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold">
            Are you sure you want to delete{" "}
            <span className="text-primary">{deleteMenuItem.name}</span>?
          </h3>

          <div className="flex w-full items-center justify-center gap-4">
            <Button
              onClick={() =>
                handleDeleteMenu(
                  deleteMenuItem.category,
                  deleteMenuItem.id ?? "",
                  deleteMenuItem.name,
                )
              }
              disabled={isDeleting}
            >
              Yes {isDeleting ? <RotateCw className="ml-4 animate-spin" /> : ""}
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">No</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMenu;
