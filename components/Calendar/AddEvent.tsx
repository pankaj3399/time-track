"use client";
import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { CalendarDate, Time } from "@internationalized/date";
import { Calendar, Clock, FolderPen } from "lucide-react";
import { Select, SelectItem } from "@heroui/react";
import { useState, useEffect } from "react";
// import { Button } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Form,
  Input,
  DateInput,
  NumberInput,
  Checkbox,
} from "@heroui/react";
import { TimeInput } from "@heroui/react";
import { Check, CalendarPlus } from "lucide-react";
import { calendarCreateAction } from "@/actions/calendar.actions";
import { getCategoriesAction } from "@/actions/category.actions";

export const AddEvent = (props: any) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [categories, setCategories] = useState<Array<{ id: string; category: string; color: string }>>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategoriesAction();
      if (result.status && Array.isArray(result.data)) {
        setCategories(result.data);
      }
    };
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState<{
    title: string;
    start: Time | string;
    end: Time | string;
    allDay: boolean;
    color: string;
    category: string;
    description: string;
    location: string;
    urls: string;
    notifyBefore: number;
    frequency: string;
    interval: number;
    byWeekday: string[];
    byMonthday: number[];
    byMonth: string[];
    startRecur: CalendarDate | string;
    endRecur: CalendarDate | string;
  }>({
    title: "",
    start: "",
    end: "",
    allDay: false,
    color: "",
    category: "",
    description: "",
    location: "",
    urls: "",
    notifyBefore: 0,
    frequency: "week",
    interval: 1,
    byWeekday: [],
    byMonthday: [],
    byMonth: [],
    startRecur: "",
    endRecur: "",
  });

  const handleSubmit = async () => {
    try {
      // Get the selected date from startRecur
      const selectedDate =
        formData.startRecur instanceof CalendarDate
          ? new Date(
              formData.startRecur.year,
              formData.startRecur.month - 1,
              formData.startRecur.day
            )
          : new Date(formData.startRecur);

      // Convert Time objects to dates using local time
      const startTime =
        formData.start instanceof Time
          ? new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              formData.start.hour,
              formData.start.minute
            ).toISOString()
          : formData.start;

      const endTime =
        formData.end instanceof Time
          ? new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              formData.end.hour,
              formData.end.minute
            ).toISOString()
          : formData.end;

      const startRecurDate =
        formData.startRecur instanceof CalendarDate
          ? new Date(
              formData.startRecur.year,
              formData.startRecur.month - 1,
              formData.startRecur.day
            ).toISOString()
          : formData.startRecur;

      const endRecurDate =
        formData.endRecur instanceof CalendarDate
          ? new Date(
              formData.endRecur.year,
              formData.endRecur.month - 1,
              formData.endRecur.day
            ).toISOString()
          : formData.endRecur;

      const dataToSend = {
        ...formData,
        start: startTime,
        end: endTime,
        startRecur: startRecurDate,
        endRecur: endRecurDate,
      };

      const result = await calendarCreateAction(dataToSend);

      if (!result.status) {
        throw new Error(result.data as string);
      }

      if (props.onEventCreated) {
        props.onEventCreated(result.data);
      }
      onOpenChange();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const weekdayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const monthdayOptions = Array.from({ length: 31 }, (_, i) => i + 1);
  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const options = {
    day: [],
    week: weekdayOptions,
    month: monthdayOptions,
    year: monthOptions,
  } as const;

  return (
    <>
      <Button startContent={<CalendarPlus />} onPress={onOpen}>
        Add Event
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        backdrop="blur"
        hideCloseButton={false}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <Form className="w-full max-h-[90vh] overflow-y-auto">
              <ModalHeader className="flex flex-col gap-1">
                <h1>Adding New Event</h1>
              </ModalHeader>
              <ModalBody className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <Input
                  label="Name"
                  type="text"
                  variant="underlined"
                  className="col-span-2"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />

                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TimeInput
                    startContent={<Clock />}
                    label="Start Time "
                    placeholderValue={new Time(0, 0)}
                    onChange={(value) => {
                      if (value instanceof Time) {
                        handleInputChange("start", value);
                      }
                    }}
                  />
                  <TimeInput
                    startContent={<Clock />}
                    label="End Time "
                    placeholderValue={new Time(11, 59)}
                    onChange={(value) => {
                      if (value instanceof Time) {
                        handleInputChange("end", value);
                      }
                    }}
                  />
                  <DateInput
                    startContent={<Calendar />}
                    label="Start date "
                    placeholderValue={new CalendarDate(2000, 11, 6)}
                    variant="underlined"
                    onChange={(date: CalendarDate | null) =>
                      date && handleInputChange("startRecur", date)
                    }
                  />
                  <DateInput
                    startContent={<Calendar />}
                    label="End date "
                    placeholderValue={new CalendarDate(2100, 11, 6)}
                    variant="underlined"
                    onChange={(date: CalendarDate | null) =>
                      date && handleInputChange("endRecur", date)
                    }
                  />
                </div>

                <Select
                  className="col-span-2 max-w-md"
                  label="Select a category"
                  variant="underlined"
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0];
                    if (typeof key === "string") {
                      const selectedCategory = categories.find(c => c.id === key);
                      if (selectedCategory) {
                        handleInputChange("category", selectedCategory.category);
                        handleInputChange("color", selectedCategory.color);
                      }
                    }
                  }}
                >
                  {categories.map((c) => (
                    <SelectItem key={c.id}>{c.category}</SelectItem>
                  ))}
                </Select>

                <div className="col-span-2 flex flex-col gap-4">
                  <h2 className="text-lg font-semibold">Repetition</h2>

                  <div className="flex items-end gap-3">
                    <span>Repeat every</span>
                    <NumberInput
                      className="w-20"
                      defaultValue={1}
                      min={1}
                      onChange={(value) => handleInputChange("interval", value)}
                    />
                    <Select
                      className="max-w-[10rem]"
                      label="Time frame"
                      variant="underlined"
                      selectedKeys={new Set([formData.frequency])}
                      onSelectionChange={(keys) => {
                        const key = Array.from(keys)[0];
                        if (
                          typeof key === "string" &&
                          ["day", "week", "month", "year"].includes(key)
                        ) {
                          handleInputChange("frequency", key);
                        }
                      }}
                    >
                      <SelectItem key="day">day(s)</SelectItem>
                      <SelectItem key="week">week(s)</SelectItem>
                      <SelectItem key="month">month(s)</SelectItem>
                      <SelectItem key="year">year(s)</SelectItem>
                    </Select>
                  </div>

                  <h2 className="text-md font-medium">During</h2>
                  {options[formData.frequency as keyof typeof options]?.length >
                    0 && (
                    <div className="flex flex-wrap gap-2">
                      {options[formData.frequency as keyof typeof options].map(
                        (o) => (
                          <Checkbox
                            key={o}
                            value={String(o)}
                            onChange={(isChecked) => {
                              const field =
                                formData.frequency === "week"
                                  ? "byWeekday"
                                  : formData.frequency === "month"
                                    ? "byMonthday"
                                    : "byMonth";
                              const currentValues = formData[field] as any[];
                              handleInputChange(
                                field,
                                isChecked
                                  ? [...currentValues, o]
                                  : currentValues.filter((v) => v !== o)
                              );
                            }}
                          >
                            {o}
                          </Checkbox>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span>Notify before</span>
                  <NumberInput
                    className="w-20"
                    defaultValue={0}
                    min={0}
                    onChange={(value) =>
                      handleInputChange("notifyBefore", value)
                    }
                  />
                  <span>minutes</span>
                </div>

                <Textarea
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Enter your description"
                  variant="underlined"
                  className="col-span-2"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />

                <Textarea
                  label="URLs"
                  labelPlacement="outside"
                  placeholder="Enter your urls separated by new line"
                  variant="underlined"
                  className="col-span-2"
                  value={formData.urls}
                  onChange={(e) => handleInputChange("urls", e.target.value)}
                />

                <Input
                  label="Location"
                  type="text"
                  variant="underlined"
                  className="col-span-2"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
              </ModalBody>
              <ModalFooter className="flex justify-end">
                <Button
                  onPress={handleSubmit}
                  startContent={<Check />}
                  color={props.event?.color || "primary"}
                >
                  <h2>Confirm</h2>
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
