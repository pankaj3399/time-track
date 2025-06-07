"use client";
import { NumberInput } from "@heroui/react";
import React from "react";

export const TimeSelect = (props: any) => {
  return (
    <>
      <NumberInput
        size="lg"
        labelPlacement="outside-left"
        label="Amount"
        placeholder="Enter time-limit in minutes"
        variant="underlined"
      />
    </>
  );
};
