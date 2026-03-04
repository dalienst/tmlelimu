"use client";

import { getSops, getSop, getAuthSop, getAuthSops } from "@/services/sops";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";

interface CreateSopParams {
  formData: FormData;
  headers: { headers: { Authorization: string } };
}

interface UpdateSopParams {
  reference: string;
  formData: FormData;
  headers: { headers: { Authorization: string } };
}

interface DeleteSopParams {
  reference: string;
  headers: { headers: { Authorization: string } };
}

export function useFetchSops() {
  return useQuery({
    queryKey: ["sops"],
    queryFn: () => getSops(),
  });
}

export function useFetchSop(reference: string) {
  return useQuery({
    queryKey: ["sop", reference],
    queryFn: () => getSop(reference),
    enabled: !!reference,
  });
}




// Authenticated

export function useFetchAuthSops() {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["auth-sops"],
    queryFn: () => getAuthSops(headers),
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