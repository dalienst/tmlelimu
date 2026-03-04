"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  getDepartments, 
  getDepartment, 
  getAuthDepartments, 
  getAuthDepartment,
  createDepartment,
  updateDepartment,
  addHeadToDepartment,
  addStaffToDepartment,
  deleteDepartment
} from "@/services/departments";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => getDepartments(),
  });
}

export function useFetchDepartment(reference: string) {
  return useQuery({
    queryKey: ["department", reference],
    queryFn: () => getDepartment(reference),
    enabled: !!reference,
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

// Mutations

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      headers,
    }: {
      data: any;
      headers: { headers: { Authorization: string } };
    }) => {
      return createDepartment(data, headers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reference,
      data,
      headers,
    }: {
      reference: string;
      data: any;
      headers: { headers: { Authorization: string } };
    }) => {
      return updateDepartment(reference, data, headers);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["auth-departments"] });
      queryClient.invalidateQueries({ queryKey: ["auth-department", variables.reference] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department", variables.reference] });
    },
  });
}

export function useAddHeadToDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reference,
      data,
      headers,
    }: {
      reference: string;
      data: any;
      headers: { headers: { Authorization: string } };
    }) => {
      return addHeadToDepartment(reference, data, headers);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["auth-department", variables.reference] });
      queryClient.invalidateQueries({ queryKey: ["department", variables.reference] });
    },
  });
}

export function useAddStaffToDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reference,
      data,
      headers,
    }: {
      reference: string;
      data: any;
      headers: { headers: { Authorization: string } };
    }) => {
      return addStaffToDepartment(reference, data, headers);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["auth-department", variables.reference] });
      queryClient.invalidateQueries({ queryKey: ["department", variables.reference] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reference,
      headers,
    }: {
      reference: string;
      headers: { headers: { Authorization: string } };
    }) => {
      return deleteDepartment(reference, headers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}