"use client";

import { cn } from "@/utils";
import Image from "next/image";
import logo from "@/assets/logo.png";
import useDashboardStore from "./Store";
import Link from "next/link";
import links, { LinkProps } from "./Links";
import { Accordion, AccordionItem } from "@nextui-org/react";

export default function Sidebar() {
  const { isOpenSidebar } = useDashboardStore();

  const asideClassName = cn(
    "fixed h-screen bg-gray-50 w-72 shadow transition-all duration-300 ease-in-out",
    {
      "translate-x-0": isOpenSidebar,
      "-translate-x-72": !isOpenSidebar,
    }
  );

  return (
    <aside className={asideClassName}>
      <div className="flex items-center justify-center h-36">
        <Image
          alt="Happy homes"
          src={logo.src}
          width={100}
          height={100}
          unoptimized
          priority
        />
      </div>

      <div className="px-4 w-full flex flex-col gap-2">
        <Navigation />
      </div>
    </aside>
  );
}

const Navigation = () => {
  return (
    <ul>
      {links.map((link, idx) => {
        if (!link.links && !link.href)
          return <SidebarTitle key={idx} label={link.label} icon={link.icon} />;

        if (link.links && !link.href)
          return (
            <SidebarLinkWithSubMenu
              key={idx}
              icon={link.icon}
              label={link.label}
              links={link.links}
            />
          );

        return (
          <SidebarLink
            key={idx}
            href={link.href}
            label={link.label}
            icon={link.icon}
          />
        );
      })}
    </ul>
  );
};

export function SidebarTitle({ label, icon }: LinkProps) {
  return (
    <div className="text-gray-900 w-full text-[.95rem] rounded-md h-8 flex items-center gap-1 px-1">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export function SidebarLink({ href, label, icon }: LinkProps) {
  return (
    <Link
      href={href || "/dashboard"}
      className="hover:bg-gray-100 text-gray-900 w-full text-[.95rem] rounded-md h-11 flex items-center gap-1 px-3"
    >
      <i>{icon}</i>
      <span>{label}</span>
    </Link>
  );
}

export function SidebarLinkWithSubMenu({ label, icon, links }: LinkProps) {
  const itemClasses = {
    base: "p-0 w-full",
    title: "font-normal text-[.95rem]",
    trigger:
      "px-3 py-0 data-[hover=true]:bg-default-100 rounded-lg h-11 flex items-center",
    indicator: "text-medium",
    content: "text-small px-0 flex flex-col gap-2",
  };

  return (
    <Accordion
      key={"accordion"}
      className="flex flex-col gap-1 w-full"
      variant="light"
      itemClasses={itemClasses}
    >
      <AccordionItem
        data-key={"accordion-item"}
        aria-label={"accordion-item"}
        title={label}
        startContent={icon}
      >
        {links?.map((child, idx) => {
          if (!child.links && !child.href)
            return (
              <SidebarTitle key={idx} label={child.label} icon={child.icon} />
            );

          if (child.links && !child.href) {
            return (
              <SidebarLinkWithSubMenu
                key={idx}
                icon={child.icon}
                label={child.label}
                links={child.links}
              />
            );
          }

          return (
            <SidebarLink
              key={idx}
              href={child.href}
              label={child.label}
              icon={child.icon}
            />
          );
        })}
      </AccordionItem>
    </Accordion>
  );
}
