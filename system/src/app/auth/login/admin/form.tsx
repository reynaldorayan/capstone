"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { LoginSchema, loginSchema } from "@/schemas/auth";
import { delay } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import bg from "@/assets/Contact us.jpg";

export default function LoginForm() {

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);

    const {
        handleSubmit,
        register,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const submitHandler = async (data: LoginSchema) => {
        try {
            const result = await axios.post("/api/auth/login/admin", data);

            if (result.data.success) {
                setIsLoginSuccess(true);

                await delay(1000);

                router.push("/admin/dashboard");
                router.refresh()
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const err = error.response?.data.error;

                for (const key in err) {
                    setError(key as keyof LoginSchema, { message: err[key] });
                }
            } else console.error("Unknown error: ", error);
        }
    };

    useEffect(() => {
        return () => {
            setIsLoginSuccess(false);
            reset();
        };
    }, [reset]);

    const bgStyles = {
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${bg.src}')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "top",
    };

    return (
        <div className="h-screen w-screen p-5 grid place-items-center" style={{ ...bgStyles }}>
            <div className="min-h-80 w-full sm:max-w-sm mx-auto border border-gray-50/50 backdrop-blur-sm bg-white/80 shadow-2xl rounded-lg">
                <div className="p-5">
                    <div className="flex flex-col items-center gap-1 mt-5">
                        <h1 className="text-xl font-bold">Welcome back Admin!</h1>
                        <p>Login to your account</p>
                    </div>
                    <form
                        className="mt-5 flex flex-col gap-5"
                        onSubmit={handleSubmit(submitHandler)}
                    >
                        <Input
                            label="Username"
                            type="text"
                            placeholder="Your username"
                            {...register("username")}
                            error={errors.username?.message}
                            isDisabled={isSubmitting}
                        />
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Your password"
                            endContent={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-500 focus:outline-none"
                                >
                                    {!showPassword ? (
                                        <AiOutlineEye size={20} />
                                    ) : (
                                        <AiOutlineEyeInvisible size={20} />
                                    )}
                                </button>
                            }
                            {...register("password")}
                            error={errors.password?.message}
                            isDisabled={isSubmitting}
                        />
                        <Button
                            type="submit"
                            isDisabled={isSubmitting || isLoginSuccess}
                            isLoading={isSubmitting}
                            color={isLoginSuccess ? "success" : "primary"}
                        >
                            {isLoginSuccess ? "Login successfully" : "Login"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
