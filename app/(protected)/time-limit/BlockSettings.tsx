"use client";
import React, { useState } from "react";
import { Setting } from "@/types/setting";
import { Accordion, AccordionItem } from "@heroui/react";
import { CategorySettings } from "@/components/TimeLimit/CategorySettings";
import { EditCategory } from "@/components/TimeLimit/EditCategory";
import { AddCategory } from "@/components/TimeLimit/AddCategory";
import { GlowingSwitch } from "@/components/TimeLimit/GlowingSwitch";

export const BlockSettings = () => {
  const [mockSettings, setMockSettings] = useState<Setting[]>([
    {
      id: "block-youtube",
      type: "block",
      enabled: true,
      name: "Block YouTube during study",
      urls: ["youtube.com"],
      appliesTo: ["study-session"],
      limit: 0,
    },
    {
      id: "block-shopping",
      type: "block",
      enabled: false,
      name: "Block Amazon & eBay",
      urls: ["amazon.com", "ebay.com"],
      appliesTo: ["focus-block"],
      limit: 0,
    },
  ]);

  return (
    <>
      <AddCategory setting={{ type: "block" }} />
      <Accordion selectionMode="multiple">
        {mockSettings.map((setting, index) => {
          const [isEnabled, setIsEnabled] = useState(setting.enabled || false);

          return (
            <AccordionItem
              key={setting.id}
              aria-label={setting.name || "Unnamed Setting"}
              title={setting.name || "Unnamed Setting"}
            >
              {/* Right-aligned controls */}
              <div className="flex justify-end items-center gap-4 mb-4">
                <EditCategory setting={setting} />
                <GlowingSwitch isOn={isEnabled} setIsOn={setIsEnabled} />
              </div>

              {/* Read-only preview */}
              <CategorySettings setting={setting} />
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
};
