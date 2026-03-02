"use client";

import { getAccount, getEmployee, getEmployees, updateUserByHR, UpdateUserByHRPayload } from "@/services/accounts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import useUserId from "../authentication/useUserId";

export function useFetchAccount() {
    const userId = useUserId();
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["account", userId],
        queryFn: () => getAccount(userId as string, token),
        enabled: !!userId,
    });
}

// HR

export function useFetchEmployees() {
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["employees"],
        queryFn: () => getEmployees(token),
        enabled: !!token,
    });
}

export function useFetchEmployee(reference: string) {
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["employee", reference],
        queryFn: () => getEmployee(reference, token),
        enabled: !!token && !!reference,
    });
}

export function useUpdateEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            reference,
            data,
            headers,
        }: {
            reference: string;
            data: UpdateUserByHRPayload;
            headers: { headers: { Authorization: string } };
        }) => {
            return updateUserByHR(reference, data, headers);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}