"use client";

import { getAccount, getEmployee, getEmployees } from "@/services/accounts";
import { useQuery } from "@tanstack/react-query";
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

