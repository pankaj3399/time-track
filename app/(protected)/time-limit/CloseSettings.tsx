"use client";
import React, { useState } from "react";
import { Setting } from "@/types/setting";
import { Accordion, AccordionItem } from "@heroui/react";
import { CategorySettings } from "@/components/TimeLimit/CategorySettings";
import { AddCategory } from "@/components/TimeLimit/AddCategory";
import { GlowingSwitch } from "@/components/TimeLimit/GlowingSwitch";

export const CloseSettings = () => {
  const [mockSettings, setMockSettings] = useState<Setting[]>([
    {
      id: "auto-close-youtube",
      type: "close",
      enabled: true,
      name: "Auto-close YouTube if idle",
      urls: ["youtube.com"],
      appliesTo: ["study-session"],
      conditions: {
        tabIdleMinutes: 10,
      },
    },
    {
      id: "auto-close-shopping",
      type: "close",
      enabled: false,
      name: "Close Shopping Tabs",
      urls: ["amazon.com", "ebay.com"],
      appliesTo: ["focus-block"],
      limit: 0,
    },
  ]);

  const handleToggle = (id: string) => {
    setMockSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <>
      <AddCategory setting={{ type: "close" }} />
      <Accordion selectionMode="multiple">
        {mockSettings.map((setting) => (
          <AccordionItem
            key={setting.id}
            aria-label={setting.name || "Unnamed Setting"}
            title={setting.name || "Unnamed Setting"}
            subtitle={
              setting.conditions?.tabIdleMinutes
                ? `Closes if idle for ${setting.conditions.tabIdleMinutes} min`
                : setting.limit
                  ? `Closes after ${setting.limit} min`
                  : "No close rule defined"
            }
          >
            <div className="flex justify-end items-center gap-4 mb-4">
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
