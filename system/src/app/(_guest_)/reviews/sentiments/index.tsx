"use client";

import { useAuth } from "@/components/Providers";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import usePagination from "@/hooks/usePagination";
import { ReviewInput, reviewSchema } from "@/schemas/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@nextui-org/react";
import { User } from "@prisma/client";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import pluralize from "pluralize";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";

type ReviewWithUser = {
    id: string;
    comment: string;
    created_at: Date;
    alias: string;
    user?: User;
};

type Sentiment = {
    text: string;
    score: number;
    sentiment: string;
    emotion: string;
    user?: User;
};

export default function Sentiments() {
    const {
        data: reviews,
        isLoading: isLoadingReviews,
        mutate: refreshReviews,
    } = useSWR<ReviewWithUser[]>(
        "/api/reviews",
        (url: string) => axios.get(url).then((res) => res.data),
        { refreshInterval: 5000 }
    );

    const {
        activePage,
        nextPage,
        previousPage,
        totalPages,
        items: paginatedItems,
    } = usePagination<ReviewWithUser>(reviews || [], 1, 10);

    const refresh = () => {
        refreshReviews();
    };

    if (isLoadingReviews) {
        return (
            <div className="w-full min-h-screen flex gap-2 items-center justify-center">
                <Spinner /> loading reviews...
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 mt-10">
            <div className="w-full px-4 sm:container sm:mx-auto">
                <p className="text-sm text-gray-500">
                    {reviews.length} {pluralize("review", reviews.length)} found
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-4 w-full sm:container sm:mx-auto">
                {paginatedItems.map((review) => {
                    return (
                        <div key={review.id} className="flex flex-col gap-2 p-5 shadow-lg">
                            <h2 className="font-semibold">
                                {review.alias || review.user?.firstName}
                            </h2>
                            <p>{review.comment}</p>
                            <p className="text-sm font-medium">
                                {dayjs(review.created_at).format("MMM DD YYYY")}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="w-full px-4 sm:container sm:mx-auto mt-5 flex gap-3 items-center">
                <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onClick={previousPage}
                    isDisabled={activePage === 1}
                >
                    Previous
                </Button>
                <span className="text-sm">
                    Page {activePage} of {totalPages}{" "}
                </span>
                <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onClick={nextPage}
                    isDisabled={activePage === totalPages}
                >
                    Next
                </Button>
            </div>

            <PostReview refreshSentiments={refresh} />
        </div>
    );
}

function PostReview({ refreshSentiments }: { refreshSentiments: () => void }) {
    const router = useRouter();

    const {
        handleSubmit,
        register,
        getValues,
        setValue,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm<ReviewInput>({
        resolver: zodResolver(reviewSchema),
    });

    const onSubmit = async (data: ReviewInput) => {
        const result = await axios.post("/api/reviews", data);

        if (result.data.success) {
            toast.success("Review posted successfully");
        }

        refreshSentiments();
        reset();
        router.refresh();
    };

    console.log(errors);

    const user = useAuth();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full px-4 sm:max-w-lg sm:mx-auto mt-5 flex flex-col gap-3">
                <Textarea
                    label="Write a comment"
                    placeholder="Write a comment..."
                    {...register("comment")}
                    error={errors.comment?.message}
                    classNames={{ label: "text-base font-semibold" }}
                />

                <Checkbox
                    isDisabled={isSubmitting}
                    aria-label="isUsedAlias"
                    {...register("isUsedAlias")}
                    error={errors.isUsedAlias?.message}
                    onValueChange={(value) => {
                        if (value) {
                            setValue("userId", user?.id);
                        } else {
                            setValue("alias", "");
                        }
                    }}
                >
                    I want to use an alias
                </Checkbox>

                {getValues("isUsedAlias") ? (
                    <Input
                        label="Alias"
                        {...register("alias")}
                        error={errors.alias?.message}
                        classNames={{ label: "font-semibold" }}
                    />
                ) : (
                    <div>
                        <Input
                            className="hidden"
                            value={user?.id}
                            {...register("userId")}
                        />
                    </div>
                )}

                <p className="text-red-600 text-sm">
                    {errors.userId?.message}
                </p>

                <Button
                    isDisabled={isSubmitting}
                    type="submit"
                    color="primary"
                    className="w-fit font-medium"
                >
                    Post
                </Button>
            </div>

            <Toaster />
        </form>
    );
}
