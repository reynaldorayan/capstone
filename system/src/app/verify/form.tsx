"use client";

import MobileVerification from "./mobile";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import React from "react";
import useUser from "@/hooks/useUser";

export default function VerifyForm() {
    const { user, isLoading, } = useUser();

    const router = useRouter();

    return (
        <div className="h-screen w-screen p-5 grid place-items-center">
            <div className="min-h-80 w-full sm:max-w-sm mx-auto border border-gray-50 shadow-2xl rounded-lg">
                <div className="p-5">
                    <div className="flex flex-col items-center gap-1 mt-5">
                        <h1 className="text-xl font-bold">Account verification</h1>
                        <p>Please complete verification to continue</p>
                    </div>

                    <div className="flex flex-col gap-5 mt-5">
                        {!isLoading && user.mobileVerifiedAt === null ? (
                            <MobileVerification />
                        ) : null}
                    </div>

                    {!isLoading && user.mobileVerifiedAt !== null ? (
                        <div>
                            <p className="mt-5 text-center text-gray-500 flex flex-col gap-1 items-center">
                                <span>Your account has been verified successfully.</span>
                                <Link className="text-primary-600" href="/">
                                    Go to home
                                </Link>
                            </p>
                        </div>
                    ) : null}

                    <div className="flex justify-center mt-5">
                        <Button
                            variant="light"
                            color="danger"
                            onClick={async () => {
                                await axios.post("/api/auth/logout");
                                router.push("/auth/login");
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
