"use client";

import { fetcher } from "@/utils";
import { Review, User } from "@prisma/client";
import axios from "axios";
import dayjs from "dayjs";
import React from "react";
import useSWR from "swr";
import {
  VictoryPie,
  VictoryChart,
  VictoryTheme,
  VictoryStack,
  VictoryBar,
  VictoryAxis,
  VictoryLegend,
} from "victory";

type Sentiment = {
  reviewId?: string;
  score?: number;
};

type SentimentReview = Review & {
  sentiment?: string;
};

interface ProcessedData {
  month: string;
  positive: number;
  negative: number;
}

export default function Reviews() {
  const { data: reviews, isLoading: isLoadingReviews } = useSWR<Review[]>(
    "/api/reviews",
    fetcher
  );

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
        .then((res) => res.data)
  );

  if (isLoadingReviews) return <div>Loading reviews...</div>;

  if (isLoadingSentiments) return <div>Analyzing sentiments...</div>;

  const sentimentReviews = sentiments.map(({ reviewId, score }) => {
    const review = reviews.find((review) => review.id === reviewId);

    return {
      ...review,
      score,
      sentiment: score > 0.5 ? "positive" : "negative",
    };
  });

  console.log(sentimentReviews);

  const positiveData = sentimentReviews.filter(
    (d) => d.sentiment === "positive"
  );

  const negativeData = sentimentReviews.filter(
    (d) => d.sentiment === "negative"
  );

  const processData = (data: SentimentReview[]): ProcessedData[] => {
    const monthlyData: {
      [key: string]: { positive: number; negative: number };
    } = {};

    data.forEach(({ createdAt, sentiment }) => {
      const month = dayjs(createdAt).format("YYYY-MM"); // Extract the month in YYYY-MM format

      if (!monthlyData[month]) {
        monthlyData[month] = { positive: 0, negative: 0 };
      }

      if (sentiment === "positive") {
        monthlyData[month].positive += 1;
      } else if (sentiment === "negative") {
        monthlyData[month].negative += 1;
      }
    });

    return Object.keys(monthlyData).map((month) => ({
      month,
      positive: monthlyData[month].positive,
      negative: monthlyData[month].negative,
    }));
  };

  const processedData = processData(sentimentReviews);

  return (
    <div className="pt-5">
      {!isLoadingReviews && !isLoadingSentiments && (
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="flex flex-col gap-5 sm:flex-row w-full 2xl:w-8/12">
            <h2>Overall Sentiments</h2>
            <VictoryPie
              colorScale={["navy", "tomato"]}
              labels={({ datum }) => `${datum.x} (${datum.y})`}
              labelRadius={({ innerRadius }) => Number(innerRadius) + 20}
              innerRadius={70}
              labelPlacement="perpendicular"
              style={{
                labels: {
                  fontSize: 18,
                  fill: "white",
                  fontWeight: "bold",
                },
              }}
              data={[
                {
                  x: "Positive",
                  y: positiveData.length,
                },
                {
                  x: "Negative",
                  y: negativeData.length,
                },
              ]}
            />
          </div>

          <div>
            <h2>Monthly Reviews</h2>
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={20}
              width={500}
              height={300}
            >
              <VictoryLegend
                x={125}
                y={10}
                title="Legend"
                centerTitle
                orientation="horizontal"
                gutter={20}
                style={{ border: { stroke: "black" }, title: { fontSize: 14 } }}
                data={[
                  { name: "Positive", symbol: { fill: "navy" } },
                  { name: "Negative", symbol: { fill: "tomato" } },
                ]}
              />
              <VictoryAxis
                tickFormat={(x) => dayjs(x, "YYYY-MM").format("MMM YYYY")}
              />
              <VictoryAxis dependentAxis />
              <VictoryStack colorScale={["navy", "tomato"]}>
                <VictoryBar
                  data={processedData.sort(
                    (a, b) => dayjs(a.month).month() - dayjs(b.month).month()
                  )}
                  x="month"
                  y="positive"
                />
                <VictoryBar
                  data={processedData.sort(
                    (a, b) => dayjs(a.month).month() - dayjs(b.month).month()
                  )}
                  x="month"
                  y="negative"
                />
              </VictoryStack>
            </VictoryChart>
          </div>
        </div>
      )}
    </div>
  );
}
