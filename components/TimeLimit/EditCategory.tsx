"use client";
import React from "react";
import TagSelect from "../Shared/TagSelect";
import { Categories } from "@/types/category";
import { TimeSelect } from "./TimeSelect";
import { WebSelect } from "./WebSelect";
import { Button } from "@heroui/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@heroui/react";
import { Check, Pencil } from "lucide-react";

export const EditCategory = (props: any) => {
  const mockCategories: Categories = [
    { id: "1", category: "Work", color: "#1E90FF" },
    { id: "2", category: "Personal", color: "#32CD32" },
    { id: "3", category: "Fitness", color: "#FF4500" },
    { id: "4", category: "Study", color: "#FFD700" },
    { id: "5", category: "Shopping", color: "#FF69B4" },
  ];

  const [groupSelected, setGroupSelected] = React.useState<string[]>([]);
  const [urls, setUrls] = React.useState<string[]>([]);
  const [limit, setLimit] = React.useState<number | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const settingData = {
      type: props.setting?.type,
      urls,
      limit,
      appliesTo: groupSelected,
    };

    console.log("Submitted Setting:", settingData);
    props.onSubmit?.(settingData); // if parent provides a callback
  };

  return (
    <>
      <Button startContent={<Pencil />} onPress={onOpen}>
        Edit
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Edit "{props.setting?.name}" Setting
              </DrawerHeader>
              <DrawerBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <WebSelect setUrls={setUrls} />
                  {props.setting?.type !== "open" &&
                    props.setting?.type !== "block" && (
                      <TimeSelect setLimit={setLimit} />
                    )}
                  <TagSelect
                    categories={mockCategories}
                    groupSelected={groupSelected}
                    setGroupSelected={setGroupSelected}
                  />
                  <p className="text-default-500">
                    Selected: {groupSelected.join(", ")}
                  </p>
                  <Button type="submit" color="primary">
                    Save Changes
                  </Button>
                </form>
              </DrawerBody>
              <DrawerFooter>
                <Button
                  color="primary"
                  onPress={onClose}
                  startContent={<Check />}
                >
                  Confirm
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
