"use client";

import { getSOPCertificates } from "@/services/sopcertificates";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchSOPCertificates() {
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["sopcertificates"],
        queryFn: () => getSOPCertificates(token),
        enabled: !!token,
    });
}
