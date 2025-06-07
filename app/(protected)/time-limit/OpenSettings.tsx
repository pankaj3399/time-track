"use client";
import React, { useState } from "react";
import { Setting } from "@/types/setting";
import { Accordion, AccordionItem } from "@heroui/react";
import { CategorySettings } from "@/components/TimeLimit/CategorySettings";
import { AddCategory } from "@/components/TimeLimit/AddCategory";
import { EditCategory } from "@/components/TimeLimit/EditCategory";
import { GlowingSwitch } from "@/components/TimeLimit/GlowingSwitch";

export const OpenSettings = () => {
  const [mockSettings, setMockSettings] = useState<Setting[]>([
    {
      id: "auto-open-docs",
      type: "open",
      enabled: true,
      name: "Open Docs Automatically",
      urls: ["https://docs.google.com"],
      appliesTo: ["work-session"],
      limit: 30,
    },
    {
      id: "auto-open-notion",
      type: "open",
      enabled: true,
      name: "Launch Notion for Study",
      urls: ["https://notion.so"],
      appliesTo: ["study-session"],
      limit: 45,
    },
    {
      id: "auto-open-dashboard",
      type: "open",
      enabled: false,
      name: "Open Dashboard (disabled)",
      urls: ["https://dashboard.example.com"],
      appliesTo: ["daily-standup"],
      limit: 0,
    },
  ]);

  // Toggle switch logic per setting
  const handleToggle = (id: string) => {
    setMockSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <>
      <AddCategory setting={{ type: "open" }} />
      <Accordion selectionMode="multiple">
        {mockSettings.map((setting) => (
          <AccordionItem
            key={setting.id}
            aria-label={setting.name || "Unnamed Setting"}
            title={setting.name || "Unnamed Setting"}
          >
            <div className="flex justify-end items-center gap-4 mb-4">
              <EditCategory setting={setting} />
              <GlowingSwitch
                isOn={setting.enabled ?? false}
                setIsOn={() => handleToggle(setting.id!)}
              />
            </div>
            <CategorySettings setting={setting} />
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
