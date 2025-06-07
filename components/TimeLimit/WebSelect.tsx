"use client";
import React, { useEffect, useState } from "react";
import { Textarea, Chip } from "@heroui/react";

export const WebSelect = (props: any) => {
  const [links, setLinks] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Update links whenever inputValue changes
  useEffect(() => {
    const splitLinks = inputValue.trim().split(/\s+/).filter(Boolean);
    setLinks(splitLinks);
  }, [inputValue]);

  const handleClose = (linkToRemove: string) => {
    const updatedLinks = links.filter((link) => link !== linkToRemove);
    setLinks(updatedLinks);
    setInputValue(updatedLinks.join(" "));
  };

  return (
    <>
      <Textarea
        label="Web URLs"
        labelPlacement="outside"
        placeholder="Enter one or more URLs separated by spaces"
        value={inputValue}
        variant="underlined"
        onValueChange={setInputValue}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {links.map((link, index) => (
          <Chip key={index} variant="flat" onClose={() => handleClose(link)}>
            {link}
          </Chip>
        ))}
      </div>
    </>
  );
};
