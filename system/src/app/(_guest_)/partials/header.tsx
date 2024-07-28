"use client";

import logo from "@/assets/logo.png";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Navbar,
    Badge,
} from "@nextui-org/react";
import { Role } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { capitalize } from "@/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers";
import Button from "@/components/ui/Button";
import { TbBell } from "react-icons/tb";

export default function Header() {
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "About",
            href: "/about",
        },
        {
            label: "Contact",
            href: "/contact",
        },
        {
            label: "Reviews",
            href: "/reviews",
        },
    ];

    const logout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        router.push("/auth/login");
    };

    const user = useAuth();

    return (
        <Navbar
            maxWidth="xl"
            position="sticky"
            onMenuOpenChange={setIsMenuOpen}
            classNames={{
                base: "shadow-sm",
            }}
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand className="flex items-center gap-2 mt-2">
                    <Image
                        src={logo.src}
                        alt="Happy homes"
                        height={70}
                        width={70}
                        unoptimized
                        priority
                    />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
                <div className="hidden sm:flex gap-5 me-5 sm:me-0">
                    {menuItems.map((item, index) => (
                        <NavbarItem key={index}>
                            <Link color="foreground" href={item.href}>
                                {item.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </div>

                {user ? (
                    <>
                        <Badge content="0" shape="circle" color="primary">
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Button
                                        radius="full"
                                        isIconOnly
                                        aria-label="notifications"
                                        variant="light"
                                        color="default"
                                    >
                                        <TbBell size={24} />
                                    </Button>
                                </DropdownTrigger>

                                <DropdownMenu className="md:w-[320px]">
                                    <DropdownItem className="min-h-14">
                                        Notification 1
                                    </DropdownItem>
                                    <DropdownItem className="min-h-14">
                                        Notification 2
                                    </DropdownItem>
                                    <DropdownItem className="min-h-14">
                                        Notification 3
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Badge>

                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <div className="grid grid-cols-[27%_73%] gap-2 items-center cursor-pointer">
                                    <Image
                                        src={user.avatar ? `/storage/${user.avatar}` : logo.src}
                                        alt="User"
                                        height={50}
                                        width={50}
                                        className="rounded-full border-2 border-primary-300 p-[1px]"
                                    />
                                    <div className="flex flex-col">
                                        <h3 className="text-sm">
                                            {user.lastName.concat(" ".concat(user.firstName))}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            {capitalize(user.role)}
                                        </p>
                                    </div>
                                </div>
                            </DropdownTrigger>

                            {user.role == Role.ADMIN ? (
                                <DropdownMenu aria-label="Profile Admin" variant="flat">
                                    <DropdownItem key="admin" as={Link} href="/admin/dashboard">
                                        Go to dashboard
                                    </DropdownItem>
                                    <DropdownItem key="logout" color="danger" onClick={logout}>
                                        Log Out
                                    </DropdownItem>
                                </DropdownMenu>
                            ) : user.role == Role.USER ? (
                                <DropdownMenu aria-label="Profile User" variant="flat">
                                    <DropdownItem key="bookings" as={Link} href="/bookings">
                                        My Bookings
                                    </DropdownItem>
                                    <DropdownItem key="logout" color="danger" onClick={logout}>
                                        Log Out
                                    </DropdownItem>
                                </DropdownMenu>
                            ) : null}
                        </Dropdown>
                    </>
                ) : (
                    <NavbarItem>
                        <Link href="/auth/login">Log In</Link>
                    </NavbarItem>
                )}
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            color={
                                index === 2
                                    ? "primary"
                                    : index === menuItems.length - 1
                                        ? "danger"
                                        : "foreground"
                            }
                            className="w-full"
                            href={item.href}
                        >
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
