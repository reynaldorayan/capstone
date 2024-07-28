"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs>
      <BreadcrumbItem>
        <Link href="/">Home</Link>
      </BreadcrumbItem>
      {pathnames.map((value, index) => {
        const href = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <BreadcrumbItem key={href}>{value}</BreadcrumbItem>
        ) : (
          <BreadcrumbItem key={href}>
            <Link href={href}>{value}</Link>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
