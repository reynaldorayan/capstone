import React, { PropsWithChildren } from "react";
import Content from "./Content";

type Props = PropsWithChildren & {};

export default function DashboardLayout({ children }: Props) {
  return <Content>{children}</Content>;
}
