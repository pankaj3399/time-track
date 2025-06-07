"use client";
import React from "react";
import { CalendarEvent } from "@/types/calendar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
} from "@heroui/react";
import { DeleteEvent } from "./DeleteEvent";
import { UpdateEvent } from "./UpdateEvent";
import { useCheckbox, VisuallyHidden, tv } from "@heroui/react";
import { CheckIcon, Award, BellRing } from "lucide-react";
import GlowingCheckbox from "@/components/Shared/GlowingCheckbox";
import { useState } from "react";
export default function MarkDoneButton(props: any) {
  if (props.status == true) {
    return (
      <Button
        variant="shadow"
        onPress={() => props.onClick(false)}
        className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
        radius="full"
        startContent={<Award />}
      >
        Finished
      </Button>
    );
  } else {
    return (
      <Button
        color="primary"
        variant="shadow"
        startContent={<BellRing />}
        radius="full"
        onPress={() => props.onClick(true)}
      >
        <h2>Mark Done</h2>
      </Button>
    );
  }
}

export const EventModal = (props: any) => {
  //   const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isChecked, setIsChecked] = useState(
    props.event.extendedProps?.status || false
  );

  return (
    <div color={props.event?.color || "primary"}>
      <Modal
        isOpen={props.isModalOpen}
        onOpenChange={props.onClose}
        size="3xl"
        backdrop="blur"
        // color={props.event?.color || "primary"}
      >
        <ModalContent className="max-h-[90vh] overflow-y-auto">
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center justify-between gap-4">
                <h1>{props.event?.title || "Event Details"}</h1>
                {/* <MarkDoneButton onClick={setIsDone} status={isDone} />
                 */}
                <GlowingCheckbox
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                />
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{props.event?.title || "Event Details"}</h2>
                    {props.event?.extendedProps?.priority && (
                      <Chip color={props.event.extendedProps.priority === "high" ? "danger" : 
                                 props.event.extendedProps.priority === "medium" ? "warning" : "success"}>
                        {props.event.extendedProps.priority}
                      </Chip>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-600">Time</h3>
                      <p>
                        {props.event
                          ? `From ${new Date(props.event.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} to ${
                              props.event.end
                                ? new Date(props.event.end).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "end of day"
                            }`
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-600">Category</h3>
                      <p>{props.event?.extendedProps?.category || "Uncategorized"}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-600">Start Date</h3>
                      <p>
                        {props.event?.start
                          ? new Date(props.event.start).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-600">End Date</h3>
                      <p>
                        {props.event?.end
                          ? new Date(props.event.end).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "No end date set"}
                      </p>
                    </div>

                    {props.event?.extendedProps?.location && (
                      <div>
                        <h3 className="font-medium text-gray-600">Location</h3>
                        <p>{props.event.extendedProps.location}</p>
                      </div>
                    )}

                    {props.event?.extendedProps?.place && (
                      <div>
                        <h3 className="font-medium text-gray-600">Place</h3>
                        <p>{props.event.extendedProps.place}</p>
                      </div>
                    )}

                    {props.event?.rrule && (
                      <div className="col-span-2">
                        <h3 className="font-medium text-gray-600">Repetition</h3>
                        <p>
                          {(() => {
                            const options = props.event.rrule.options;
                            const interval = options.interval || 1;
                            const freq = options.freq?.toLowerCase?.() || "unknown";

                            const weekdaysMap: Record<string, string> = {
                              MO: "Monday",
                              TU: "Tuesday",
                              WE: "Wednesday",
                              TH: "Thursday",
                              FR: "Friday",
                              SA: "Saturday",
                              SU: "Sunday",
                            };

                            const byweekday = options.byweekday
                              ?.map((day: any) => {
                                if (
                                  typeof day === "object" &&
                                  typeof day.toString === "function"
                                ) {
                                  return weekdaysMap[day.toString()] || day.toString();
                                }
                                if (typeof day === "string") {
                                  return weekdaysMap[day.toUpperCase()] || day;
                                }
                                return String(day);
                              })
                              .join(", ");

                            return `Every ${interval} ${freq}(s) on ${byweekday || "unspecified days"}`;
                          })()}
                        </p>
                      </div>
                    )}

                    {props.event?.extendedProps?.description && (
                      <div className="col-span-2">
                        <h3 className="font-medium text-gray-600">Description</h3>
                        <p className="whitespace-pre-wrap">{props.event.extendedProps.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <DeleteEvent event={props.event} onPress={onClose} />
                <UpdateEvent event={props.event} onPress={onClose} />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
