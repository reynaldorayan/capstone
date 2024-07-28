"use client";

import Button from "@/components/ui/Button";
import usePagination from "@/hooks/usePagination";
import { fetcher } from "@/utils";
import { Spinner } from "@nextui-org/react";
import { Review, User } from "@prisma/client";
import axios from "axios";
import dayjs from "dayjs";
import pluralize from "pluralize";
import useSWR from "swr";

type ReviewWithUser = Review & {
  user?: User;
};

type Sentiment = {
  reviewId?: string;
  score?: number;
};

type SentimentReview = ReviewWithUser & {
  score?: number;
  sentiment?: string;
};

export default function Reviews() {
  const { data: reviews, isLoading: isLoadingReviews } = useSWR<
    ReviewWithUser[]
  >("/api/reviews", fetcher);

  const { data: sentiments, isLoading: isLoadingSentiments } = useSWR<
    Sentiment[]
  >(
    !isLoadingReviews && reviews.length > 0
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/sentiments`
      : null,
    (url: string) =>
      axios
        .post(
          url,
          JSON.stringify({
            reviews: reviews.map((review) => ({
              text: `${review.id}::${review.comment}`,
            })),
          }),
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res.data),
    {
      refreshInterval: 10,
    }
  );

  const sentimentReviews =
    sentiments &&
    sentiments.map(({ reviewId, score }) => {
      const review = reviews.find((review) => review.id === reviewId);

      return {
        ...review,
        score,
        sentiment: score > 0.5 ? "positive" : "negative",
      };
    });

  const {
    activePage,
    nextPage,
    previousPage,
    totalPages,
    items: paginatedItems,
  } = usePagination<SentimentReview>(sentimentReviews || [], 1, 10);

  if (isLoadingReviews)
    return (
      <div className="flex items-center gap-2 justify-center mt-16">
        <Spinner /> loading reviews...
      </div>
    );

  if (isLoadingSentiments)
    return (
      <div className="flex items-center gap-2 justify-center mt-16">
        <Spinner /> analyzing sentiments...
      </div>
    );

  return (
    <div className="flex flex-col gap-2 mt-10">
      <div className="w-full px-4 sm:container sm:mx-auto">
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <p className="text-sm text-gray-500">
          {reviews.length} {pluralize("review", reviews.length)} found
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-4 w-full sm:container sm:mx-auto">
        {paginatedItems.map((sentiment) => {
          return (
            <div
              key={sentiment.id}
              className="flex justify-between gap-2 p-5 shadow-md"
            >
              <div className="flex flex-col">
                <p>{sentiment.comment}</p>
                <p className="text-sm">
                  &mdash;{sentiment.alias || sentiment.user.firstName}
                </p>
              </div>
              <div className="text-sm flex flex-col justify-between">
                <p>{dayjs(sentiment.createdAt).format("MMMM DD YYYY")}</p>
                <p>
                  {sentiment.sentiment}&nbsp; ({Number(sentiment.score)})
                </p>
              </div>
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
    </div>
  );
}
