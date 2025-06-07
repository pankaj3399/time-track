"use client";
import React, { useState } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { GlowingSwitch } from "@/components/TimeLimit/GlowingSwitch";
import { OpenSettings } from "./OpenSettings";
import { CloseSettings } from "./CloseSettings";
import { LimitSettings } from "./LimitSettings";
import { BlockSettings } from "./BlockSettings";
import { ExternalLink, Minimize2, ClockAlert, ShieldX } from "lucide-react";

export default function TimeLimit() {
  const [isOpenEnabled, setIsOpenEnabled] = useState(false);
  const [isCloseEnabled, setIsCloseEnabled] = useState(false);
  const [isLimitEnabled, setIsLimitEnabled] = useState(false);
  const [isBlockEnabled, setIsBlockEnabled] = useState(false);

  return (
    <Accordion variant="light">
      <AccordionItem
        startContent={<ExternalLink />}
        key="open"
        aria-label="Open Settings"
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Open Tab Automation</span>
            <GlowingSwitch isOn={isOpenEnabled} setIsOn={setIsOpenEnabled} />
          </div>
        }
        subtitle="Automatically open allowed URLs during specified tabs"
      >
        <OpenSettings />
      </AccordionItem>

      <AccordionItem
        startContent={<Minimize2 />}
        key="close"
        aria-label="Close Settings"
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Close Unused Tabs</span>
            <GlowingSwitch isOn={isCloseEnabled} setIsOn={setIsCloseEnabled} />
          </div>
        }
        subtitle="Auto-close unused tabs after a set idle time"
      >
        <CloseSettings />
      </AccordionItem>

      <AccordionItem
        startContent={<ClockAlert />}
        key="limit"
        aria-label="Limit Settings"
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Usage Time Limit</span>
            <GlowingSwitch isOn={isLimitEnabled} setIsOn={setIsLimitEnabled} />
          </div>
        }
        subtitle="Restrict time spent on specific tabs or websites"
      >
        <LimitSettings />
      </AccordionItem>

      <AccordionItem
        key="block"
        startContent={<ShieldX />}
        aria-label="Block Settings"
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Block Tabs by Task</span>
            <GlowingSwitch isOn={isBlockEnabled} setIsOn={setIsBlockEnabled} />
          </div>
        }
        subtitle="Block access to selected sites during focused tasks"
      >
        <BlockSettings />
      </AccordionItem>
    </Accordion>
  );
}
