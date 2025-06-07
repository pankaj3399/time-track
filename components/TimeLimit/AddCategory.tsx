"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Form,
} from "@heroui/react";
import React from "react";
import { Plus, Check } from "lucide-react";
import TagSelect from "../Shared/TagSelect";
import { Categories } from "@/types/category";
import { TimeSelect } from "./TimeSelect";
import { WebSelect } from "./WebSelect";

export const AddCategory = (props: any) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const mockCategories: Categories = [
    { id: "1", category: "Work", color: "#1E90FF" },
    { id: "2", category: "Personal", color: "#32CD32" },
    { id: "3", category: "Fitness", color: "#FF4500" },
    { id: "4", category: "Study", color: "#FFD700" },
    { id: "5", category: "Shopping", color: "#FF69B4" },
  ];

  const [groupSelected, setGroupSelected] = React.useState<string[]>([]);
  const [submitted, setSubmitted] = React.useState<any>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    setSubmitted({
      ...formData,
      appliesTo: groupSelected,
    });
    console.log("Submitted setting:", {
      ...formData,
      appliesTo: groupSelected,
    });
    onOpenChange(); // optionally close drawer
  };

  return (
    <>
      <Button startContent={<Plus />} onPress={onOpen}>
        Add New Category
      </Button>

      <Drawer
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <DrawerContent>
          {(onClose) => (
            <Form onSubmit={onSubmit}>
              <DrawerHeader className="flex flex-col gap-1">
                Adding New Setting Category
              </DrawerHeader>
              <DrawerBody>
                <WebSelect />
                {props.setting?.type !== "open" &&
                  props.setting?.type !== "block" && <TimeSelect />}
                <TagSelect
                  categories={mockCategories}
                  groupSelected={groupSelected}
                  setGroupSelected={setGroupSelected}
                />
                <p className="mt-4 ml-1 text-default-500">
                  Selected: {groupSelected.join(", ")}
                </p>
              </DrawerBody>
              <DrawerFooter>
                <Button startContent={<Check />} color="primary" type="submit">
                  Confirm
                </Button>
              </DrawerFooter>
            </Form>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
