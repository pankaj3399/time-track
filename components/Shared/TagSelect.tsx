"use client";
import React from "react";
import {
  useCheckbox,
  CheckboxGroup,
  Chip,
  VisuallyHidden,
  tv,
} from "@heroui/react";
import { Categories } from "@/types/category";

export const CustomCheckbox = (props: any) => {
  const checkbox = tv({
    slots: {
      base: "border-default hover:bg-default-200",
      content: "text-default-500",
    },
    variants: {
      isSelected: {
        true: {
          base: "border-primary bg-primary hover:bg-primary-500 hover:border-primary-500",
          content: "text-primary-foreground pl-1",
        },
      },
      isFocusVisible: {
        true: {
          base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
        },
      },
    },
  });

  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    ...props,
  });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <>
      <label {...getBaseProps()} {...getLabelProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <Chip
          classNames={{
            base: styles.base(),
            content: styles.content(),
          }}
          color="primary"
          startContent={isSelected ? <CheckIcon className="ml-1" /> : null}
          variant="faded"
        >
          {children ?? (isSelected ? "Enabled" : "Disabled")}
        </Chip>
      </label>
    </>
  );
};

export const CheckIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};

export default function TagSelect({
  categories,
  groupSelected,
  setGroupSelected,
}: {
  categories: Categories;
  groupSelected: string[];
  setGroupSelected: (selected: string[]) => void;
}) {
  //   const [groupSelected, setGroupSelected] = React.useState<string[]>([]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <CheckboxGroup
        className="gap-1"
        label="Select one or more categories to filter your calendar events"
        orientation="horizontal"
        value={groupSelected}
        onChange={setGroupSelected}
      >
        {categories.map((c) => (
          <CustomCheckbox key={c.id} value={c.category}>
            {c.category}
          </CustomCheckbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}
