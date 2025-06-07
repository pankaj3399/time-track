"use client";
import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { CalendarDate } from "@internationalized/date";
import { Calendar, Clock, FolderPen } from "lucide-react";
import { Select, SelectItem } from "@heroui/react";
import { useState, useEffect } from "react";
import { parseDate } from "@internationalized/date";
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
import { Time } from "@internationalized/date";
import { Check, CalendarCog } from "lucide-react";
import { calendarUpdateAction } from "@/actions/calendar.actions";
import { getCategoriesAction } from "@/actions/category.actions";

type Frequency = "day" | "week" | "month" | "year";

export const UpdateEvent = (props: any) => {
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

  const [formData, setFormData] = useState({
    title: props.event?.title || "",
    start: props.event?.start || "",
    end: props.event?.end || "",
    allDay: props.event?.allDay || false,
    color: props.event?.color || "#3174ad",
    category: props.event?.extendedProps?.category || "",
    description: props.event?.extendedProps?.description || "",
    location: props.event?.extendedProps?.location || "",
    urls: props.event?.extendedProps?.urls || "",
    notifyBefore: props.event?.extendedProps?.notifyBefore || 0,
    frequency: (props.event?.rrule?.freq || "week") as Frequency,
    interval: props.event?.rrule?.interval || 1,
    byWeekday: props.event?.rrule?.byweekday || [],
    byMonthday: props.event?.rrule?.bymonthday || [],
    byMonth: props.event?.rrule?.bymonth || [],
    startRecur: props.event?.rrule?.dtstart || "",
    endRecur: props.event?.rrule?.until || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await calendarUpdateAction({
        id: props.event.id,
        ...formData
      });
      
      if (response.status) {
        onOpenChange();
        props.onPress();
      } else {
        console.error("Failed to update event:", response.data);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
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
  const options: Record<Frequency, string[] | number[]> = {
    day: [],
    week: weekdayOptions,
    month: monthdayOptions,
    year: monthOptions,
  };
  const getCalendarDate = (value?: string | Date) => {
    if (!value) return undefined;
    const date = new Date(value);
    if (isNaN(date.getTime())) return undefined;
    return parseDate(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`
    );
  };

  return (
    <>
      <Button startContent={<CalendarCog />} onPress={onOpen}>
        Edit Event
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <Form onSubmit={handleSubmit} className="w-full max-h-[90vh] overflow-y-auto">
              <ModalHeader className="flex flex-col gap-1">
                <h1>Editing "{props.event?.title || "Event"}"</h1>
              </ModalHeader>
              <ModalBody className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TimeInput
                    startContent={<Clock />}
                    value={formData.start ? new Time(
                      new Date(formData.start).getHours(),
                      new Date(formData.start).getMinutes()
                    ) : new Time(0, 0)}
                    onChange={(time: Time | null) => {
                      if (time) {
                        const date = new Date(formData.start);
                        date.setHours(time.hour);
                        date.setMinutes(time.minute);
                        setFormData(prev => ({ ...prev, start: date.toISOString() }));
                      }
                    }}
                    label="Start Time"
                  />
                  <TimeInput
                    startContent={<Clock />}
                    value={formData.end ? new Time(
                      new Date(formData.end).getHours(),
                      new Date(formData.end).getMinutes()
                    ) : new Time(11, 59)}
                    onChange={(time: Time | null) => {
                      if (time) {
                        const date = new Date(formData.end);
                        date.setHours(time.hour);
                        date.setMinutes(time.minute);
                        setFormData(prev => ({ ...prev, end: date.toISOString() }));
                      }
                    }}
                    label="End Time"
                  />
                  <DateInput
                    startContent={<Calendar />}
                    label="Start date"
                    value={getCalendarDate(formData.start)}
                    onChange={(date: CalendarDate | null) => {
                      if (date) {
                        const newDate = new Date(formData.start);
                        newDate.setFullYear(date.year);
                        newDate.setMonth(date.month - 1);
                        newDate.setDate(date.day);
                        setFormData(prev => ({ ...prev, start: newDate.toISOString() }));
                      }
                    }}
                    variant="underlined"
                  />
                  <DateInput
                    startContent={<Calendar />}
                    label="End date"
                    value={getCalendarDate(formData.end)}
                    onChange={(date: CalendarDate | null) => {
                      if (date) {
                        const newDate = new Date(formData.end);
                        newDate.setFullYear(date.year);
                        newDate.setMonth(date.month - 1);
                        newDate.setDate(date.day);
                        setFormData(prev => ({ ...prev, end: newDate.toISOString() }));
                      }
                    }}
                    variant="underlined"
                  />
                </div>

                <Select
                  className="col-span-2 max-w-md"
                  label="Category"
                  variant="underlined"
                  selectedKeys={new Set([formData.category])}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0];
                    if (typeof key === "string") {
                      const selectedCategory = categories.find(c => c.category === key);
                      if (selectedCategory) {
                        setFormData(prev => ({
                          ...prev,
                          category: selectedCategory.category,
                          color: selectedCategory.color
                        }));
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
                      value={formData.interval}
                      onChange={(value) => setFormData(prev => ({ ...prev, interval: value }))}
                      min={1} 
                    />
                    <Select
                      className="max-w-[10rem]"
                      label="Time frame"
                      variant="underlined"
                      selectedKeys={new Set([formData.frequency])}
                      onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as Frequency }))}
                    >
                      <SelectItem key="day">day(s)</SelectItem>
                      <SelectItem key="week">week(s)</SelectItem>
                      <SelectItem key="month">month(s)</SelectItem>
                      <SelectItem key="year">year(s)</SelectItem>
                    </Select>
                  </div>

                  <h2 className="text-md font-medium">During</h2>
                  {options[formData.frequency]?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {options[formData.frequency].map((o) => (
                        <Checkbox
                          key={o}
                          isSelected={formData.byWeekday.includes(String(o))}
                          onValueChange={(isChecked) => {
                            setFormData(prev => ({
                              ...prev,
                              byWeekday: isChecked
                                ? [...prev.byWeekday, String(o)]
                                : prev.byWeekday.filter((val: string) => val !== String(o))
                            }));
                          }}
                        >
                          {o}
                        </Checkbox>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>Notify before</span>
                  <NumberInput
                    className="w-20"
                    value={formData.notifyBefore}
                    onChange={(value) => setFormData(prev => ({ ...prev, notifyBefore: value }))}
                    min={0}
                  />
                  <span>minutes</span>
                </div>
                <Textarea
                  label="Description"
                  labelPlacement="outside"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  variant="underlined"
                  className="col-span-2"
                />
                <Textarea
                  label="URLs"
                  labelPlacement="outside"
                  value={formData.urls}
                  onChange={(e) => setFormData(prev => ({ ...prev, urls: e.target.value }))}
                  variant="underlined"
                  className="col-span-2"
                />
                <Input
                  label="Location"
                  type="text"
                  variant="underlined"
                  className="col-span-2"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </ModalBody>
              <ModalFooter className="flex justify-end">
                <Button
                  type="submit"
                  startContent={<Check />}
                  color={formData.color}
                >
                  <h2>Confirm Edit</h2>
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
