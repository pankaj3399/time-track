"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import React, { useState } from "react";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function PrivateNavbar() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  return (
    <Navbar>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link
            href="/calendar"
            color={activeSection === "calendar" ? "success" : "primary"}
            onPress={() => setActiveSection("calendar")}
          >
            Calendar
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color={activeSection === "time-limit" ? "success" : "primary"}
            onPress={() => setActiveSection("time-limit")}
            href="/time-limit"
          >
            Time Limit
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color={activeSection === "habit-tracker" ? "success" : "primary"}
            onPress={() => setActiveSection("habit-tracker")}
            href="/habit-tracker"
          >
            Habit Tracker
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color={activeSection === "goals" ? "success" : "primary"}
            onPress={() => setActiveSection("goals")}
            href="/goals"
          >
            Goals
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color={activeSection === "reminders" ? "success" : "primary"}
            onPress={() => setActiveSection("reminders")}
            href="/reminders"
          >
            Reminders
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="settings">
              <Link href="/profile" className="w-full">
                My Profile
              </Link>
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
