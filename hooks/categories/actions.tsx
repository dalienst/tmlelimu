"use client";

import { getCategories, getCategory } from "@/services/categories";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";


export function useFetchCategories() {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(headers),
    enabled: !!headers,
  });
}

export function useFetchCategory(reference: string) {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["category", reference],
    queryFn: () => getCategory(reference, headers),
    enabled: !!headers && !!reference,
  });
}
