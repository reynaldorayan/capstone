import { ReactNode } from "react";
import { AiOutlineCalendar, AiOutlineDashboard } from "react-icons/ai";
import { VscFeedback } from "react-icons/vsc";

export type LinkProps = {
  href?: string;
  label: ReactNode;
  icon?: ReactNode;
  links?: LinkProps[];
};

const links: LinkProps[] = [
  {
    label: "Main navigation",
  },
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: <AiOutlineDashboard size={20} />,
  },
  {
    label: "Resort Operations",
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: <AiOutlineCalendar size={20} />,
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    icon: <VscFeedback size={20} />,
  },
];

export default links;
