import React from "react";
import { Categories } from "@/types/category";
import { EditCategory } from "./EditCategory";
import { Chip } from "@heroui/react";
import { useState } from "react";

export const CategorySettings = (props: any) => {
  const [links, setLinks] = useState<string[]>([]);
  const mockCategories: Categories = [
    { id: "1", category: "Work", color: "#1E90FF" },
    { id: "2", category: "Personal", color: "#32CD32" },
    { id: "3", category: "Fitness", color: "#FF4500" },
    { id: "4", category: "Study", color: "#FFD700" },
    { id: "5", category: "Shopping", color: "#FF69B4" },
  ];

  const setting = props.setting;
  const categoryNames =
    props.setting?.appliesTo
      ?.map((id: string) => mockCategories.find((c) => c.id === id)?.category)
      .filter(Boolean)
      .join(", ") || "None";

  const websites = setting?.urls?.join(", ") || "None";
  const timeLimit =
    setting?.limit ?? setting?.conditions?.tabIdleMinutes ?? "—";
  const handleClose = (linkToRemove: string) => {
    const updatedLinks = links.filter((link) => link !== linkToRemove);
    setLinks(updatedLinks);
  };

  return (
    <div className="space-y-2">
      <div>
        <p className="font-medium text-default-600">Websites:</p>
        <p className="text-default-500">{websites}</p>
      </div>

      {setting?.type !== "open" && setting?.type !== "block" && (
        <div>
          <p className="font-medium text-default-600">Time Limit (min):</p>
          <p className="text-default-500">{timeLimit}</p>
        </div>
      )}

      <div>
        <p className="font-medium text-default-600">
          Applies To the following categories/event(s):
        </p>
        {props.setting.appliesTo.map((link: any, index: any) => (
          <Chip key={index} variant="flat" onClose={() => handleClose(link)}>
            {link}
          </Chip>
        ))}
      </div>
    </div>
  );
};
