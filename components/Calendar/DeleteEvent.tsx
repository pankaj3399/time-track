"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { Trash2, OctagonAlert } from "lucide-react";
import { calendarDeleteAction } from "@/actions/calendar.actions";

export const DeleteEvent = (props: any) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [deleteType, setDeleteType] = useState<"current" | "current-and-future" | "all">("current");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await calendarDeleteAction({ 
        id: props.event.id,
        deleteType: deleteType 
      });
      
      if (!result.status) {
        throw new Error(result.data as string);
      }

      // Close both modals (delete confirmation and event details)
      onOpenChange();
      if (props.onPress) {
        props.onPress();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      // You might want to show an error toast here
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button startContent={<Trash2 />} onPress={onOpen} color="danger">
        <h2>Delete</h2>
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Deleting "{props.event?.title || "Event"}"
              </ModalHeader>
              <ModalBody>
                <RadioGroup
                  color="danger"
                  defaultValue="current"
                  label="Which events would you like to delete?"
                  value={deleteType}
                  onValueChange={(value) => setDeleteType(value as typeof deleteType)}
                >
                  <Radio value="current">Only this event</Radio>
                  <Radio value="current-and-future">
                    This and future events
                  </Radio>
                  <Radio value="all">All events</Radio>
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  startContent={<OctagonAlert />}
                  color="danger"
                  onPress={handleDelete}
                  isLoading={isDeleting}
                >
                  Confirm Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
