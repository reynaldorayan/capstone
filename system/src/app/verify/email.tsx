"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useUser from "@/hooks/useUser";
import { formatTimeLeft } from "@/lib/dayjs";
import {
    SendEmailOtpInput,
    VerifyEmailOtpInput,
    sendEmailOtpSchema,
    verifyEmailOtpSchema,
} from "@/schemas/verification";
import { delay } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function EmailVerification() {
    return (
        <div>
            <h2 className="font-medium">Email verification</h2>

            <SendOtp />
        </div>
    );
}

function SendOtp() {
    const [countdown, setCountdown] = useState(0);
    const [otpSent, setOtpSent] = useState(false);
    const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);

    const { user, isLoading, mutate } = useUser();

    if (isLoading) return <Spinner size="sm" className="mt-5 self-center" />;

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const { handleSubmit } = useForm<SendEmailOtpInput>({
        resolver: zodResolver(sendEmailOtpSchema),
        defaultValues: {
            email: user.email,
        },
    });

    const onSubmit = async (data: SendEmailOtpInput) => {
        setCountdown(60 * 2);

        try {
            const result = await axios.post("/api/auth/verify/email/send", data);

            if (result.data.success) {
                setOtpSent(true);
                await delay(1000)
                mutate()
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error);
            }
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <form onSubmit={handleSubmit(onSubmit)}>
                {!isVerifiedSuccess && (
                    <div className="flex flex-col gap-3 mt-1">
                        {countdown > 0 && (
                            <p className="text-sm">
                                Resend OTP in {formatTimeLeft(countdown)} seconds
                            </p>
                        )}

                        {countdown === 0 && !otpSent && (
                            <Button type="submit">Send Verification Code</Button>
                        )}

                        {countdown === 0 && otpSent && (
                            <Button type="submit">Resend Verification Code</Button>
                        )}
                    </div>
                )}
            </form>

            {otpSent && (
                <VerifyOtp
                    resetCountdown={() => setCountdown(0)}
                    verified={isVerifiedSuccess}
                    setVerified={setIsVerifiedSuccess}
                />
            )}
        </div>
    );
}

function VerifyOtp({
    resetCountdown,
    setVerified,
    verified,
}: {
    resetCountdown?: () => void;
    verified: boolean;
    setVerified: (value: boolean) => void;
}) {
    const { user, isLoading, mutate } = useUser();

    if (isLoading) return <Spinner size="sm" className="mt-5 self-center" />;

    const {
        handleSubmit,
        setError,
        register,
        formState: { isValid, isSubmitting, errors },
    } = useForm<VerifyEmailOtpInput>({
        resolver: zodResolver(verifyEmailOtpSchema),
        defaultValues: {
            email: user.email,
        },
    });

    const onSubmit = async (data: VerifyEmailOtpInput) => {
        try {
            const result = await axios.post("/api/auth/verify/email/verify", data);

            if (result.data.success) {
                setVerified(true);
                resetCountdown();
                await delay(1000)
                mutate()
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                setError("otp", { message: error.response?.data.error });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
                {!verified && (
                    <Input
                        aria-label="Enter 6 digits code"
                        placeholder="Enter 6 digits code"
                        type="number"
                        {...register("otp")}
                        error={errors.otp?.message || errors.email?.message}
                        isDisabled={isSubmitting}
                    />
                )}
                <Button
                    type="submit"
                    isDisabled={!isValid || isSubmitting || verified}
                    isLoading={isSubmitting}
                    color={verified ? "success" : "primary"}
                >
                    {verified ? "Email has been verified" : "Verify OTP"}
                </Button>
            </div>
        </form>
    );
}
