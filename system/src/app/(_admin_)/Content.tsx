"use client";

import { PropsWithChildren } from "react";
import { cn } from "@/utils";
import Sidebar from "./Sidebar";
import Topnav from "./Topnav";
import Breadcrumb from "./Breadcrumbs";
import useDashboardStore from "./Store";

type Props = PropsWithChildren & {};

export default function Content({ children }: Props) {
  const { isOpenSidebar } = useDashboardStore();

  const sectionClassName = cn("ps-0 transition-all duration-300 ease-in-out", {
    "ps-72": isOpenSidebar,
  });

  return (
    <>
      <Sidebar />
      <section className={sectionClassName}>
        <Topnav />
        <article className="px-6 py-4">
          <div className="flex pb-2">
            <Breadcrumb />
          </div>
          {children}
        </article>
      </section>
    </>
  );
}
