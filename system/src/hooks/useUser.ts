"use client";

import { fetcher } from "@/utils";
import { User } from "@prisma/client";
import useSWR from "swr";

export default function useUser() {
  const { data, error, mutate, isLoading } = useSWR<{ user: User }>(
    "/api/auth",
    fetcher
  );

  return {
    mutate,
    user: data?.user,
    isLoading,
    error,
  };
}
