"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/utils";
import { RxHamburgerMenu } from "react-icons/rx";
import useDashboardStore from "./Store";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers";
import React from 'react'

export default function Topnav() {
  const { toggleSidebar } = useDashboardStore();

  const router = useRouter();

  const headerClassName = cn("h-14 flex items-center justify-between px-3");

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    router.push("/auth/login/admin");
    router.refresh()
  };

  const user = useAuth();

  return (
    <header className={headerClassName}>
      <Button
        isIconOnly
        color="default"
        variant="light"
        onClick={toggleSidebar}
      >
        <RxHamburgerMenu size={22} className="text-gray-700" />
      </Button>

      <div className="flex items-center gap-4 mt-1 sm:mt-2">
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{ isBordered: true }}
              description={`@${user?.username}`}
              name={`${user?.firstName} ${user?.lastName}`}
              className="transition-transform"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem
              textValue="profile"
              key="profile"
              className="h-14 gap-2"
            >
              <p>Signed in as</p>
              <p>{`@${user?.username}`}</p>
            </DropdownItem>
            <DropdownItem
              className="h-10 px-4"
              textValue="settings"
              key="settings"
            >
              My Settings
            </DropdownItem>
            <DropdownItem
              onClick={logout}
              className="h-10 px-4"
              textValue="logout"
              key="logout"
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
