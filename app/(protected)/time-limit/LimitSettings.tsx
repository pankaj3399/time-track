"use client";
import React, { useState } from "react";
import { Setting } from "@/types/setting";
import { Accordion, AccordionItem } from "@heroui/react";
import { CategorySettings } from "@/components/TimeLimit/CategorySettings";
import { AddCategory } from "@/components/TimeLimit/AddCategory";
import { GlowingSwitch } from "@/components/TimeLimit/GlowingSwitch";

export const LimitSettings = () => {
  const [mockSettings, setMockSettings] = useState<Setting[]>([
    {
      id: "limit-youtube",
      type: "limit",
      enabled: true,
      name: "Limit YouTube to 30 min",
      urls: ["youtube.com"],
      appliesTo: ["study-session"],
      limit: 30,
    },
    {
      id: "limit-reddit",
      type: "limit",
      enabled: true,
      name: "Limit Reddit to 20 min",
      urls: ["reddit.com"],
      appliesTo: ["focus-block"],
      limit: 20,
    },
    {
      id: "limit-games",
      type: "limit",
      enabled: false,
      name: "Gaming Limit: 1 Hour",
      urls: ["steamcommunity.com", "epicgames.com"],
      appliesTo: ["evening-relax"],
      limit: 60,
    },
  ]);

  const handleToggle = (id: string) => {
    setMockSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <>
      <AddCategory setting={{ type: "limit" }} />
      <Accordion selectionMode="multiple">
        {mockSettings.map((setting) => (
          <AccordionItem
            key={setting.id}
            aria-label={setting.name || "Unnamed Setting"}
            title={setting.name || "Unnamed Setting"}
            subtitle={
              typeof setting.limit === "number"
                ? `Usage limited to ${setting.limit} minutes`
                : "No time limit defined"
            }
          >
            <div className="flex justify-end items-center gap-4 mb-4">
              <GlowingSwitch
                isOn={setting.enabled ?? false}
                setIsOn={() => handleToggle(setting.id || "")}
              />
            </div>
            <CategorySettings setting={setting} />
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
