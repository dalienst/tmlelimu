"use client";

import { getSops, getSop, getAuthSop, getAuthSops, SOPFetchParams } from "@/services/sops";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";


export function useFetchSops() {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["sops"],
    queryFn: () => getSops(headers),
    enabled: !!headers,
  });
}

export function useFetchSop(reference: string) {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["sop", reference],
    queryFn: () => getSop(reference, headers),
    enabled: !!headers && !!reference,
  });
}




// Authenticated

export function useFetchAuthSops(params?: SOPFetchParams) {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["auth-sops", params],
    queryFn: () => getAuthSops(headers, params),
    enabled: !!headers,
  });
}

export function useFetchAuthSop(reference: string) {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["auth-sop", reference],
    queryFn: () => getAuthSop(reference, headers),
    enabled: !!headers && !!reference,
  });
}