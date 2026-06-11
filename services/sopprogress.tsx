"use client"

import { apiActions, apiMultipartActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { Department } from "./departments";
import { Sops } from "./sops";


export interface SOPProgress {
 id: string;
 reference: string;
 sop: Sops;
 user: string;
 status: string;
 highest_page_read: number;
 max_scroll_percent: number;
 first_opened_at: string;
 last_read_at: string;
 completed_at: string;
 created_at: string;
 updated_at: string;
 code: string;
}

export interface SOPProgressPayload {
    sop_reference: string;
    max_scroll_percent: number;
}

export const getSOPsProgresses = async (
    headers: { headers: { Authorization: string } }
): Promise<SOPProgress[]> => {
    const response: AxiosResponse<PaginatedResponse<SOPProgress>> =
        await apiActions.get(`/api/v1/sopprogress/`, headers);
    return response.data.results ?? [];
};


export const updateSOPProgressBySOP = async (sop_reference: string, payload: { highest_page_read: number }, headers: { headers: { Authorization: string } }): Promise<SOPProgress> => {
    const response: AxiosResponse<SOPProgress> =
        await apiActions.patch(`/api/v1/sopprogress/update-by-sop/${sop_reference}/`, payload, headers);
    return response.data;
};