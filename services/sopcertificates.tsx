"use client"

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { User } from "./accounts";
import { Sops } from "./sops";

export interface SOPCertificate {
    id: string;
    reference: string;
    code: string;
    user: User;
    sop: Sops;
    issued_at: string;
    created_at: string;
    updated_at: string;
}

export const getSOPCertificates = async (
    headers: { headers: { Authorization: string } }
): Promise<SOPCertificate[]> => {
    const response: AxiosResponse<PaginatedResponse<SOPCertificate>> =
        await apiActions.get(`/api/v1/sopcertificates/`, headers);
    return response.data.results ?? [];
};

export const getSOPCertificateDownloadUrl = (reference: string): string => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
    const cleanBaseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
    return `${cleanBaseURL}/api/v1/sopcertificates/${reference}/download/`;
};

export const downloadSOPCertificate = async (
    reference: string,
    headers: { headers: { Authorization: string } }
): Promise<void> => {
    const response = await apiActions.get(
        `/api/v1/sopcertificates/${reference}/download/`,
        {
            ...headers,
            responseType: 'blob',
        }
    );
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
};
