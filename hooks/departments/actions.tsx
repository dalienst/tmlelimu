"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  getDepartments, 
  getDepartment, 
  getAuthDepartments, 
  getAuthDepartment
} from "@/services/departments";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchDepartments() {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => getDepartments(headers),
    enabled: !!headers,
  });
}

export function useFetchDepartment(reference: string) {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["department", reference],
    queryFn: () => getDepartment(reference, headers),
    enabled: !!headers && !!reference,
  });
}

// Authenticated

export function useFetchAuthDepartments() {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["auth-departments"],
    queryFn: () => getAuthDepartments(headers),
    enabled: !!headers,
  });
}

export function useFetchAuthDepartment(reference: string) {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["auth-department", reference],
    queryFn: () => getAuthDepartment(reference, headers),
    enabled: !!headers && !!reference,
  });
}